import { Injectable, OnDestroy } from "@angular/core";
import { catchError, map, Observable, of, ReplaySubject, Subject, switchMap, take, takeUntil, tap } from "rxjs";
import {
  CartItem,
  Category,
  Customer,
  EMPTY_PAGED_MEALS, Order,
  PagedMeals,
  PagedMealToppings,
  Topping
} from "@hub/shared/model/food-models";
import { MealUpsertDataAccessService } from "../data-access/meal-upsert-data-access.service";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";
import { MealOrdersUpsertMapper } from "./meal-orders-upsert.mapper";
import { CartInMemoryService } from "../data-access/cart-in-memory.service";
import { CustomerSearchResultUi } from "../model/customer-search-result-ui.interface";
import { CustomerFormUi } from "../forms/customer-form-ui.interface";
import { MealSearchRequest } from "../model/meal-search-request.interface";
import { FormMode } from "../model/form-mode.enum";
import { MealToppingChange } from "../model/meal-topping-change.interface";


@Injectable()
export class MealOrdersUpsertFacadeService implements OnDestroy {
  public customerFormMode: FormMode = FormMode.Initial;
  public readonly loadInProgress$ = new ReplaySubject<boolean>(1);
  searchResult$: Subject<IMealsSearchResultUi[]> = new Subject<IMealsSearchResultUi[]>();
  categories$: Observable<Category[]> = this.dataService.categories$;
  cartItems$: Observable<CartItem[]> = this.cartService.getCartItems$();
  private search$ = new Subject<MealSearchRequest>();
  private readonly searchError$ = new Subject<void>();
  private readonly unsubscribe$ = new Subject<void>();
  private selectedCustomer: CustomerSearchResultUi;

  constructor(
    private readonly dataService: MealUpsertDataAccessService,
    private readonly cartService: CartInMemoryService
  ) {
    this.subscribeToSearch();
  }

  public executeSearch(categoryId: number, searchValue: string) {
    this.search$.next({ categoryId, searchValue });
  }

  public selectCustomer(customer: CustomerSearchResultUi) {
    this.selectedCustomer = customer;
  }

  public getSelectedCustomer() {
    return this.selectedCustomer;
  }

  public addToCart(meal: IMealsSearchResultUi): void {
    const cartItem: CartItem = MealOrdersUpsertMapper.createCartItem(meal);
    this.cartService.addOrUpdateCartItem(cartItem);
  }

  public setCartItems(items: CartItem[]): void {
    this.cartService.setCartItems(items);
  }

  public searchCustomer$(searchTerm: string): Observable<CustomerSearchResultUi[]> {
    return this.dataService.searchCustomers$(searchTerm).pipe(
      map((results: Customer[]) => MealOrdersUpsertMapper.mapCustomerArrayToCustomerSearchResultUi(results))
    );
  }

  public saveCustomer$(formGroupRawValue: CustomerFormUi): Observable<Customer> {
    return this.dataService.saveCustomer$(MealOrdersUpsertMapper.fromCustomerUiToCustomer(formGroupRawValue));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchToppingsForMeal(mealId: number): Observable<PagedMealToppings> {
    return this.dataService.fetchToppingsForMeal$(mealId);
  }

  changeCartItemTopping(mealToppingChange: MealToppingChange) {
    this.cartService.addOrUpdateToppingForCartItem(mealToppingChange);
  }

  placeOrder(): Observable<Order> {
    const order: Partial<Order> = MealOrdersUpsertMapper.toNewOrder(this.cartService.getCartItems(), this.selectedCustomer)
    return this.dataService.placeOrder$(order);
  }

  private subscribeToSearch(): void {
    this.search$
      .pipe(
        tap(() => this.loadInProgress$.next(true)),
        switchMap((request: MealSearchRequest) => this.searchOperation$(request.categoryId, request.searchValue)),
        catchError(() => {
          this.loadInProgress$.next(false);
          this.onSearchError();
          this.searchError$.next();
          return of(EMPTY_PAGED_MEALS);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((searchResult: PagedMeals) => {
        this.loadInProgress$.next(false);
        this.afterSearch(searchResult);
      });
  }

  private readonly afterSearch = (response: PagedMeals): void => {
    this.searchResult$.next(MealOrdersUpsertMapper.fromResourceCollectionToSearchResultUi(response));
  };

  private readonly searchOperation$ = (categoryId: number, searchValue: string): Observable<PagedMeals> =>
    this.dataService.fetchMealsForCategory(categoryId, searchValue);

  private readonly onSearchError = (): void => {
    this.search$ = new Subject<MealSearchRequest>();
    this.subscribeToSearch();
  };
}
