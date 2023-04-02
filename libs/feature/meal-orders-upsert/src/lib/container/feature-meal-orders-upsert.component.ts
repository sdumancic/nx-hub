import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { materialModules } from "@hub/shared/ui/material";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { StepperSideboardComponent } from "@hub/shared/ui/stepper";
import { SharedUiSectionComponent, SharedUiSectionGroupComponent } from "@hub/shared/ui/section";
import { SharedUiSideboardComponent } from "@hub/shared/ui/sideboard";
import { MealOrdersUpsertFacadeService } from "../facade/meal-orders-upsert-facade.service";
import { MealsTableComponent } from "../presentation/meals-table/meals-table.component";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";
import { catchError, concatMap, EMPTY, forkJoin, map, Observable, of, Subject, take, takeUntil } from "rxjs";
import { CartItem, EMPTY_PAGED_MEALS, MealTopping } from "@hub/shared/model/food-models";
import { MealOrderCartSmallComponent } from "@hub/feature/meal-order-cart";
import { CartInMemoryService } from "../data-access/cart-in-memory.service";
import { CustomerSearchFormService } from "../forms/customer-search-form.service";
import { SelectCustomerComponent } from "./steps/select-customer/select-customer.component";
import { SelectToppingComponent } from "./steps/select-topping/select-topping.component";
import { MealToppingsTableComponent } from "../presentation/meal-toppings-table/meal-toppings-table.component";
import { MealToppingChange } from "../model/meal-topping-change.interface";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: "hub-feature-meal-orders-upsert",
  standalone: true,
  imports: [CommonModule, ...materialModules, CdkStepperModule, StepperSideboardComponent, SharedUiSectionGroupComponent,
    SharedUiSectionComponent, SharedUiSideboardComponent, MealsTableComponent, MealOrderCartSmallComponent, SelectCustomerComponent, SelectToppingComponent,
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
  protected categories$ = this.facade.categories$;
  protected cartItems$: Observable<CartItem[]> = this.facade.cartItems$;
  protected orderId: number;
  protected searchValue: string = null;
  protected selectedCategoryId = 3;
  protected selectedStep = 0;
  protected createNewCustomer$ = new Subject<void>();
  protected cancelCreateNewCustomer$ = new Subject<boolean>();
  protected saveNewCustomer$ = new Subject<boolean>();
  protected mealToppingsMap$ = new Subject<Map<number, MealTopping[]>>();
  protected nextButtonText = "Edit toppings";
  protected previousButtonText: string;

  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected facade: MealOrdersUpsertFacadeService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params) {
        this.orderId = +params;
      }
    });
  }

  ngAfterViewInit(): void {
    this.stepper.selectionChange.asObservable()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(val => {
        this.selectedStep = val.selectedIndex;
        if (val.selectedIndex == 0) {
          this.setNextButtonText("Edit toppings");
        } else if (val.selectedIndex === 1) {
          this.fetchToppingsForOrderItems();
          this.setPreviousButtonText("Back to meals");
          this.setNextButtonText("Delivery information");
        } else if (val.selectedIndex == 2) {
          this.setPreviousButtonText("Edit toppings");
        }
      });
  }

  onMealSearchKeyUp(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.searchMeals();
    }
  }

  onAddToCart(meal: IMealsSearchResultUi): void {
    this.facade.addToCart(meal);
  }

  onItemsChanged(items: CartItem[]): void {
    this.facade.setCartItems(items);
  }

  emptyCart(): void {
    this.facade.setCartItems([]);
  }

  onCreateNewCustomer(): void {
    this.createNewCustomer$.next();
  }

  onCancelCreateNewCustomer(): void {
    this.cancelCreateNewCustomer$.next(true);
  }

  onSaveNewCustomer(): void {
    this.saveNewCustomer$.next(true);
  }

  onMealToppingChanged(toppingCartItem: MealToppingChange): void {
    this.facade.changeCartItemTopping(toppingCartItem);
  }

  cartItemsCount$(): Observable<number>{
    return this.facade.cartItems$.pipe(map(val => val.length));
  }

  protected placeOrder(): void {
    this.facade.placeOrder().pipe(
      take(1),
      catchError((err) => {
        this.snackBar.open('Error when creating order: {}' + JSON.stringify(err), null, { duration: 10000 });
        return EMPTY
      }),
    )
      .subscribe(createdOrder => {
        this.snackBar.open('Order created successfully', null, { duration: 2000 });
        this.router.navigate(['shell','orders','overview']);
      });
  }

  protected searchMeals(): void {
    this.facade.executeSearch(this.selectedCategoryId, this.searchValue);
  }

  private fetchToppingsForOrderItems() {
    const mealToppings = new Map<number, MealTopping[]>();
    this.facade.cartItems$.pipe(
      take(1),
      concatMap(array => {
        const observables = array.map(item => this.facade.fetchToppingsForMeal(item.meal.id)
          .pipe(map(toppings => {
              return { mealId: item.meal.id, mealToppings: toppings.list };
          })));
        return forkJoin([...observables]);
      })
    ).subscribe(val => {
      val.forEach(item => mealToppings.set(item.mealId, item.mealToppings));
      this.mealToppingsMap$.next(mealToppings);
    });
  }

  private setNextButtonText(editToppings: string) {
    this.nextButtonText = editToppings;
  }

  private setPreviousButtonText(editToppings: string) {
    this.previousButtonText = editToppings;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

