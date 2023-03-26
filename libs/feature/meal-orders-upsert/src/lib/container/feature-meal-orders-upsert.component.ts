import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
import { GoogleMapsModule, MapInfoWindow } from "@angular/google-maps";
import {
  concatMap,
  flatMap, forkJoin,
  map, merge,
  mergeAll,
  mergeMap,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap, toArray
} from "rxjs";
import { CartItem, Topping } from "@hub/shared/model/food-models";
import { MealOrderCartSmallComponent } from "@hub/feature/meal-order-cart";
import { CartInMemoryService } from "../data-access/cart-in-memory.service";
import { FormGroup } from "@angular/forms";
import { CustomerSearchFormService } from "../forms/customer-search-form.service";
import { SelectCustomerComponent } from "./steps/select-customer/select-customer.component";
import { SelectToppingComponent } from "./steps/select-topping/select-topping.component";
import { MealTopping } from "../../../../../shared/model/food-models/src/lib/toppings/meal-topping.interface";


@Component({
  selector: "hub-feature-meal-orders-upsert",
  standalone: true,
  imports: [CommonModule, ...materialModules, CdkStepperModule, StepperSideboardComponent, SharedUiSectionGroupComponent,
    SharedUiSectionComponent, SharedUiSideboardComponent, MealsTableComponent, MealOrderCartSmallComponent, GoogleMapsModule, SelectCustomerComponent, SelectToppingComponent],
  templateUrl: "./feature-meal-orders-upsert.component.html",
  styleUrls: ["./feature-meal-orders-upsert.component.scss"],
  providers: [
    MealOrdersUpsertFacadeService,
    CartInMemoryService,
    CustomerSearchFormService
  ]
})
export class FeatureMealOrdersUpsertComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('cdkStepper') stepper: StepperSideboardComponent;

  categories$ = this.facade.categories$;
  cartItems$: Observable<CartItem[]> = this.facade.cartItems$;
  orderId: number;
  searchValue: string = null;
  selectedCategoryId = 3;
  form!: FormGroup;
  private readonly unsubscribe$ = new Subject<void>();

  protected createNewCustomer$ = new Subject<void>();
  protected cancelCreateNewCustomer$ = new Subject<boolean>();
  protected saveNewCustomer$ = new Subject<boolean>();
  protected mealToppingsMap$ = new Subject< Map<number, MealTopping[]>>();

  constructor(
    private route: ActivatedRoute,
    protected facade: MealOrdersUpsertFacadeService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params) {
        this.orderId = +params;
      }
    });
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.asObservable()
      .subscribe(val => {
        if (val.selectedIndex === 1){
          this.fetchToppingsForOrderItems();
        }
      });
  }

  onMealSearchKeyUp(event: KeyboardEvent) {
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


  onCreateNewCustomer() {
    this.createNewCustomer$.next();

  }

  onCancelCreateNewCustomer() {
    this.cancelCreateNewCustomer$.next(true);
  }

  onSaveNewCustomer() {
    this.saveNewCustomer$.next(true);
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private fetchToppingsForOrderItems() {
    const mealToppings = new Map<number, MealTopping[]>();
    this.facade.cartItems$.pipe(
      take(1),
      concatMap(array => {
        const observables = array.map(item => this.facade.fetchToppingsForMeal(item.meal.id).pipe(map(toppings => {
          return {mealId: item.meal.id, mealToppings: toppings.list }
        })));
        return forkJoin([...observables]);
      }),
    ).subscribe(val => {
      val.forEach(item => mealToppings.set(item.mealId, item.mealToppings))
      this.mealToppingsMap$.next(mealToppings)
    })
  }
}

