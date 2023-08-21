import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  EMPLOYEE_OVERVIEW_INITIAL_STATE,
  EmployeeOverviewState, SEARCH_META_DEFAULT,
  SEARCH_VALUES_DEFAULT
} from "./employee-overview-state.model";
import {
  EmployeeOverviewSearchUi
} from "../../../presentation/employees-overview/form/employee-overview-search.ui.model";
import { SearchMeta } from "../../../data-access/standard.model";
import {
  EmployeeOverviewSearchResultUi
} from "../../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model";

@Injectable()
export class EmployeeOverviewStateService {
  private readonly state = new BehaviorSubject<EmployeeOverviewState>(
    EMPLOYEE_OVERVIEW_INITIAL_STATE
  )

  get snapshot (): EmployeeOverviewState {
    return this.state.getValue()
  }

  get searchValues$ (): Observable<EmployeeOverviewSearchUi> {
    return this.state.pipe(map(state => state?.searchValues))
  }

  get searchResult$ (): Observable<EmployeeOverviewSearchResultUi[]> {
    return this.state.pipe(map(state => state?.searchResult))
  }

  get searchMeta$ (): Observable<SearchMeta> {
    return this.state.pipe(map(state => state?.searchMeta))
  }

  get searchCount$ (): Observable<number> {
    return this.state.pipe(map(state => state?.searchCount))
  }

  set (newState: Partial<EmployeeOverviewState>): void {
    this.state.next({
      ...this.snapshot,
      ...newState
    })
    console.log("State = ", this.state.value);
  }

  reset (): void {
    this.set({
      searchValues: { ...SEARCH_VALUES_DEFAULT },
      searchResult: [],
      searchCount: -1,
      searchMeta: SEARCH_META_DEFAULT
    })
  }

  // preserves sorting attribute and page size on next new search while reset() not
  resetSearchValues (searchValues: EmployeeOverviewSearchUi): void {
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
    searchValues: EmployeeOverviewSearchUi,
    searchMeta: SearchMeta
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
      searchResult: [], // reset so the spinner is shown
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
