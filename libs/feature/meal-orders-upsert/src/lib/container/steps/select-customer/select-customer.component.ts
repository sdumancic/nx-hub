import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";
import { materialModules } from "@hub/shared/ui/material";
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  merge,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap
} from "rxjs";
import { CustomerSearchResultUi } from "../../../model/customer-search-result-ui.interface";
import { MealOrdersUpsertFacadeService } from "../../../facade/meal-orders-upsert-facade.service";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormMode } from "../../../model/form-mode.enum";
import { MealOrdersUpsertMapper } from "../../../facade/meal-orders-upsert.mapper";
import { CustomerSearchFormService } from "../../../forms/customer-search-form.service";
import { GoogleMapsModule } from "@angular/google-maps";
import { GOOGLE_MAPS_API_KEY } from "@hub/shared/util/app-config";

@Component({
  selector: "hub-select-customer",
  standalone: true,
  imports: [CommonModule, ...materialModules, GoogleMapsModule],
  templateUrl: "./select-customer.component.html",
  styleUrls: ["./select-customer.component.scss"]
})
export class SelectCustomerComponent implements OnInit, OnDestroy {
  @Input() orderId: number;
  @Input() createNewCustomer$: Observable<void>;
  @Input() saveNewCustomer$: Observable<void>;
  @Input() cancelCreateNewCustomer$: Observable<void>;

  form:FormGroup;
  searchTermControl = new FormControl<string>(null);
  customerSearchList$: Observable<CustomerSearchResultUi[] | []>;
  searchLocationControl = new FormControl<string>(null);
  isLoading$: Observable<boolean>;
  showNoDataFound$ = new BehaviorSubject<boolean>(false);
  selectedLocation: google.maps.GeocoderResult;
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  apiLoaded: Observable<boolean>;
  zoom = 13;
  display: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];

  private readonly unsubscribe$ = new Subject<void>();
  private readonly customerManualList$ = new BehaviorSubject<CustomerSearchResultUi[]>(
    []
  );
  filteredLocations: Observable<google.maps.GeocoderResult[]>;


  constructor(
    protected facade: MealOrdersUpsertFacadeService,
    private customerFormService: CustomerSearchFormService,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(GOOGLE_MAPS_API_KEY) public googleMapsApiKey: string,
  ) {
    this.form = this.customerFormService.createFormGroup();
    this.disableForm();

    this.apiLoaded = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}`,
        "callback"
      )
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          this.snackBar.open("Error when loading google maps ", err, { duration: 3000 });
          return of(false);
        })
      );
  }

  ngOnInit(): void {
    this.customerSearchList$ = merge(this.customerSearchResult$, this.customerManualList$);
    this.positionMapToCurrentPosition();
    this.subscribeToLocationSearch();
    this.createNewCustomer$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.onCreateNewCustomer())
    this.saveNewCustomer$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => this.onSaveCustomer())
    this.cancelCreateNewCustomer$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => this.onCancelCreateNewCustomer())
  }

  private get customerSearchResult$(): Observable<CustomerSearchResultUi[] | []> {
    return this.searchTermControl.valueChanges.pipe(
      debounceTime(400),
      filter((val) => val && val.length && val.length > 2),
      switchMap((term: string) => {
        return this.isValidSearchValue(term)
          ? this.searchCustomers$(term)
          : of([]);
      }),
      tap((res: CustomerSearchResultUi[]) => {
        if (res.length === 0) {
          this.searchTermControl.setValue(null, { emitEvent: false });
          this.showNoDataFound$.next(true);
        }
      }),
      takeUntil(this.unsubscribe$)
    );
  }

  private readonly isValidSearchValue = (term: string): boolean => {
    return term.trim().length > 0 ? true : false;
  };

  private searchCustomers$(
    searchTerm: string
  ): Observable<CustomerSearchResultUi[]> {
    this.showNoDataFound$.next(false);
    return this.facade.searchCustomer$(searchTerm).pipe(
      catchError(() => {
        return EMPTY;
      })
    );
  }

  resetCustomerValue() {
    this.resetReadonlyAndList();
    this.searchTermControl.setValue(null);
    this.facade.selectCustomer(null);
    this.selectedLocation = null;
    this.customerFormService.resetValue();
    this.markerPositions = [];
  }

  onCustomerSelected(value: CustomerSearchResultUi) {
    this.facade.customerFormMode = FormMode.Initial
    this.customerFormService.setValue(MealOrdersUpsertMapper.fromCustomerSearchResultUiToForm(value));
    this.center = {
      lat: value.latitude,
      lng: value.longitude
    };
    this.markerPositions = [];
    this.facade.selectCustomer(value);
    this.markerPositions.push(this.center);
  }

  getOptionText = (option: CustomerSearchResultUi): string => {
    if (option) {
      return option?.firstName + " " + option?.lastName + " (" + option?.address + ")";
    }
    return null;
  };

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng.toJSON();
  }
  private resetReadonlyAndList(): void {
    this.customerManualList$.next([]);
    this.showNoDataFound$.next(false);
  }

  resetLocationValue() {
    this.searchLocationControl.setValue(null);
    this.customerFormService.latitudeControl.reset()
    this.customerFormService.longitudeControl.reset()
    this.selectedLocation = null;
  }


  onLocationSelected(geocoderResult: any ) {
    const {lat, lng} = geocoderResult.geometry.location;
    const streetNumber = geocoderResult.address_components.find(x => x.types?.find(y => y === 'street_number'));
    const street = geocoderResult.address_components.find(x => x.types?.find(y => y === 'route'));
    const streetAddress = geocoderResult.address_components.find(x => x.types?.find(y => y === 'street_address'));
    const city = geocoderResult.address_components.find(x => x.types?.find(y => y === 'locality'));

    const foundStreet = streetAddress ? streetAddress["long_name"] : street ? street["long_name"] : null;
    let completeAddress = ''
    if (foundStreet){
      completeAddress = foundStreet;
      if (streetNumber){
        completeAddress = completeAddress.concat(" ").concat(streetNumber["long_name"])
      }
    }

    this.markerPositions = [];
    this.markerPositions.push({ lat, lng });
    this.center = { lat, lng };
    this.customerFormService.setValue({
      city: city ? city["long_name"] : null,
      address: completeAddress ? completeAddress : null,
      latitude: lat,
      longitude: lng
    })
    this.selectedLocation = geocoderResult;
  }


  getLocationText(option: google.maps.GeocoderResult) {
    if (option) {
      return option.formatted_address;
    } else return null;
  }

  onSaveCustomer() {
    this.validateForm();
    if (this.form.invalid){
      return;
    }
    this.saveCustomerAndSetFormModeToInitial();

  }

  private validateForm(){
    this.form.markAllAsTouched()
    this.searchLocationControl.markAsTouched();
    this.searchLocationControl.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
  onUpdateCustomer() {
    this.facade.customerFormMode = FormMode.Edit;
    this.enableForm();
  }

  onUpdateCustomerSave() {
    this.validateForm();
    if (this.form.invalid){
      return;
    }
    this.saveCustomerAndSetFormModeToInitial();
  }

  onCancelEdit() {
    this.facade.customerFormMode = FormMode.Initial;
    this.customerFormService.setValue(this.facade.getSelectedCustomer())
    this.disableForm();
  }

  private disableForm(): void{
    this.searchTermControl.enable();
    this.customerFormService.disableFormControls();
    this.searchLocationControl.disable();
    this.searchLocationControl.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  private enableForm(): void{
    this.searchLocationControl.enable();
    this.searchTermControl.disable();
    this.customerFormService.enableFormControls();
  }

  private saveCustomerAndSetFormModeToInitial(): void {
    const message = this.customerFormService.formGroupRawValue.id ? "Customer updated" : "Customer created";
    this.facade.saveCustomer$(this.customerFormService.formGroupRawValue)
      .pipe(take(1))
      .subscribe(customer => {
        this.facade.customerFormMode = FormMode.Initial;
        this.disableForm();
        this.snackBar.open(message, null, {duration: 2000});
      });
  }

  private positionMapToCurrentPosition(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  private subscribeToLocationSearch(): void {
    this.filteredLocations = this.searchLocationControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        startWith(''),
        debounceTime(800),
        distinctUntilChanged(),
        filter(val => val !== null && val.length > 2),
        switchMap(val => {
          return this.httpClient.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(val)}&key=${this.googleMapsApiKey}`)
        }),
        map(val => val.results)
      );
  }

  onCreateNewCustomer() {
    this.facade.customerFormMode = FormMode.New;
    this.enableForm();
  }

  onCancelCreateNewCustomer() {
    this.facade.customerFormMode = FormMode.Initial;
    this.disableForm()
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
