import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, Subject, switchMap, takeUntil, tap } from "rxjs";
import { Category, PagedOrders, Topping } from "@hub/shared/model/food-models";
import { MealOrdersOverviewStateService } from "./state/meal-orders-overview-state.service";
import { MealOrdersOverviewMapper } from "./meal-orders-overview.mapper";
import { EMPTY_RESPONSE, ISearchMeta, SEARCH_VALUES_DEFAULT } from "./state/meal-orders-overview-state.model";
import { IOrdersOverviewSearchResultUi } from "../presentation/table/orders-overview-search-result.ui.model";
import { IMealOrdersOverviewSearchUi } from "../forms/meal-orders-overview-search.ui.model";
import { OrdersOverviewService } from "../business/orders-overview.service";
import { PartOrdersOverviewTabs } from "../presentation/order-overview-tabs";
import * as moment from "moment";

@Injectable()
export class MealOrdersOverviewFacadeService implements OnDestroy{
  private search$ = new Subject<void>();
  private readonly loadInProgress$ = new ReplaySubject<boolean>(1);
  private readonly searchError$ = new Subject<void>();
  private readonly unsubscribe$ = new Subject<void>();

  categories$: Observable<Category[]> = this.dataService.categories$;

  toppings$: Observable<Topping[]> = this.dataService.toppings$;

  private readonly paramsInternallyChanged$ = new BehaviorSubject<boolean>(
    false
  );

  private activeTabInd: number;

  get loading$(): Observable<boolean> {
    return this.loadInProgress$.asObservable();
  }

  get searchValues(): IMealOrdersOverviewSearchUi {
    return this.state.snapshot.searchValues;
  }

  get searchValues$(): Observable<IMealOrdersOverviewSearchUi> {
    return this.state.searchValues$;
  }

  get searchResult$(): Observable<IOrdersOverviewSearchResultUi[]> {
    return this.state.searchResult$;
  }

  get searchMeta$(): Observable<ISearchMeta> {
    return this.state.searchMeta$;
  }

  get searchCount$(): Observable<number> {
    return this.state.searchCount$;
  }

  get searchingErrors$(): Observable<void> {
    return this.searchError$.asObservable();
  }

  constructor(
    private readonly dataService: OrdersOverviewService,
    private readonly state: MealOrdersOverviewStateService
  ) {
    this.subscribeToSearch();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  resetState(): void {
    this.state.reset();
  }

  search(searchValues: IMealOrdersOverviewSearchUi): void {
    this.state.resetSearchValues(searchValues);
    this.search$.next()
  }

  paginate(index: number, size: number): void {
    this.state.updatePagination(index, size);
    this.state.snapshot.searchCount > 1 && this.search$.next(undefined);
  }

  sort(attribute: string, order: string): void {
    this.state.updateSorting(
      MealOrdersOverviewMapper.getSortingAttributeKey(attribute),
      order
    );
    this.state.snapshot?.searchCount > 1 && this.search$.next(undefined);
  }

  getDefaultSearchValues(status?: string[]
  ): IMealOrdersOverviewSearchUi {
    const now = moment(new Date()).utc(true).endOf('day');
    const monthAgo = moment(new Date()).utc(true).startOf('day');
    monthAgo.subtract(1, 'M');
    return {
      ...SEARCH_VALUES_DEFAULT,
      status: status ? status: [],
      datePlacedFrom: monthAgo.toISOString(),
      datePlacedTo: now.toISOString(),
    };
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
      .subscribe((searchResult: PagedOrders) => {
        this.loadInProgress$.next(false);
        this.afterSearch(searchResult);
      });
  }

  private readonly afterSearch = (response: PagedOrders): void => {
    this.state.set({
      searchResult:
        MealOrdersOverviewMapper.fromResourceCollectionToSearchResultUi(
          response
        ),
      searchCount: response?.count ? response.count : 0,
    });
  };

  private readonly searchOperation$ = (): Observable<PagedOrders> =>
    this.dataService.searchOrders$(
      this.state.snapshot.searchValues,
      this.state.snapshot.searchMeta
    );

  private readonly onSearchError = (): void => {
    this.search$ = new Subject<void>();
    this.subscribeToSearch();
  };

  setActiveTab(index: PartOrdersOverviewTabs): void {
    this.activeTabInd = index;
  }

  get activeTabIndex(): PartOrdersOverviewTabs {
    return this.activeTabInd;
  }

  reset() {
    this.state.reset();
  }
}
