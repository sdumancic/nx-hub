import { IMealOrdersOverviewSearchUi } from "../../forms/meal-orders-overview-search.ui.model";
import { IOrdersOverviewSearchResultUi } from "../../presentation/table/orders-overview-search-result.ui.model";

export interface ISearchMeta {
  pagination?: { index: number, size: number }
  sorting?: { attribute: string, order?: string }
}

export interface IMealOrdersOverviewState {
  searchResult: IOrdersOverviewSearchResultUi[]
  searchValues: IMealOrdersOverviewSearchUi
  searchMeta: ISearchMeta
  searchCount: number
}

export const SEARCH_VALUES_DEFAULT: IMealOrdersOverviewSearchUi = {
  status: null,
  datePlacedFrom: null,
  datePlacedTo: null,
  dateDispatchedFrom: null,
  dateDispatchedTo: null,
  dateCompletedFrom: null,
  dateCompletedTo: null,
  orderTotalFrom: null,
  orderTotalTo: null,
  dateCreatedFrom: null,
  dateCreatedTo: null,
  deliveryCity: null,
  deliveryAddress: null
}

export const SEARCH_META_DEFAULT: ISearchMeta = {
  pagination: { index: 0, size: 10 },
  sorting: { attribute: 'id', order: 'desc' }
}

export const ORDERS_OVERVIEW_INITIAL_STATE: IMealOrdersOverviewState = {
  searchResult: [],
  searchValues: SEARCH_VALUES_DEFAULT,
  searchMeta: SEARCH_META_DEFAULT,
  searchCount: 0
}

export const EMPTY_RESPONSE = {
  orders: [],
  pagination: {
    total: 0,
    currentPage: 0,
    pageSize: 10
  }
}

