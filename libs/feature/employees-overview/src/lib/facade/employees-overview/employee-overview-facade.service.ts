import { inject, Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { OverviewUrlParamsService } from './url-params/overview-url-params.service';
import { EmployeesOverviewBusiness } from '../../business/employees-overview/employees-overview-business.service';
import { EmployeeOverviewSearchUi } from '../../presentation/employees-overview/form/employee-overview-search.ui.model';
import { EmployeeOverviewSearchResultUi } from '../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model';
import { EmployeeOverviewMapper } from './employee-overview.mapper';
import { mapStringToLov } from '../../util/map-string-to-lov';
import { Params } from '@angular/router';
import { EmployeeOverviewUrlQueryParams } from './url-params/employee-overview-url-params.model';
import {
  EmployeeResourceCollection,
  LovItem,
  SearchMeta,
} from '@hub/shared/workplace-reservation-data-access';
import { EmployeesOverviewStoreService } from '../../store/employees-overview-store.service';
import { EMPTY_RESPONSE } from '../../store/employees-overview-store.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class EmployeeOverviewFacade {
  private readonly employeesOverviewBusiness = inject(
    EmployeesOverviewBusiness
  );
  private readonly urlParamsService = inject(OverviewUrlParamsService);
  private readonly urlService = inject(OverviewUrlParamsService);
  private readonly store = inject(EmployeesOverviewStoreService);
  private search$ = new Subject<void>();
  private readonly searchError$ = new Subject<void>();

  gendersLov$: Observable<LovItem[]>;
  departmentsLov$: Observable<LovItem[]>;
  rolesLov$: Observable<LovItem[]>;
  statesLov$: Observable<LovItem[]>;

  private activeTabInd: number;

  get loading$(): Observable<boolean> {
    return this.store.employeeOverviewVm$.pipe(map((val) => val.loading));
  }

  get metadataLoading$(): Observable<boolean> {
    return this.store.metadataVm$.pipe(map((val) => val.loading));
  }

  get searchValues$(): Observable<EmployeeOverviewSearchUi> {
    return this.store.employeeOverviewVm$.pipe(map((val) => val.searchValues));
  }

  get searchResult$(): Observable<EmployeeOverviewSearchResultUi[]> {
    return this.store.employeeOverviewVm$.pipe(map((val) => val.searchResult));
  }

  get searchMeta$(): Observable<SearchMeta> {
    return this.store.employeeOverviewVm$.pipe(map((val) => val.searchMeta));
  }

  get searchCount$(): Observable<number> {
    return this.store.employeeOverviewVm$.pipe(map((val) => val.searchCount));
  }

  constructor() {
    this.subscribeToSearch();
    this.gendersLov$ = this.store.metadataVm$.pipe(
      takeUntilDestroyed(),
      map((metadata) => mapStringToLov(metadata.gendersLov))
    );
    this.departmentsLov$ = this.store.metadataVm$.pipe(
      takeUntilDestroyed(),
      map((metadata) => mapStringToLov(metadata.departmentsLov))
    );
    this.rolesLov$ = this.store.metadataVm$.pipe(
      takeUntilDestroyed(),
      map((metadata) => mapStringToLov(metadata.rolesLov))
    );
    this.statesLov$ = this.store.metadataVm$.pipe(
      takeUntilDestroyed(),
      map((metadata) => mapStringToLov(metadata.statesLov))
    );
  }

  /**
   * Search takes search ui values from state, resets search results and search count
   * executes search, stores results in state and updates query params
   * If search is executed manually from app (not by changing query params in url then
   * subscription to url change must be completed before setting query params and
   * resubscribes after
   */
  search(
    searchValues: EmployeeOverviewSearchUi,
    retainPagination = false
  ): void {
    if (retainPagination) {
      this.store.resetEmployeeOverviewSearchValues(searchValues);
    } else {
      this.store.resetEmployeeOverviewSearchValuesAndPagination(searchValues);
    }
    this.updateQueryParamsFromState();
    this.search$.next();
  }

  paginate(index: number, size: number): void {
    this.store.setEmployeeOverviewPagination({ index: index + 1, size });
  }

  sort(attribute: string, order: string): void {
    this.store.setEmployeeOverviewSorting({ attribute, order });
  }

  public subscribeToSearch(): void {
    this.search$
      .pipe(
        tap(() => this.store.setEmployeeOverviewLoading()),
        switchMap(this.searchOperation$),
        catchError((err) => {
          this.store.setEmployeeOverviewError(err);
          this.onSearchError();
          this.searchError$.next();
          return of(EMPTY_RESPONSE);
        }),
        takeUntilDestroyed()
      )
      .subscribe((searchResult: EmployeeResourceCollection) => {
        this.store.setEmployeeOverviewLoaded();
        this.afterSearch(searchResult);
      });
  }

  private readonly afterSearch = (
    response: EmployeeResourceCollection
  ): void => {
    this.store.setEmployeeOverviewSearchResultAndCount({
      searchResult:
        EmployeeOverviewMapper.fromResourceCollectionToSearchResultUi(response),
      searchCount: response?.metadata?.totalResources
        ? response.metadata.totalResources
        : 0,
    });
  };

  public updateQueryParamsFromState(): void {
    this.urlParamsService.setUrlMergeQueryParams(
      this.activeTabIndex,
      EmployeeOverviewMapper.searchUiToQueryParams(
        this.searchValues$,
        this.searchMeta$
      )
    );
  }

  private readonly searchOperation$ =
    (): Observable<EmployeeResourceCollection> =>
      this.employeesOverviewBusiness.searchEmployees$(
        EmployeeOverviewMapper.fromEmployeeOverviewSearchUi(this.searchValues$),
        this.searchMeta$
      );

  private readonly onSearchError = (): void => {
    this.search$ = new Subject<void>();
    this.subscribeToSearch();
  };

  get activeTabIndex(): number {
    return this.activeTabInd;
  }

  public updateStateFromSearchUiAndSearchMeta(
    searchValues: EmployeeOverviewSearchUi,
    searchMeta: SearchMeta
  ): void {
    this.store.resetEmployeeOverviewSearchValuesAndMeta({
      searchValues,
      searchMeta,
    });
  }

  mergeSetUrl(queryParams: Params) {
    this.urlService.mergeSetUrl(queryParams, null);
  }

  urlChanged$() {
    return this.urlService.urlChanged$;
  }

  extractSearchValuesFromQueryParams(queryParams: Params) {
    const urlParams: Partial<EmployeeOverviewUrlQueryParams> =
      EmployeeOverviewMapper.fromQueryParamsToOverviewUrlQueryParams(
        queryParams
      );
    const searchValues =
      EmployeeOverviewMapper.queryParamsToSearchUi(urlParams);
    return searchValues;
  }

  extractSearchMetaFromQueryParams(queryParams: Params) {
    return EmployeeOverviewMapper.queryParamsToSearchMeta(queryParams);
  }

  extractQuickFilterPart(searchValues: EmployeeOverviewSearchUi) {
    return EmployeeOverviewMapper.fromSearchUiToQuickFilterUi(searchValues);
  }
}
