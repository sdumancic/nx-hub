import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { IMealsSearchResultUi } from "./meals-search-result.ui.model";
import { MealOrdersUpsertFacadeService } from "../../facade/meal-orders-upsert-facade.service";


export class MealsDataSource implements DataSource<IMealsSearchResultUi> {
  loading$ = this.facade.loadInProgress$;

  constructor(private readonly facade: MealOrdersUpsertFacadeService) {

  }

  connect(): Observable<IMealsSearchResultUi[]> {
    return this.facade.searchResult$;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
}
