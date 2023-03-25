import { Injectable, OnDestroy } from "@angular/core";
import { catchError, map, Observable, of, ReplaySubject, Subject, switchMap, takeUntil, tap } from "rxjs";
import { CartItem, Category, Customer, EMPTY_PAGED_MEALS, PagedMeals, Topping } from "@hub/shared/model/food-models";
import { MealUpsertDataAccessService } from "../data-access/meal-upsert-data-access.service";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";
import { MealOrdersUpsertMapper } from "./meal-orders-upsert.mapper";
import { CartInMemoryService } from "../data-access/cart-in-memory.service";
import { CustomerSearchUi } from "../model/customer-search-ui.interface";
import { CustomerSearchResultUi } from "../model/customer-search-result-ui.interface";
import { CustomerFormUi } from "../forms/customer-form-ui.interface";


export interface MealSearchRequest{
  categoryId: number
  searchValue: string
}

@Injectable()
export class MealOrdersUpsertFacadeService implements OnDestroy{
  private search$ = new Subject<MealSearchRequest>();
  public readonly loadInProgress$ = new ReplaySubject<boolean>(1);
  private readonly searchError$ = new Subject<void>();
  private readonly unsubscribe$ = new Subject<void>();
  searchResult$: Subject<IMealsSearchResultUi[]> = new Subject<IMealsSearchResultUi[]>()

  categories$: Observable<Category[]> = this.dataService.categories$;
  cartItems$: Observable<CartItem[]> = this.cartService.getCartItems$();

  toppings$: Observable<Topping[]> = this.dataService.toppings$;


  constructor(
    private readonly dataService: MealUpsertDataAccessService,
    private readonly cartService: CartInMemoryService
  ) {
    this.subscribeToSearch();

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public executeSearch(categoryId: number, searchValue: string){
    this.search$.next({categoryId,searchValue});
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
    this.searchResult$.next(MealOrdersUpsertMapper.fromResourceCollectionToSearchResultUi(response))
  };

  private readonly searchOperation$ = (categoryId: number, searchValue: string): Observable<PagedMeals> =>
    this.dataService.fetchMealsForCategory(categoryId,searchValue);

  private readonly onSearchError = (): void => {
    this.search$ = new Subject<MealSearchRequest>();
    this.subscribeToSearch();
  };


  addToCart(meal: IMealsSearchResultUi) {
    const cartItem: CartItem = MealOrdersUpsertMapper.createCartItem(meal);
    this.cartService.addOrUpdateCartItem(cartItem)
  }

  setCartItems(items: CartItem[]) {
    this.cartService.setCartItems(items);
  }

  searchCustomer$(searchTerm: string):  Observable<CustomerSearchResultUi[]>{
    return this.dataService.searchCustomers$(searchTerm).pipe(
      map((results:Customer[]) => this.mapCustomerArrayToCustomerSearchResultUi(results))
    )
  }

  private mapCustomerArrayToCustomerSearchResultUi(results: Customer[]): CustomerSearchResultUi[] {

    return results.map(res => {

      return <CustomerSearchResultUi>{
        id: res.id,
        lastName: res.lastName,
        firstName: res.firstName,
        city: res.city,
        address: res.address,
        customerLocation: res.customerLocation,
        longitude: res.customerLocation['type'] === 'Point' ? res.customerLocation['coordinates'][0] : null,
        latitude: res.customerLocation['type'] === 'Point' ? res.customerLocation['coordinates'][1] : null,
      }
    })
  }


  saveCustomer$(formGroupRawValue: CustomerFormUi): Observable<Customer> {
    return this.dataService.saveCustomer$(MealOrdersUpsertMapper.fromCustomerUiToCustomer(formGroupRawValue));
  }
}
