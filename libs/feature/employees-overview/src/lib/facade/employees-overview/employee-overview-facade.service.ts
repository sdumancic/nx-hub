import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { OverviewUrlParamsService } from './url-params/overview-url-params.service';
import { EmployeesOverviewBusiness } from '../../business/employees-overview/employees-overview-business.service';
import { LovItem, SearchMeta } from '../../data-access/standard.model';
import { EmployeeOverviewSearchUi } from '../../presentation/employees-overview/form/employee-overview-search.ui.model';
import { EmployeeOverviewSearchResultUi } from '../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model';
import { EmployeeResourceCollection } from '../../data-access/employees-overview/employee-overview.model';
import { EMPTY_RESPONSE } from './state/employee-overview-state.model';
import { EmployeeOverviewStateService } from './state/employee-overview-state.service';
import { EmployeeOverviewMapper } from './employee-overview.mapper';
import { mapStringToLov$ } from '../../util/map-string-to-lov';
import { Params } from '@angular/router';
import { EmployeeOverviewUrlQueryParams } from './url-params/employee-overview-url-params.model';

@Injectable()
export class EmployeeOverviewFacade implements OnDestroy {
  private search$ = new Subject<void>();
  private readonly loadInProgress$ = new ReplaySubject<boolean>(1); // replay because datatable is late on first emitted item (initial search)
  private readonly searchError$ = new Subject<void>();
  private readonly unsubscribe$ = new Subject<void>();

  gendersLov$: Observable<LovItem[]> = mapStringToLov$(this.state.genders$);

  departmentsLov$: Observable<LovItem[]> = mapStringToLov$(
    this.state.departments$
  );

  rolesLov$: Observable<LovItem[]> = mapStringToLov$(this.state.rolesLov$);

  statesLov$: Observable<LovItem[]> = mapStringToLov$(this.state.statesLov$);

  private readonly executeSearchAtQueryParamsChange$ =
    new BehaviorSubject<boolean>(false);

  private activeTabInd: number;

  get loading$(): Observable<boolean> {
    return this.loadInProgress$.asObservable();
  }

  get searchValues(): EmployeeOverviewSearchUi {
    return this.state.snapshot.searchValues;
  }

  get searchValues$(): Observable<EmployeeOverviewSearchUi> {
    return this.state.searchValues$;
  }

  get searchResult$(): Observable<EmployeeOverviewSearchResultUi[]> {
    return this.state.searchResult$;
  }

  get searchMeta$(): Observable<SearchMeta> {
    return this.state.searchMeta$;
  }

  get searchCount$(): Observable<number> {
    return this.state.searchCount$;
  }

  constructor(
    private readonly employeesOverviewBusiness: EmployeesOverviewBusiness,
    private readonly state: EmployeeOverviewStateService,
    private readonly urlParamsService: OverviewUrlParamsService,
    private readonly urlService: OverviewUrlParamsService
  ) {
    this.subscribeToSearch();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    //const searchValues: EmployeeOverviewSearchUi = this.state.snapshot.searchValues
    this.state.resetSearchValues(searchValues, retainPagination);
    this.updateQueryParamsFromState();
    this.search$.next();
  }

  paginate(index: number, size: number): void {
    this.state.updatePagination(index + 1, size);
  }

  sort(attribute: string, order: string): void {
    this.state.updateSorting(attribute, order);
  }

  public subscribeToSearch(): void {
    this.search$
      .pipe(
        tap(() => this.loadInProgress$.next(true)),
        switchMap(this.searchOperation$),
        catchError(() => {
          this.loadInProgress$.next(false);
          this.onSearchError();
          this.searchError$.next();
          return of(EMPTY_RESPONSE);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((searchResult: EmployeeResourceCollection) => {
        this.loadInProgress$.next(false);
        this.afterSearch(searchResult);
      });
  }

  private readonly afterSearch = (
    response: EmployeeResourceCollection
  ): void => {
    this.state.set({
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
        this.searchValues,
        this.state.snapshot.searchMeta
      )
    );
  }

  private readonly searchOperation$ =
    (): Observable<EmployeeResourceCollection> =>
      this.employeesOverviewBusiness.searchEmployees$(
        EmployeeOverviewMapper.fromEmployeeOverviewSearchUi(this.searchValues),
        this.state.snapshot.searchMeta
      );

  private readonly onSearchError = (): void => {
    this.search$ = new Subject<void>();
    this.subscribeToSearch();
  };

  get activeTabIndex(): number {
    return this.activeTabInd;
  }

  refreshMetadata$() {
    return this.employeesOverviewBusiness.refreshMetadata$().pipe(
      tap((metadata) => {
        this.state.set({ metadata: metadata });
      })
    );
  }

  public updateStateFromSearchUiAndSearchMeta(
    searchValues: EmployeeOverviewSearchUi,
    searchMeta: SearchMeta
  ): void {
    this.state.resetSearchValuesAndMeta(searchValues, searchMeta);
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
