import { Injectable, OnDestroy } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, Subject, switchMap, takeUntil, tap } from "rxjs";
import { Category, EMPTY_PAGED_MEALS, PagedMeals, Topping } from "@hub/shared/model/food-models";
import { MealUpsertDataAccessService } from "../data-access/meal-upsert-data-access.service";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";
import { MealOrdersUpsertMapper } from "./meal-orders-upsert.mapper";


export interface MealSearchRequest{
  categoryId: number
  searchValue: string
}
@Injectable()
export class MealOrdersUpsertFacadeService implements OnDestroy{
  private search$ = new Subject<MealSearchRequest>();
  public readonly loadInProgress$ = new ReplaySubject<boolean>(1);
  private readonly searchError$ = new Subject<void>();
  private readonly unsubscribe$ = new Subject<void>();
  searchResult$: Subject<IMealsSearchResultUi[]> = new Subject<IMealsSearchResultUi[]>()

  categories$: Observable<Category[]> = this.dataService.categories$;

  toppings$: Observable<Topping[]> = this.dataService.toppings$;

  constructor(
    private readonly dataService: MealUpsertDataAccessService
  ) {
    this.subscribeToSearch();

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public executeSearch(categoryId: number, searchValue: string){
    this.search$.next({categoryId,searchValue});
  }
  private subscribeToSearch(): void {
    this.search$
      .pipe(
        tap(() => this.loadInProgress$.next(true)),
        switchMap((request: MealSearchRequest) => this.searchOperation$(request.categoryId, request.searchValue)),
        catchError(() => {
          this.loadInProgress$.next(false);
          this.onSearchError();
          this.searchError$.next();
          return of(EMPTY_PAGED_MEALS);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((searchResult: PagedMeals) => {
        this.loadInProgress$.next(false);
        this.afterSearch(searchResult);
      });
  }

  private readonly afterSearch = (response: PagedMeals): void => {
    this.searchResult$.next(MealOrdersUpsertMapper.fromResourceCollectionToSearchResultUi(response))
  };

  private readonly searchOperation$ = (categoryId: number, searchValue: string): Observable<PagedMeals> =>
    this.dataService.fetchMealsForCategory(categoryId,searchValue);

  private readonly onSearchError = (): void => {
    this.search$ = new Subject<MealSearchRequest>();
    this.subscribeToSearch();
  };


}
