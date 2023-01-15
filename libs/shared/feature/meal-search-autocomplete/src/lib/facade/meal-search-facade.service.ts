import { Injectable, OnDestroy } from '@angular/core';
import { MealSearchDataAccessService } from '../data-access/meal-search-data-access.service';
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Category } from '@hub/shared/model/food-models';
import { MealSearchMapper } from './meal-search.mapper';
import { IMealSearchUi } from "../model/meal-search-ui.model";


@Injectable()
export class MealSearchFacadeService implements OnDestroy {
  private readonly _isLoading = new BehaviorSubject<boolean>(false);
  private categoriesSearch$ = new Subject<void>();
  private readonly unsubscribe$ = new Subject();
  private readonly categoriesSearchResult$ = new BehaviorSubject<Category[]>(
    []
  );
  public categories$ = this.categoriesSearchResult$.asObservable();

  constructor(private dataAccess: MealSearchDataAccessService) {
    this.setupCategoriesSearch();
  }
  get isLoading$(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  set isLoading(value: boolean) {
    this._isLoading.next(value);
  }

  public fetchCategories(): void {
    this.categoriesSearch$.next();
  }

  public searchMeal$(params: IMealSearchUi) {
    if (!params.categoryId){
      throw Error('categoryId is mandatory')
    }
    return this.dataAccess
      .fetchMealsForCategory(params.categoryId, params.name)
      .pipe(map((searchResult) => MealSearchMapper.fromResources(searchResult)));
  }

  public fetchOneMeal$(id: number) {
    if (!id){
      throw Error('id is mandatory')
    }
    return this.dataAccess
      .fetchOneMeal(id)
      .pipe(map((searchResult) => MealSearchMapper.fromMealToMealSearchUi(searchResult)));
  }

  private setupCategoriesSearch(): void {
    this.categoriesSearch$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.dataAccess.fetchCategories()),
        map((response) => response.categories)
      )
      .subscribe(
        (searchResult) => {
          this.categoriesSearchResult$.next(searchResult);
        },
        (error) => {
          this.onCategoriesSearchError();
          throw error;
        }
      );
  }

  private readonly onCategoriesSearchError = (): void => {
    this.categoriesSearch$ = new Subject<void>();
    this.setupCategoriesSearch();
  };

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }
}
