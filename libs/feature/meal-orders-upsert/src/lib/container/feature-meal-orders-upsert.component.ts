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
import { GoogleMapsModule } from "@angular/google-maps";
import { concatMap, count, forkJoin, map, Observable, Subject, take, takeUntil, tap } from "rxjs";
import { CartItem, MealTopping } from "@hub/shared/model/food-models";
import { MealOrderCartSmallComponent } from "@hub/feature/meal-order-cart";
import { CartInMemoryService } from "../data-access/cart-in-memory.service";
import { FormGroup } from "@angular/forms";
import { CustomerSearchFormService } from "../forms/customer-search-form.service";
import { SelectCustomerComponent } from "./steps/select-customer/select-customer.component";
import { SelectToppingComponent } from "./steps/select-topping/select-topping.component";
import {
  MealToppingsTableComponent,
  MealToppingTableItem
} from "../presentation/meal-toppings-table/meal-toppings-table.component";
import { MealToppingChange } from "../model/meal-topping-change.interface";


@Component({
  selector: "hub-feature-meal-orders-upsert",
  standalone: true,
  imports: [CommonModule, ...materialModules, CdkStepperModule, StepperSideboardComponent, SharedUiSectionGroupComponent,
    SharedUiSectionComponent, SharedUiSideboardComponent, MealsTableComponent, MealOrderCartSmallComponent, GoogleMapsModule, SelectCustomerComponent, SelectToppingComponent,
    MealToppingsTableComponent],
  templateUrl: "./feature-meal-orders-upsert.component.html",
  styleUrls: ["./feature-meal-orders-upsert.component.scss"],
  providers: [
    MealOrdersUpsertFacadeService,
    CartInMemoryService,
    CustomerSearchFormService
  ]
})
export class FeatureMealOrdersUpsertComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("cdkStepper") stepper: StepperSideboardComponent;

  categories$ = this.facade.categories$;
  cartItems$: Observable<CartItem[]> = this.facade.cartItems$;
  orderId: number;
  searchValue: string = null;
  selectedCategoryId = 3;
  selectedStep = 0;
  form!: FormGroup;
  protected createNewCustomer$ = new Subject<void>();
  protected cancelCreateNewCustomer$ = new Subject<boolean>();
  protected saveNewCustomer$ = new Subject<boolean>();
  protected mealToppingsMap$ = new Subject<Map<number, MealTopping[]>>();
  private readonly unsubscribe$ = new Subject<void>();
  protected nextButtonText = 'Edit toppings';
  protected previousButtonText: string;

  constructor(
    private route: ActivatedRoute,
    protected facade: MealOrdersUpsertFacadeService
  ) {
  }

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
        this.selectedStep = val.selectedIndex;
        if (val.selectedIndex == 0){
          this.setNextButtonText('Edit toppings');
        } else if (val.selectedIndex === 1) {
          this.fetchToppingsForOrderItems();
          this.setPreviousButtonText('Back to meals');
          this.setNextButtonText('Delivery information');
        } else if (val.selectedIndex == 2){
          this.setPreviousButtonText('Edit toppings');
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

  protected searchMeals(): void {
    this.facade.executeSearch(this.selectedCategoryId, this.searchValue);
  }

  private fetchToppingsForOrderItems() {
    const mealToppings = new Map<number, MealTopping[]>();
    this.facade.cartItems$.pipe(
      take(1),
      concatMap(array => {
        const observables = array.map(item => this.facade.fetchToppingsForMeal(item.meal.id).pipe(map(toppings => {
          return { mealId: item.meal.id, mealToppings: toppings.list };
        })));
        return forkJoin([...observables]);
      })
    ).subscribe(val => {
      val.forEach(item => mealToppings.set(item.mealId, item.mealToppings));
      this.mealToppingsMap$.next(mealToppings);
    });
  }

  onMealToppingChanged(toppingCartItem: MealToppingChange): void {
    this.facade.changeCartItemTopping(toppingCartItem)
  }

  cartItemsCount$(){
    return this.facade.cartItems$.pipe(map(val => val.length));
  }

  private setNextButtonText(editToppings: string) {
    this.nextButtonText = editToppings;
  }

  private setPreviousButtonText(editToppings: string) {
    this.previousButtonText = editToppings;
  }

  placeOrder() {

  }
}

