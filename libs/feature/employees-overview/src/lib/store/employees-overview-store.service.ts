import { Injectable } from '@angular/core';
import {
  EmployeeOverviewNgRxState,
  EmployeeOverviewState,
  EMPTY_EMPLOYEES_OVERVIEW_STORE,
  getError,
  LoadingState,
  ZERO_PAGE_INDEX,
} from './employees-overview-store.model';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatMap, EMPTY, Observable } from 'rxjs';
import { EmployeeOverviewSearchUi } from '../presentation/employees-overview/form/employee-overview-search.ui.model';
import { EmployeeOverviewSearchResultUi } from '../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model';
import {
  EmployeeOverviewMetadata,
  SearchMeta,
} from '@hub/shared/workplace-reservation-data-access';
import { EmployeesOverviewBusiness } from '../business/employees-overview/employees-overview-business.service';
import { catchError } from 'rxjs/operators';
import { linkToGlobalState } from './ngrx';
import { Store } from '@ngrx/store';

@Injectable()
export class EmployeesOverviewStoreService extends ComponentStore<EmployeeOverviewNgRxState> {
  constructor(
    private globalStore: Store,
    private employeeOverviewBusiness: EmployeesOverviewBusiness
  ) {
    super({
      ...EMPTY_EMPLOYEES_OVERVIEW_STORE,
    });
    console.log('ngrx constructor');
    linkToGlobalState(this.state$, 'EmployeeOverviewStore', this.globalStore);
  }

  // SELECTORS FOR EMPLOYEE OVERVIEW
  private readonly employeesOverviewLoading$: Observable<boolean> = this.select(
    (state) => state.employeesOverview.callState === LoadingState.LOADING
  );
  private readonly employeesOverviewLoaded$: Observable<boolean> = this.select(
    (state) => state.employeesOverview.callState === LoadingState.LOADED
  );
  private readonly employeesOverviewError$: Observable<string> = this.select(
    (state) => getError(state.employeesOverview.callState)
  );
  private employeesOverviewSearchValues$: Observable<EmployeeOverviewSearchUi> =
    this.select((state) => state.employeesOverview.searchValues);
  private employeesOverviewSearchResult$: Observable<
    EmployeeOverviewSearchResultUi[]
  > = this.select((state) => state.employeesOverview.searchResult);
  private employeesOverviewSearchMeta$: Observable<SearchMeta> = this.select(
    (state) => state.employeesOverview.searchMeta
  );
  private employeesOverviewSearchCount$: Observable<number> = this.select(
    (state) => state.employeesOverview.searchCount
  );

  // SELECTORS FOR CHECKINS OVERVIEW
  private readonly checkinsOverviewLoading$: Observable<boolean> = this.select(
    (state) => state.checkinsOverview.callState === LoadingState.LOADING
  );
  private readonly checkinsOverviewError$: Observable<string> = this.select(
    (state) => getError(state.checkinsOverview.callState)
  );
  private checkinsOverviewSearchValues$: Observable<EmployeeOverviewSearchUi> =
    this.select((state) => state.checkinsOverview.searchValues);
  //TODO: Add other selectors

  // SELECTORS FOR METADATA
  private metadataLoading$: Observable<boolean> = this.select(
    (state) => state.metadataCallState === LoadingState.LOADING
  );

  private metadataLoaded$: Observable<boolean> = this.select(
    (state) => state.metadataCallState === LoadingState.LOADED
  );

  private metadataError$: Observable<string> = this.select((state) =>
    getError(state.metadataCallState)
  );

  private metadataStatesLov$: Observable<string[]> = this.select(
    (state) => state.metadata.states
  );
  private metadataRolesLov$: Observable<string[]> = this.select(
    (state) => state.metadata.roles
  );
  private metadataGendersLov$: Observable<string[]> = this.select(
    (state) => state.metadata.genders
  );
  private metadataDepartmentsLov$: Observable<string[]> = this.select(
    (state) => state.metadata.departments
  );

  // ViewModel for Employee Overview
  readonly metadataVm$ = this.select(
    this.metadataStatesLov$,
    this.metadataRolesLov$,
    this.metadataGendersLov$,
    this.metadataDepartmentsLov$,
    this.metadataLoading$,
    this.metadataLoaded$,
    this.metadataError$,
    (
      statesLov,
      rolesLov,
      gendersLov,
      departmentsLov,
      loading,
      loaded,
      error
    ) => ({
      statesLov,
      rolesLov,
      gendersLov,
      departmentsLov,
      loading,
      loaded,
    })
  );

  // ViewModel for Employee Overview
  readonly employeeOverviewVm$ = this.select(
    this.employeesOverviewSearchValues$,
    this.employeesOverviewSearchResult$,
    this.employeesOverviewSearchMeta$,
    this.employeesOverviewSearchCount$,
    this.employeesOverviewLoading$,
    this.employeesOverviewLoaded$,
    this.employeesOverviewError$,
    (
      searchValues,
      searchResult,
      searchMeta,
      searchCount,
      loading,
      loaded,
      error
    ) => ({
      searchValues,
      searchResult,
      searchMeta,
      searchCount,
      loading,
      loaded,
      error,
    })
  );

  // UPDATERS FOR EMPLOYEE OVERVIEW
  readonly setEmployeeOverviewError = this.updater(
    (state: EmployeeOverviewNgRxState, error: string) => {
      return {
        ...state,
        employeesOverview: {
          ...state.employeesOverview,
          callState: {
            errorMsg: error,
          },
        },
      };
    }
  );
  readonly setEmployeeOverviewLoading = this.updater(
    (state: EmployeeOverviewNgRxState) => {
      return {
        ...state,
        employeesOverview: {
          ...state.employeesOverview,
          callState: LoadingState.LOADING,
        },
      };
    }
  );
  readonly setEmployeeOverviewLoaded = this.updater(
    (state: EmployeeOverviewNgRxState) => {
      return {
        ...state,
        employeesOverview: {
          ...state.employeesOverview,
          callState: LoadingState.LOADED,
        },
      };
    }
  );

  readonly setEmployeeOverview = this.updater(
    (
      state: EmployeeOverviewNgRxState,
      newEmployeeOverviewState: EmployeeOverviewState
    ) => {
      return {
        ...state,
        employeesOverview: {
          ...state.employeesOverview,
          ...newEmployeeOverviewState,
        },
      };
    }
  );

  readonly resetEmployeeOverviewSearchValues = this.updater(
    (
      state: EmployeeOverviewNgRxState,
      searchValues: EmployeeOverviewSearchUi
    ) => {
      return {
        ...state,
        employeesOverview: {
          searchValues,
          searchResult: [],
          searchCount: 0,
          searchMeta: {
            ...state.employeesOverview.searchMeta,
          },
          callState: {
            errorMsg: null,
          },
        },
      };
    }
  );

  readonly resetEmployeeOverviewSearchValuesAndPagination = this.updater(
    (
      state: EmployeeOverviewNgRxState,
      searchValues: EmployeeOverviewSearchUi
    ) => {
      return {
        ...state,
        employeesOverview: {
          searchValues,
          searchResult: [],
          searchCount: 0,
          searchMeta: {
            ...state.employeesOverview.searchMeta,
            pagination: {
              ...state.employeesOverview.searchMeta.pagination,
              index: ZERO_PAGE_INDEX,
            },
          },
          callState: {
            errorMsg: null,
          },
        },
      };
    }
  );

  readonly setEmployeeOverviewSearchResultAndCount = this.updater(
    (
      state: EmployeeOverviewNgRxState,
      val: {
        searchResult: EmployeeOverviewSearchResultUi[];
        searchCount: number;
      }
    ) => {
      return {
        ...state,
        employeesOverview: {
          ...state.employeesOverview,
          searchResult: val.searchResult,
          searchCount: val.searchCount,
        },
      };
    }
  );

  readonly resetEmployeeOverviewSearchValuesAndMeta = this.updater(
    (
      state: EmployeeOverviewNgRxState,
      part: { searchValues: EmployeeOverviewSearchUi; searchMeta: SearchMeta }
    ) => {
      return {
        ...state,
        employeesOverview: {
          searchValues: part.searchValues,
          searchResult: [],
          searchCount: 0,
          searchMeta: part.searchMeta,
          callState: LoadingState.INIT,
        },
      };
    }
  );

  readonly setEmployeeOverviewPagination = this.updater(
    (
      state: EmployeeOverviewNgRxState,
      newPagination: { index: number; size: number }
    ) => {
      return {
        ...state,
        employeesOverview: {
          ...state.employeesOverview,
          searchResult: [],
          searchMeta: {
            ...state.employeesOverview.searchMeta,
            pagination: {
              ...newPagination,
            },
          },
        },
      };
    }
  );

  readonly setEmployeeOverviewSorting = this.updater(
    (
      state: EmployeeOverviewNgRxState,
      newSorting: { attribute: string; order: string }
    ) => {
      return {
        ...state,
        employeesOverview: {
          ...state.employeesOverview,
          searchResult: [],
          searchMeta: {
            ...state.employeesOverview.searchMeta,
            sorting: {
              attribute: newSorting.attribute ?? null,
              order: newSorting.order ?? null,
            },
          },
        },
      };
    }
  );

  readonly updateMetadata = this.updater(
    (state: EmployeeOverviewNgRxState, metadata: EmployeeOverviewMetadata) => {
      return {
        ...state,
        metadata,
      };
    }
  );

  readonly updateMetadataError = this.updater(
    (state: EmployeeOverviewNgRxState, error: string) => {
      return {
        ...state,
        metadataCallState: {
          errorMsg: error,
        },
      };
    }
  );
  readonly setMetadataLoading = this.updater(
    (state: EmployeeOverviewNgRxState) => {
      return {
        ...state,
        metadataCallState: LoadingState.LOADING,
      };
    }
  );
  readonly setMetadataLoaded = this.updater(
    (state: EmployeeOverviewNgRxState) => {
      return {
        ...state,
        metadataCallState: LoadingState.LOADED,
      };
    }
  );

  // EFFECTS
  readonly fetchMetadata = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      concatMap(() => {
        this.setMetadataLoading();
        return this.employeeOverviewBusiness.fetchMetadata$().pipe(
          tapResponse(
            (metadata) => {
              this.updateMetadata(metadata);
              this.setMetadataLoaded();
            },
            (e: string) => this.updateMetadataError(e)
          ),
          catchError(() => EMPTY)
        );
      })
    );
  });
}
