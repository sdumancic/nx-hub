import { Injectable, OnDestroy } from "@angular/core";
import { MealSearchDataAccessService } from "../data-access/meal-search-data-access.service";
import { BehaviorSubject, map, Observable, Subject, switchMap, takeUntil, tap } from "rxjs";
import { Categories, Category, Meal } from "@hub/shared/model/food-models";
import { MealSearchMapper } from "./meal-search.mapper";
import { IMealSearchResultUi } from "./meal-search-result-ui.model";


export interface IMealSearchParams {
  categoryId: number
  searchValue: string
}
@Injectable()
export class MealSearchFacadeService implements OnDestroy {

  private readonly _isLoading = new BehaviorSubject<boolean>(false)
  private readonly _isCategoriesLoading = new BehaviorSubject<boolean>(false)
  private search$ = new Subject<IMealSearchParams>()
  private categoriesSearch$ = new Subject<void>()
  private readonly unsubscribe$ = new Subject()
  private readonly searchResult$ = new BehaviorSubject<IMealSearchResultUi[]>([])
  private readonly categoriesSearchResult$ = new BehaviorSubject<Category[]>([])
  public mealSuggestions$ = this.searchResult$.asObservable()
  public searchFinished$ = new BehaviorSubject<boolean>(false)
  public categories$ = this.categoriesSearchResult$.asObservable()

  constructor(private dataAccess: MealSearchDataAccessService) {
    this.setupSearch()
    this.setupCategoriesSearch()
  }
  get isLoading$(): Observable<boolean> {
    return this._isLoading.asObservable()
  }

  set isLoading(value: boolean) {
    this._isLoading.next(value)
  }

  get isCategoriesLoading$(): Observable<boolean> {
    return this._isCategoriesLoading.asObservable()
  }

  set isCategoriesLoading(value: boolean) {
    this._isCategoriesLoading.next(value)
  }

  public executeSearch(categoryId: number | undefined, searchValue: string | undefined): void {
    this.search$.next({
      categoryId: categoryId,
      searchValue: searchValue
    } as IMealSearchParams)
  }

  public fetchCategories(): void {
    this.categoriesSearch$.next()
  }

  private setupSearch(): void {
    this.search$
      .pipe(
        tap(() => (this.isLoading = true)),
        tap(() => (this.searchFinished$.next(false))),
        switchMap((params: IMealSearchParams) => this.searchMeal$(params)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        searchResult => {
          this.isLoading = false
          this.searchFinished$.next(true)
          this.searchResult$.next(searchResult)
        },
        error => {
          this.isLoading = false
          this.onSearchError()
          this.searchFinished$.next(true)
          throw error
        }
      )
  }

  private searchMeal$(
    params: IMealSearchParams
  ){
    return this.dataAccess
      .fetchMealsForCategory(
        params.categoryId, params.searchValue
      )
      .pipe(map(searchResult => MealSearchMapper.fromResource(searchResult)))
  }

  private setupCategoriesSearch(): void {
    this.categoriesSearch$
      .pipe(
        tap(() => (this.isCategoriesLoading = true)),
        takeUntil(this.unsubscribe$),
        switchMap(() => this.dataAccess.fetchCategories()),
        map(response => response.categories)
      )
      .subscribe(
        searchResult => {
          this.isCategoriesLoading = false
          this.categoriesSearchResult$.next(searchResult)
        },
        error => {
          this.isCategoriesLoading = false
          this.onCategoriesSearchError()
          throw error
        }
      )
  }

  private readonly onSearchError = (): void => {
    this.search$ = new Subject<IMealSearchParams>()
    this.setupSearch()
  }

  private readonly onCategoriesSearchError = (): void => {
    this.categoriesSearch$ = new Subject<void>()
    this.setupCategoriesSearch()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined)
    this.unsubscribe$.complete()
  }

}
