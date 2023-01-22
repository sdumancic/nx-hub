import { ISearchMeta } from '../facade/state/meal-orders-overview-state.model';
import { IMealOrdersOverviewSearchUi } from '../forms/meal-orders-overview-search.ui.model';

export class OrdersOverviewQuery {
  static buildQuery(
    searchValues: IMealOrdersOverviewSearchUi,
    searchMeta: ISearchMeta
  ): string {
    const filtering = `status=${searchValues.status}&datePlacedFrom=${searchValues.datePlacedFrom}&datePlacedTo=${searchValues.datePlacedTo}`;
    const offset = searchMeta.pagination.index * searchMeta.pagination.size;
    const pagination = `offset=${offset}&limit=${searchMeta.pagination.size}`;
    const sorting = `sort=${searchMeta.sorting?.attribute}&sortOrder=${searchMeta.sorting?.order}`;
    return filtering.concat('&').concat(pagination).concat('&').concat(sorting);
  }
}
