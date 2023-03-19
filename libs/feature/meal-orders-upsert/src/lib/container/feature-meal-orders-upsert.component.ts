import { Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  EMPTY,
  filter,
  map,
  merge,
  Observable, of,
  Subject,
  switchMap,
  takeUntil,
  tap
} from "rxjs";
import { CartItem } from "@hub/shared/model/food-models";
import { MealOrderCartSmallComponent } from "@hub/feature/meal-order-cart";
import { CartInMemoryService } from "../data-access/cart-in-memory.service";
import { FormControl, FormGroup } from "@angular/forms";
import { CustomerSearchFormService } from "../forms/customer-search-form.service";
import { CustomerSearchUi } from "../model/customer-search-ui.interface";
import { CustomerSearchResultUi } from "../model/customer-search-result-ui.interface";
import { CustomerFormUi } from "../forms/customer-form-ui.interface";
import { GoogleMapsModule, MapDirectionsService, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { GOOGLE_MAPS_API_KEY } from "@hub/shared/util/app-config";
import { HttpClient } from "@angular/common/http";

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
export class FeatureMealOrdersUpsertComponent implements OnInit, OnDestroy {

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  categories$ = this.facade.categories$;
  cartItems$: Observable<CartItem[]> = this.facade.cartItems$;
  orderId: number;
  searchValue: string = null;
  selectedCategoryId = 3;
  form!: FormGroup
  searchTermControl = new FormControl<string>(null);
  isLoading$ : Observable<boolean>;
  private readonly unsubscribe$ = new Subject<void>();
  showNoDataFound$ = new BehaviorSubject<boolean>(false)
  customerSearchList$: Observable<CustomerSearchResultUi[] | []>
  private readonly customerManualList$ = new BehaviorSubject<CustomerSearchResultUi[]>(
    []
  )
  readonly = false
  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 14;
  display: google.maps.LatLngLiteral
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  constructor(
    private route: ActivatedRoute,
    private formService: CustomerSearchFormService,
    @Inject(GOOGLE_MAPS_API_KEY) private googleMapsApiKey: string,
    httpClient: HttpClient,
    mapDirectionsService: MapDirectionsService,
    private facade: MealOrdersUpsertFacadeService) {
    this.form = this.formService.createFormGroup();
    this.formService.disableFormControls()

    this.apiLoaded = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError((err) => {
          console.log(err);
          return of(false);
        })
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
    this.customerSearchList$ = merge(this.customerSearchResult$, this.customerManualList$)

    this.route.params.subscribe(params => {
      if (params) {
        this.orderId = +params;
      }
    });
  }

  private get customerSearchResult$(): Observable<CustomerSearchResultUi[] | []> {
    return this.searchTermControl.valueChanges.pipe(
      debounceTime(400),
      filter((val) => val && val.length && val.length > 2),
      switchMap((term: string) => {
        return this.isValidSearchValue(term)
          ? this.searchCustomers$(term)
          : of([])
      }),
      tap((res: CustomerSearchResultUi[]) => {
        if (res.length === 0) {
          this.searchTermControl.setValue(null, { emitEvent: false })
          this.showNoDataFound$.next(true)
        }
      }),
      takeUntil(this.unsubscribe$)
    )
  }

  private readonly isValidSearchValue = (term: string): boolean => {
    return  term.trim().length > 0 ? true : false
  }

  private searchCustomers$ (
    searchTerm: string
  ): Observable<CustomerSearchResultUi[]> {
    this.showNoDataFound$.next(false)
    return this.facade.searchCustomer$(searchTerm).pipe(
      catchError(() => {
        return EMPTY
      })
    )
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

  protected searchMeals(): void {
    this.facade.executeSearch(this.selectedCategoryId, this.searchValue);
  }

  resetValue() {
    this.resetReadonlyAndList();
    this.searchTermControl.setValue(null);
    this.formService.resetValue()
    this.markerPositions = [];
  }

  onOptionSelected(value: CustomerSearchResultUi) {
    this.readonly = !!value
    this.formService.setValue({
      firstName: value.firstName,
      lastName: value.lastName,
      address: value.address,
      city: value.city
    } as CustomerFormUi)

    this.center = {
      lat: value.latitude,
      lng: value.longitude,
    };
    this.markerPositions = [];
    this.markerPositions.push(this.center);


  }

  private resetReadonlyAndList (): void {
    this.customerManualList$.next([])
    this.readonly = false
    this.showNoDataFound$.next(false)
  }

  getOptionText = (option: CustomerSearchResultUi): string => {
    if (option){
      return option?.firstName + ' ' + option?.lastName + ' (' + option?.address + ')'
    }
    return null;
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
