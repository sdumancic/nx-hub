import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  EMPLOYEE_OVERVIEW_INITIAL_STATE,
  EmployeeOverviewState,
  METADATA_DEFAULT,
  SEARCH_META_DEFAULT,
  SEARCH_VALUES_DEFAULT,
  ZERO_PAGE_INDEX,
} from './employee-overview-state.model';
import { EmployeeOverviewSearchUi } from '../../../presentation/employees-overview/form/employee-overview-search.ui.model';
import { SearchMeta } from '../../../data-access/standard.model';
import { EmployeeOverviewSearchResultUi } from '../../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model';
import { EmployeeOverviewMetadata } from '../../../data-access/employees-overview/employee-overview.model';

@Injectable()
export class EmployeeOverviewStateService {
  private readonly state = new BehaviorSubject<EmployeeOverviewState>(
    EMPLOYEE_OVERVIEW_INITIAL_STATE
  );

  get snapshot(): EmployeeOverviewState {
    return this.state.getValue();
  }

  get searchValues$(): Observable<EmployeeOverviewSearchUi> {
    return this.state.pipe(map((state) => state?.searchValues));
  }

  get searchResult$(): Observable<EmployeeOverviewSearchResultUi[]> {
    return this.state.pipe(map((state) => state?.searchResult));
  }

  get searchMeta$(): Observable<SearchMeta> {
    return this.state.pipe(map((state) => state?.searchMeta));
  }

  get searchCount$(): Observable<number> {
    return this.state.pipe(map((state) => state?.searchCount));
  }

  get metadata$(): Observable<EmployeeOverviewMetadata> {
    return this.state.pipe(map((state) => state?.metadata));
  }

  get statesLov$(): Observable<string[]> {
    return this.state.pipe(map((state) => state?.metadata?.states));
  }
  get rolesLov$(): Observable<string[]> {
    return this.state.pipe(map((state) => state?.metadata?.roles));
  }

  get genders$(): Observable<string[]> {
    return this.state.pipe(map((state) => state?.metadata?.genders));
  }

  get departments$(): Observable<string[]> {
    return this.state.pipe(map((state) => state?.metadata?.departments));
  }

  set(newState: Partial<EmployeeOverviewState>): void {
    this.state.next({
      ...this.snapshot,
      ...newState,
    });
    console.log('State = ', this.state.value);
  }

  reset(): void {
    this.set({
      searchValues: { ...SEARCH_VALUES_DEFAULT },
      searchResult: [],
      searchCount: -1,
      searchMeta: SEARCH_META_DEFAULT,
      metadata: METADATA_DEFAULT,
    });
  }

  // preserves sorting attribute and page size on next new search while reset() not
  resetSearchValues(
    searchValues: EmployeeOverviewSearchUi,
    retainPagination = false
  ): void {
    const pageIndex = this.snapshot.searchMeta.pagination.index;
    this.set({
      searchValues,
      searchResult: [],
      searchCount: 0,
      searchMeta: {
        ...this.snapshot.searchMeta,
        pagination: {
          ...this.snapshot.searchMeta.pagination,
          index: retainPagination ? pageIndex : ZERO_PAGE_INDEX,
        },
      },
    });
  }

  resetSearchValuesAndMeta(
    searchValues: EmployeeOverviewSearchUi,
    searchMeta: SearchMeta
  ): void {
    this.set({
      searchValues,
      searchResult: [],
      searchCount: 0,
      searchMeta,
    });
  }

  updatePagination(index: number, size: number): void {
    this.set({
      searchResult: [], // reset so the spinner is shown
      searchMeta: {
        ...this.snapshot.searchMeta,
        pagination: {
          index,
          size,
        },
      },
    });
  }

  updateSorting(attribute: string, order: string): void {
    this.set({
      searchResult: [], // reset so the spinner is shown
      searchMeta: {
        ...this.snapshot.searchMeta,
        sorting: {
          attribute: attribute ?? null,
          order: order ?? null,
        },
      },
    });
  }
}
