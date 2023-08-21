import { Injectable, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as moment from 'moment';
import {
  BehaviorSubject, combineLatestAll, merge, mergeAll,
  Observable,
  of,
  ReplaySubject,
  Subject, take
} from "rxjs";
import {
  catchError,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators'
import {
  EmployeeOverviewUrlQueryParams
} from "./url-params/employee-overview-url-params.model";
import { OverviewUrlParamsService } from './url-params/overview-url-params.service'
import { EmployeesOverviewBusiness } from "../../business/employees-overview/employees-overview-business.service";
import { LovItem, SearchMeta } from "../../data-access/standard.model";
import { EmployeeOverviewSearchUi } from "../../presentation/employees-overview/form/employee-overview-search.ui.model";
import {
  EmployeeOverviewSearchResultUi
} from "../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model";
import { EmployeeResourceCollection } from "../../data-access/employees-overview/employee-overview.model";
import { EmployeeOverviewState, EMPTY_RESPONSE, SEARCH_VALUES_DEFAULT } from "./state/employee-overview-state.model";
import { EmployeeOverviewStateService } from "./state/employee-overview-state.service";
import { EmployeeOverviewMapper } from "./employee-overview.mapper";

@Injectable()
export class EmployeeOverviewFacade implements OnDestroy {
  private search$ = new Subject<void>()
  private readonly loadInProgress$ = new ReplaySubject<boolean>(1) // replay because datatable is late on first emitted item (initial search)
  private readonly searchError$ = new Subject<void>()
  private readonly unsubscribe$ = new Subject<void>()

  gendersLov$: Observable<LovItem[]> =
    this.employeesOverviewBusiness.gendersLov$

  departmentsLov$: Observable<LovItem[]> =
    this.employeesOverviewBusiness.departmentsLov$

  rolesLov$: Observable<LovItem[]> =
    this.employeesOverviewBusiness.rolesLov$

  statesLov$: Observable<LovItem[]> =
    this.employeesOverviewBusiness.statesLov$

  private readonly executeSearchAtQueryParamsChange$ = new BehaviorSubject<boolean>(
    false
  )

  private activeTabInd: number

  get loading$ (): Observable<boolean> {
    return this.loadInProgress$.asObservable()
  }

  get searchValues (): EmployeeOverviewSearchUi {
    return this.state.snapshot.searchValues
  }

  get searchValues$ (): Observable<EmployeeOverviewSearchUi> {
    return this.state.searchValues$
  }

  get searchResult$ (): Observable<EmployeeOverviewSearchResultUi[]> {
    return this.state.searchResult$
  }

  get searchMeta$ (): Observable<SearchMeta> {
    return this.state.searchMeta$
  }

  get searchCount$ (): Observable<number> {
    return this.state.searchCount$
  }

  get searchingErrors$ (): Observable<void> {
    return this.searchError$.asObservable()
  }

  constructor (
    private readonly employeesOverviewBusiness: EmployeesOverviewBusiness,
    private readonly state: EmployeeOverviewStateService,
    private readonly urlParamsService: OverviewUrlParamsService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.subscribeToSearch()
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  listenSearchValuesFromQueryParams (): Observable<EmployeeOverviewSearchUi> {
    return this.urlParamsService.urlChanged$.pipe(
      withLatestFrom(this.executeSearchAtQueryParamsChange$),
      tap((val) => console.log('xxx listenSearchValuesFromQueryParams' ,val) ),
      switchMap(([queryParams, executeSearch]) => {
        if (executeSearch) {
          this.search$.next() // search only if there is any query param set
          this.executeSearchAtQueryParamsChange$.next(false)
          return of(null)
        }
        return this.extractSearchValues$(queryParams)
        //return this.extractSearchValuesAndSearch$(queryParams)
      })
    )
  }

  extractSearchValues$(queryParams: Partial<EmployeeOverviewUrlQueryParams>): Observable<EmployeeOverviewSearchUi> {
    this.updateStateFromQueryParams(queryParams)
    return of(this.searchValues)
  }

  extractSearchValuesAndSearch$(
    queryParams: Partial<EmployeeOverviewUrlQueryParams>
  ): Observable<EmployeeOverviewSearchUi> {
    if (Object.keys(queryParams).length === 0) {
      this.state.reset()
      return this.getDefaultSearchValues$()
    }
    this.updateStateFromQueryParams(queryParams)

    this.search$.next()
    this.executeSearchAtQueryParamsChange$.next(false)

    return of(this.searchValues)
  }

  resetState (): void {
    this.state.reset()
  }

  search (searchValues: EmployeeOverviewSearchUi): void {
    this.state.resetSearchValues(searchValues)
    this.executeSearchAtQueryParamsChange$.next(false)
    this.updateQueryParamsFromState()
    this.search$.next()
  }

  paginate (index: number, size: number): void {
    this.state.updatePagination(index, size)
    if (this.state.snapshot.searchCount > 1) {
      this.updateQueryParamsFromState();
      this.search$.next()
    }
  }

  sort (attribute: string, order: string): void {
    this.state.updateSorting(
      //EmployeeOverviewMapper.getSortingAttributeKey(attribute),
      attribute,
      order
    )
    this.executeSearchAtQueryParamsChange$.next(true)
    this.updateQueryParamsFromState();
    if (this.state.snapshot.searchCount > 1) {


    }
  }

  reset (): void {
    this.state.reset()
    this.urlParamsService.mergeSetUrl({}, {})
  }


  getDefaultSearchValues$ (): Observable<EmployeeOverviewSearchUi> {
    const now = moment(new Date()).utc(true).endOf('day')
    const monthAgo = moment(new Date()).utc(true).startOf('day')
    monthAgo.subtract(15, 'years')
    return of({
      ...SEARCH_VALUES_DEFAULT,
      hiredOnFrom: monthAgo.toISOString(),
      hiredOnUntil: now.toISOString()
    })
  }

  public subscribeToSearch (): void {
    this.search$
      .pipe(
        tap(() => this.loadInProgress$.next(true)),
        switchMap(this.searchOperation$),
        catchError(() => {
          this.loadInProgress$.next(false)
          this.onSearchError()
          this.searchError$.next()
          return of(EMPTY_RESPONSE)
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((searchResult: EmployeeResourceCollection) => {
        this.loadInProgress$.next(false)
        this.afterSearch(searchResult)
      })
  }

  private readonly afterSearch = (
    response: EmployeeResourceCollection
  ): void => {
    this.state.set({
      searchResult:
        EmployeeOverviewMapper.fromResourceCollectionToSearchResultUi(response),
      searchCount: response?.metadata?.totalResources
        ? response.metadata.totalResources
        : 0
    })
  }

  private updateStateFromQueryParams (
    queryParams: Partial<EmployeeOverviewUrlQueryParams>
  ): void {
    const searchValues = EmployeeOverviewMapper.queryParamsToSearchUi(queryParams)
    const searchMeta = EmployeeOverviewMapper.queryParamsToSearchMeta(queryParams)
    this.state.resetSearchValuesAndMeta(searchValues, searchMeta)
  }

  public updateQueryParamsFromState (): void {
    this.urlParamsService.setUrlMergeQueryParams(
      this.activeTabIndex,
      EmployeeOverviewMapper.searchUiToQueryParams(
        this.searchValues,
        this.state.snapshot.searchMeta
      )
    )
  }

  private readonly searchOperation$ = (): Observable<
  EmployeeResourceCollection
  > =>
    this.employeesOverviewBusiness.searchEmployees$(
      EmployeeOverviewMapper.fromEmployeeOverviewSearchUi(this.searchValues),
      this.state.snapshot.searchMeta
    )

  private readonly onSearchError = (): void => {
    this.search$ = new Subject<void>()
    this.subscribeToSearch()
  }

  setActiveTab (index: number): void {
    this.activeTabInd = index
  }

  get activeTabIndex (): number {
    return this.activeTabInd
  }

  refreshMetadata (): void {
    this.employeesOverviewBusiness.refreshMetadata()
  }


}
