import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";

import { MealOrdersOverviewFacadeService } from "../../facade/meal-orders-overview-facade.service";
import { IOrdersOverviewSearchResultUi } from "./orders-overview-search-result.ui.model";

export class OrdersOverviewDataSource implements DataSource<IOrdersOverviewSearchResultUi> {
  loading$ = this.facade.loading$;

  constructor(private readonly facade: MealOrdersOverviewFacadeService) {}

  connect(): Observable<IOrdersOverviewSearchResultUi[]> {
    return this.facade.searchResult$;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}


}
