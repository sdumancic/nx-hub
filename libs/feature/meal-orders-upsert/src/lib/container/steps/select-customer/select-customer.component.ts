import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
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
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormMode } from "../../../model/form-mode.enum";
import { MealOrdersUpsertMapper } from "../../../facade/meal-orders-upsert.mapper";
import { CustomerSearchFormService } from "../../../forms/customer-search-form.service";
import { GoogleMapsModule } from "@angular/google-maps";
import { GoogleMapsFacadeService } from "../../../facade/google-maps-facade.service";

@Component({
  selector: "hub-select-customer",
  standalone: true,
  imports: [CommonModule, ...materialModules, GoogleMapsModule],
  templateUrl: "./select-customer.component.html",
  styleUrls: ["./select-customer.component.scss"],
  providers: [GoogleMapsFacadeService]
})
export class SelectCustomerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() orderId: number;
  @Input() createNewCustomer$: Observable<void>;
  @Input() saveNewCustomer$: Observable<void>;
  @Input() cancelCreateNewCustomer$: Observable<void>;
  @Input() selectedCustomer: CustomerSearchResultUi;

  form: FormGroup;
  searchTermControl = new FormControl<string>(null);
  customerSearchList$: Observable<CustomerSearchResultUi[] | []>;
  searchLocationControl = new FormControl<string>(null);
  isLoading$: Observable<boolean>;
  showNoDataFound$ = new BehaviorSubject<boolean>(false);
  apiLoaded: Observable<boolean>;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  filteredLocations: Observable<google.maps.GeocoderResult[]>;
  private readonly unsubscribe$ = new Subject<void>();
  private readonly customerManualList$ = new BehaviorSubject<CustomerSearchResultUi[]>(
    []
  );

  constructor(
    protected facade: MealOrdersUpsertFacadeService,
    protected googleMapsFacade: GoogleMapsFacadeService,
    private customerFormService: CustomerSearchFormService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.customerFormService.createFormGroup();
    this.disableForm();
    this.apiLoaded = this.googleMapsFacade.loadGoogleMaps$();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['selectedCustomer']){
      if (this.selectedCustomer  !== undefined){
        this.onCustomerSelected(this.selectedCustomer)
      }
    }

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

  ngOnInit(): void {
    this.customerSearchList$ = merge(this.customerSearchResult$, this.customerManualList$);
    this.googleMapsFacade.positionMapToCurrentPosition();
    this.subscribeToLocationSearch();
    this.createNewCustomer$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.onCreateNewCustomer());
    this.saveNewCustomer$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => this.onSaveCustomer());
    this.cancelCreateNewCustomer$.pipe(takeUntil(this.unsubscribe$)).subscribe(val => this.onCancelCreateNewCustomer());
  }

  getOptionText = (option: CustomerSearchResultUi): string => {
    if (option) {
      return option?.firstName + " " + option?.lastName + " (" + option?.address + ")";
    }
    return null;
  };

  getLocationText(option: google.maps.GeocoderResult): string {
    if (option) {
      return option.formatted_address;
    } else return null;
  }

  onSaveCustomer(): void {
    this.validateForm();
    if (this.form.invalid) {
      return;
    }
    this.saveCustomerAndSetFormModeToInitial();

  }

  onUpdateCustomer(): void {
    this.facade.customerFormMode = FormMode.Edit;
    this.enableForm();
  }

  onUpdateCustomerSave(): void {
    this.validateForm();
    if (this.form.invalid) {
      return;
    }
    this.saveCustomerAndSetFormModeToInitial();
  }

  onCancelEdit(): void {
    this.facade.customerFormMode = FormMode.Initial;
    this.customerFormService.setValue(this.facade.getSelectedCustomer());
    this.disableForm();
  }

  onCreateNewCustomer(): void {
    this.facade.customerFormMode = FormMode.New;
    this.enableForm();
  }

  onCancelCreateNewCustomer(): void {
    this.facade.customerFormMode = FormMode.Initial;
    this.disableForm();
  }

  protected resetCustomerValue(): void {
    this.resetReadonlyAndList();
    this.searchTermControl.setValue(null);
    this.facade.selectCustomer(null);
    this.googleMapsFacade.setSelectedLocation(null);
    this.customerFormService.resetValue();
    this.googleMapsFacade.setMarkerPositions([]);
  }

  protected onCustomerSelected(customer: CustomerSearchResultUi): void {
    this.facade.customerFormMode = FormMode.Initial;
    this.customerFormService.setValue(MealOrdersUpsertMapper.fromCustomerSearchResultUiToForm(customer));
    this.googleMapsFacade.setCenter({
      lat: customer.latitude,
      lng: customer.longitude
    });
    this.facade.selectCustomer(customer);
    this.googleMapsFacade.setMarkerPosition(this.googleMapsFacade.getCenter());
  }

  protected resetLocationValue(): void {
    this.searchLocationControl.setValue(null);
    this.customerFormService.latitudeControl.reset();
    this.customerFormService.longitudeControl.reset();
    this.googleMapsFacade.setSelectedLocation(null);
  }

  protected onLocationSelected(geocoderResult: any): void {
    const { completeAddress, city, lat, lng } = this.googleMapsFacade.extractAddress(geocoderResult);
    this.googleMapsFacade.setMarkerPosition({ lat, lng });
    this.googleMapsFacade.setSelectedLocation(geocoderResult);
    this.googleMapsFacade.setCenter({ lat, lng });
    this.customerFormService.setValue({
      city: city ? city["long_name"] : null,
      address: completeAddress ? completeAddress : null,
      latitude: lat,
      longitude: lng
    });
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

  private validateForm(): void {
    this.form.markAllAsTouched();
    this.searchLocationControl.markAsTouched();
    this.searchLocationControl.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  private disableForm(): void {
    this.searchTermControl.enable();
    this.customerFormService.disableFormControls();
    this.searchLocationControl.disable();
    this.searchLocationControl.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  private enableForm(): void {
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
        this.snackBar.open(message, null, { duration: 2000 });
      });
  }

  private subscribeToLocationSearch(): void {
    this.filteredLocations = this.searchLocationControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        startWith(""),
        debounceTime(800),
        distinctUntilChanged(),
        filter(val => val !== null && val.length > 2),
        switchMap(val => this.googleMapsFacade.findAddress$(val)),
        map(val => val.results)
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
