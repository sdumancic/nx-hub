import { ISearchMeta } from '../facade/state/meal-orders-overview-state.model';
import { IMealOrdersOverviewSearchUi } from '../forms/meal-orders-overview-search.ui.model';

export class OrdersOverviewQuery {
  static buildQuery(
    searchValues: IMealOrdersOverviewSearchUi,
    searchMeta: ISearchMeta
  ): string {
    let datePlacedFromQueryParamValue = null;
    let datePlacedToQueryParamValue = null;
    if (searchValues.datePlacedFrom) {
      datePlacedFromQueryParamValue = searchValues.datePlacedFrom.startOf('day').toISOString();
    }
    if (searchValues.datePlacedTo) {
      datePlacedToQueryParamValue = searchValues.datePlacedTo.endOf('day').toISOString();
    }
    let filtering = `status=${searchValues.status}`;
    if (datePlacedFromQueryParamValue){
      filtering = filtering.concat(`&datePlacedFrom=${datePlacedFromQueryParamValue}`)
    }
    if (datePlacedToQueryParamValue){
      filtering = filtering.concat(`&datePlacedTo=${datePlacedToQueryParamValue}`)
    }

    const offset = searchMeta.pagination.index * searchMeta.pagination.size;
    const pagination = `offset=${offset}&limit=${searchMeta.pagination.size}`;
    const sorting = `sort=${searchMeta.sorting?.attribute}&sortOrder=${searchMeta.sorting?.order}`;
    return filtering.concat('&').concat(pagination).concat('&').concat(sorting);
  }
}
