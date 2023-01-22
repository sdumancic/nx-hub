import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OrdersOverviewQuery } from "./orders-overview.query";
import { MealOrdersDataAccess } from "../data-access/meal-orders-data-access.service";
import { IMealOrdersOverviewSearchUi } from "../forms/meal-orders-overview-search.ui.model";
import { Category, PagedOrders, Topping } from "@hub/shared/model/food-models";
import { ISearchMeta } from "../facade/state/meal-orders-overview-state.model";

@Injectable()
export class OrdersOverviewService {
  categories$: Observable<Category[]> = this.dataAccessService.categories$;
  toppings$: Observable<Topping[]> = this.dataAccessService.toppings$;

  constructor(private readonly dataAccessService: MealOrdersDataAccess) {}

  getSearchMetaDefaults(): ISearchMeta {
    return {
      pagination: { index: 0, size: 10 },
      sorting: { attribute: '', order: '' },
    } as ISearchMeta;
  }

  searchOrders$(
    searchValues: IMealOrdersOverviewSearchUi,
    searchMeta: ISearchMeta
  ): Observable<PagedOrders> {
    return this.dataAccessService.searchOrders$(
      OrdersOverviewQuery.buildQuery(searchValues, searchMeta)
    );
  }
}
