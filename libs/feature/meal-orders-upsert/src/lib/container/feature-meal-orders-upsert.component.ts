import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { materialModules } from "@hub/shared/ui/material";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { StepperSideboardComponent } from "@hub/shared/ui/stepper";
import { SharedUiSectionComponent, SharedUiSectionGroupComponent } from "@hub/shared/ui/section";
import { SharedUiSideboardComponent } from "@hub/shared/ui/sideboard";
import { MealOrdersUpsertFacadeService } from "../facade/meal-orders-upsert-facade.service";
import { MealsTableComponent } from "../presentation/meals-table/meals-table.component";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";
import { GoogleMapsModule, MapDirectionsService, MapInfoWindow, MapMarker } from "@angular/google-maps";
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
import { CartItem } from "@hub/shared/model/food-models";
import { MealOrderCartSmallComponent } from "@hub/feature/meal-order-cart";
import { CartInMemoryService } from "../data-access/cart-in-memory.service";
import { FormControl, FormGroup } from "@angular/forms";
import { CustomerSearchFormService } from "../forms/customer-search-form.service";
import { CustomerSearchResultUi } from "../model/customer-search-result-ui.interface";
import { GOOGLE_MAPS_API_KEY } from "@hub/shared/util/app-config";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormMode } from "../model/form-mode.enum";
import { MealOrdersUpsertMapper } from "../facade/meal-orders-upsert.mapper";

@Component({
  selector: "hub-feature-meal-orders-upsert",
  standalone: true,
  imports: [CommonModule, ...materialModules, CdkStepperModule, StepperSideboardComponent, SharedUiSectionGroupComponent,
    SharedUiSectionComponent, SharedUiSideboardComponent, MealsTableComponent, MealOrderCartSmallComponent, GoogleMapsModule],
  templateUrl: "./feature-meal-orders-upsert.component.html",
  styleUrls: ["./feature-meal-orders-upsert.component.scss"],
  providers: [
    MealOrdersUpsertFacadeService,
    CartInMemoryService,
    CustomerSearchFormService
  ]
})
export class FeatureMealOrdersUpsertComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild('cdkStepper') stepper: StepperSideboardComponent;
  mode: FormMode;
  selectedLocation: google.maps.GeocoderResult;
  selectedCustomer:CustomerSearchResultUi;
  categories$ = this.facade.categories$;
  cartItems$: Observable<CartItem[]> = this.facade.cartItems$;
  orderId: number;
  searchValue: string = null;
  selectedCategoryId = 3;
  form!: FormGroup;
  searchTermControl = new FormControl<string>(null);
  searchLocationControl = new FormControl<string>(null);
  isLoading$: Observable<boolean>;
  showNoDataFound$ = new BehaviorSubject<boolean>(false);
  customerSearchList$: Observable<CustomerSearchResultUi[] | []>;
  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 13;
  display: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  directionsResults$: Observable<google.maps.DirectionsResult | undefined>;
  private readonly unsubscribe$ = new Subject<void>();
  private readonly customerManualList$ = new BehaviorSubject<CustomerSearchResultUi[]>(
    []
  );
  filteredLocations: Observable<google.maps.GeocoderResult[]>;

  constructor(
    private route: ActivatedRoute,
    private formService: CustomerSearchFormService,
    @Inject(GOOGLE_MAPS_API_KEY) private googleMapsApiKey: string,
    httpClient: HttpClient,
    mapDirectionsService: MapDirectionsService,
    private facade: MealOrdersUpsertFacadeService,
    private http:HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.form = this.formService.createFormGroup();

    //this.formService.disableFormControls();
    //this.searchLocationControl.disable();
    this.disableForm();

    this.apiLoaded = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`,
        "callback"
      )
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
      );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.stepper.next()
    },5);

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

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng.toJSON();
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  ngOnInit() {
    this.customerSearchList$ = merge(this.customerSearchResult$, this.customerManualList$);
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });


    this.filteredLocations = this.searchLocationControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        startWith(''),
        debounceTime(800),
        distinctUntilChanged(),
        filter(val => val !== null && val.length > 2),
        switchMap(val => {
          return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(val)}&key=${this.googleMapsApiKey}`)
        }),
        map(val => val.results)
      );


    this.route.params.subscribe(params => {
      if (params) {
        this.orderId = +params;
      }
    });
  }

  onSearchKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.searchMeals();
    }
  }

  onAddToCart(meal: IMealsSearchResultUi) {
    this.facade.addToCart(meal);
  }

  onItemsChanged(items: CartItem[]) {
    this.facade.setCartItems(items);
  }

  emptyCart() {
    this.facade.setCartItems([]);
  }

  resetCustomerValue() {
    this.resetReadonlyAndList();
    this.searchTermControl.setValue(null);
    this.selectedCustomer = null;
    this.formService.resetValue();
    this.markerPositions = [];
  }

  onCustomerSelected(value: CustomerSearchResultUi) {
    this.mode = FormMode.Initial
    this.formService.setValue(MealOrdersUpsertMapper.fromCustomerSearchResultUiToForm(value));
    this.center = {
      lat: value.latitude,
      lng: value.longitude
    };
    this.markerPositions = [];
    this.selectedCustomer = value;
    this.markerPositions.push(this.center);
  }

  getOptionText = (option: CustomerSearchResultUi): string => {
    if (option) {
      return option?.firstName + " " + option?.lastName + " (" + option?.address + ")";
    }
    return null;
  };

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected searchMeals(): void {
    this.facade.executeSearch(this.selectedCategoryId, this.searchValue);
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

  private resetReadonlyAndList(): void {
    this.customerManualList$.next([]);
    this.showNoDataFound$.next(false);
  }

  resetLocationValue() {
    this.searchLocationControl.setValue(null);
    this.formService.latitudeControl.reset()
    this.formService.longitudeControl.reset()
    this.selectedLocation = null;
  }


  onLocationSelected(value: google.maps.GeocoderResult ) {

    const streetNumber = value.address_components.find(x => x.types?.find(y => y === 'street_number'));
    const street = value.address_components.find(x => x.types?.find(y => y === 'route'));
    const streetAddress = value.address_components.find(x => x.types?.find(y => y === 'street_address'));
    const city = value.address_components.find(x => x.types?.find(y => y === 'locality'));

    const foundStreet = streetAddress ? streetAddress["long_name"] : street ? street["long_name"] : null;
    let completeAddress = ''
    if (foundStreet){
      completeAddress = foundStreet;
      if (streetNumber){
        completeAddress = completeAddress.concat(" ").concat(streetNumber["long_name"])
      }
    }
    const foundLocation: google.maps.LatLngLiteral  = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lat: value.geometry.location.lat,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lng: value.geometry.location.lng
    };
    this.markerPositions = [];
    this.markerPositions.push(foundLocation);
    this.center = foundLocation;
    this.formService.latitudeControl.setValue(value.geometry.location.lat);
    this.formService.longitudeControl.setValue(value.geometry.location.lng);
    this.formService.setValue({
      city: city ? city["long_name"] : null,
      address: completeAddress ? completeAddress : null,
      latitude: foundLocation.lat,
      longitude: foundLocation.lng
    })
    this.selectedLocation = value;
  }


  getLocationText(option: google.maps.GeocoderResult) {
    if (option) {
      return option.formatted_address;
    } else return null;
  }

  createNewCustomer() {
    this.mode = FormMode.New;
    this.enableForm();
  }

  cancelEdit() {
    this.mode = FormMode.Initial;
    this.disableForm()
  }

  saveCustomer() {
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
    this.mode = FormMode.Edit;
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
    this.mode = FormMode.Initial;
    this.disableForm();
  }

  private disableForm(): void{
    this.searchTermControl.enable();
    this.formService.disableFormControls();
    this.searchLocationControl.disable();
    this.searchLocationControl.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  private enableForm(): void{
    this.searchLocationControl.enable();
    this.searchTermControl.disable();
    this.formService.enableFormControls();
  }

  private saveCustomerAndSetFormModeToInitial(): void {
    const message = this.formService.formGroupRawValue.id ? "Customer updated" : "Customer created";
    this.facade.saveCustomer$(this.formService.formGroupRawValue)
      .pipe(take(1))
      .subscribe(customer => {
        this.mode = FormMode.Initial;
        this.disableForm();
        this.snackBar.open(message, null, {duration: 2000});
      });
  }
}

