import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';
import { IMealOrdersMetadata } from './meal-orders.model';
import {
  Categories,
  Category,
  PagedMeals,
  PagedOrders, PagedToppings,
  Topping
} from "@hub/shared/model/food-models";
import { FOOD_API_BACKEND_URL } from '@hub/shared/util/app-config';

@Injectable({
  providedIn: 'root',
})
export class MealOrdersDataAccess {
  private readonly metadataRefresh$ = new BehaviorSubject<void>(null);
  private readonly metadata$: Observable<IMealOrdersMetadata> =
    this.metadataRefresh$.pipe(
      switchMap(() => forkJoin([this.fetchCategories(), this.fetchToppings()])),
      map((el) => {
        return {
          categories: el[0].categories,
          toppings: el[1].list,
        };
      }),
      shareReplay(1)
    );

  constructor(
    @Inject(FOOD_API_BACKEND_URL) private url: string,
    private readonly http: HttpClient
  ) {}

  public searchOrders$(
    queryFilter: string
  ): Observable<PagedOrders> {
    return this.http.get<PagedOrders>(
      `${this.url}/orders/search?${queryFilter}`
    );
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
    return this.http.get<PagedMeals>(
      `${this.url}/meals/search?categoryId=${categoryId}&name=${name}&limit=100`
    );
  }

  refreshMetadata$(): void {
    this.metadataRefresh$.next();
  }

  get categories$(): Observable<Category[]> {
    return this.metadata$.pipe(map((metadata) => metadata.categories));
  }

  get toppings$(): Observable<Topping[]> {
    return this.metadata$.pipe(map((metadata) => metadata.toppings));
  }

  cancelOrder$(orderId: number) {
    return this.http.post(`${this.url}/orders/${orderId}/cancel`,{});
  }

  dispatchOrder$(orderId: number) {
    return this.http.post(`${this.url}/orders/${orderId}/dispatch`,{});
  }

  completeOrder$(orderId: number) {
    return this.http.post(`${this.url}/orders/${orderId}/complete`,{});
  }
}
