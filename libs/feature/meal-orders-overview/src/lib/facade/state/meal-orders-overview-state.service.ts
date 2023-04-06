import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  IMealOrdersOverviewState,
  ISearchMeta,
  ORDERS_OVERVIEW_INITIAL_STATE,
  SEARCH_META_DEFAULT,
  SEARCH_VALUES_DEFAULT
} from './meal-orders-overview-state.model'
import { IMealOrdersOverviewSearchUi } from "../../forms/meal-orders-overview-search.ui.model";
import { IOrdersOverviewSearchResultUi } from "../../presentation/table/orders-overview-search-result.ui.model";

@Injectable()
export class MealOrdersOverviewStateService {
  private readonly state = new BehaviorSubject<IMealOrdersOverviewState>(
    ORDERS_OVERVIEW_INITIAL_STATE
  )

  get snapshot (): IMealOrdersOverviewState {
    return this.state.getValue()
  }

  get searchValues$ (): Observable<IMealOrdersOverviewSearchUi> {
    return this.state.pipe(map(state => state?.searchValues))
  }

  get searchResult$ (): Observable<IOrdersOverviewSearchResultUi[]> {
    return this.state.pipe(map(state => state?.searchResult))
  }

  get searchMeta$ (): Observable<ISearchMeta> {
    return this.state.pipe(map(state => state?.searchMeta))
  }

  get searchCount$ (): Observable<number> {
    return this.state.pipe(map(state => state?.searchCount))
  }

  set (newState: Partial<IMealOrdersOverviewState>): void {
    this.state.next({
      ...this.snapshot,
      ...newState
    })
  }

  reset (): void {

    this.set({
      searchValues: { ...SEARCH_VALUES_DEFAULT },
      searchResult: [],
      searchCount: -1,
      searchMeta: SEARCH_META_DEFAULT
    })
  }

  resetSearchValues (searchValues: IMealOrdersOverviewSearchUi): void {
    this.set({
      searchValues,
      searchResult: [],
      searchCount: 0,
      searchMeta: {
        ...this.snapshot.searchMeta,
        pagination: {
          ...this.snapshot.searchMeta.pagination,
          index: 0
        }
      }
    })
  }

  resetSearchValuesAndMeta (
    searchValues: IMealOrdersOverviewSearchUi,
    searchMeta: ISearchMeta
  ): void {
    this.set({
      searchValues,
      searchResult: [],
      searchCount: 0,
      searchMeta
    })
  }

  updatePagination (index: number, size: number): void {
    this.set({
      searchResult: [],
      searchMeta: {
        ...this.snapshot.searchMeta,
        pagination: {
          index,
          size
        }
      }
    })
  }

  updateSorting (attribute: string, order: string): void {
    this.set({
      searchResult: [], // reset so the spinner is shown
      searchMeta: {
        ...this.snapshot.searchMeta,
        sorting: {
          attribute: attribute ?? null,
          order: order ?? null
        }
      }
    })
  }
}
