import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, forkJoin, map, Observable, shareReplay, switchMap } from "rxjs";

import {
  Categories,
  Category,
  Customer,
  IMealOrdersMetadata, Order,
  PagedMeals,
  PagedMealToppings,
  PagedToppings,
  Topping
} from "@hub/shared/model/food-models";
import { FOOD_API_BACKEND_URL } from "@hub/shared/util/app-config";

@Injectable({
  providedIn: "root"
})
export class MealUpsertDataAccessService {
  private readonly metadataRefresh$ = new BehaviorSubject<void>(null);
  private readonly metadata$: Observable<IMealOrdersMetadata> =
    this.metadataRefresh$.pipe(
      switchMap(() => forkJoin([this.fetchCategories(), this.fetchToppings()])),
      map((el) => {
        return {
          categories: el[0].categories,
          toppings: el[1].list
        };
      }),
      shareReplay(1)
    );

  constructor(
    @Inject(FOOD_API_BACKEND_URL) private url: string,
    private readonly http: HttpClient
  ) {
  }

  get categories$(): Observable<Category[]> {
    return this.metadata$.pipe(map((metadata) => metadata.categories));
  }

  get toppings$(): Observable<Topping[]> {
    return this.metadata$.pipe(map((metadata) => metadata.toppings));
  }

  fetchCategories(): Observable<Categories> {
    return this.http.get<Categories>(`${this.url}/categories`);
  }

  fetchToppings(): Observable<PagedToppings> {
    return this.http.get<PagedToppings>(`${this.url}/toppings`);
  }

  fetchMealsForCategory(
    categoryId: number,
    name: string | null
  ): Observable<PagedMeals> {
    if (name == null) {
      return this.http.get<PagedMeals>(
        `${this.url}/meals?page[number]=0&page[size]=100&sort=-rating,id&filter[categoryId]=${categoryId}`
      );
    }
    return this.http.get<PagedMeals>(
      `${this.url}/meals?page[number]=0&page[size]=100&filter[name]=${name}&sort=-rating,id&filter[categoryId]=${categoryId}`
    );
  }

  public refreshMetadata$(): void {
    this.metadataRefresh$.next();
  }

  searchCustomers$(searchTerm: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}/customers/search?term=${searchTerm}`);
  }

  saveCustomer$(customer: Partial<Customer>): Observable<Customer> {
    if (customer.id != null) {
      return this.http.patch<Customer>(`${this.url}/customers/${customer.id}`, customer);
    } else {
      return this.http.post<Customer>(`${this.url}/customers`, customer);
    }
  }

  fetchToppingsForMeal$(mealId: number): Observable<PagedMealToppings> {
    return this.http.get<PagedMealToppings>(`${this.url}/meal-toppings/search?mealId=${mealId}&limit=30`);
  }

  placeOrder$(order: Partial<Order>):  Observable<Order> {
    return this.http.post<Order>(`${this.url}/orders/place`, order);
  }

  fetchOrder$(orderId: number): Observable<Order>{
    return this.http.get<Order>(`${this.url}/orders/${orderId}`);
  }
}
