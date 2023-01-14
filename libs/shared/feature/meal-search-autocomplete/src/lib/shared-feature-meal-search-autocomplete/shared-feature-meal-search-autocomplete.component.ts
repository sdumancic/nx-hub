import { AfterViewInit, Component, OnDestroy, ViewChild ,OnInit} from "@angular/core";
import { CommonModule } from '@angular/common';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MealSearchFacadeService } from "../facade/meal-search-facade.service";
import { Observable, Subject, takeUntil } from "rxjs";
import { Category, Meal } from "@hub/shared/model/food-models";
import { IMealSearchResultUi } from "../facade/meal-search-result-ui.model";
import { MealSearchMapper } from "../facade/meal-search.mapper";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'hub-shared-feature-meal-search-autocomplete',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatProgressSpinnerModule, MatIconModule, MatSelectModule],
  templateUrl: './shared-feature-meal-search-autocomplete.component.html',
  styleUrls: ['./shared-feature-meal-search-autocomplete.component.scss'],
  providers: [
    MealSearchFacadeService
  ]
})
export class SharedFeatureMealSearchAutocompleteComponent  implements OnInit, OnDestroy, AfterViewInit  {

  searchVal: string|undefined= undefined
  selectedCategoryId: number|undefined = undefined

  isLoading$ = this.facade.isLoading$
  isCategoriesLoading$ = this.facade.isCategoriesLoading$
  categories$: Observable<Category[]> = this.facade.categories$
  private readonly unsubscribe$ = new Subject()
  mealSuggestions: IMealSearchResultUi[] = []

  @ViewChild('autocompleteInput', { read: MatAutocompleteTrigger }) matAutoCompleteTrigger: MatAutocompleteTrigger | undefined

  constructor(
    private readonly facade: MealSearchFacadeService
  ) {
  }

  ngOnInit(){
    this.fetchCategories()
  }
  ngAfterViewInit() {

    this.facade.categories$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(val => {
        if (val?.length > 0) {
          this.selectedCategoryId = val[0].id
        }
      })
    this.facade.mealSuggestions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(val => {
        this.mealSuggestions = val
        if (val?.length > 0) {
          this.matAutoCompleteTrigger?.openPanel()
        } else {
          if (this.facade.searchFinished$.getValue()) {
            this.mealSuggestions = [MealSearchMapper.emptyMealSearchResultUi()]
            this.matAutoCompleteTrigger?.openPanel()
          } else {
            this.mealSuggestions = []
          }
        }
      })
  }

  searchMeal (): void {
    this.matAutoCompleteTrigger?.closePanel()
    this.facade.executeSearch(this.selectedCategoryId, this.searchVal)
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next(undefined)
    this.unsubscribe$.complete()
  }

  private fetchCategories (): void {
    this.selectedCategoryId = undefined
    this.facade.fetchCategories()
  }

  displayMealName (meal: IMealSearchResultUi): string {
    const {
      id,
      name,
      description,
      calories
    } = meal

    if (id === null) {
      return 'No data found'
    }
    return `${name}`
  }

  displayMealDescription (meal: IMealSearchResultUi): string {
    const {
      id,
      name,
      description,
      calories
    } = meal

    if (id === null) {
      return ''
    }
    return `${description} (${calories} Calories)`
  }

    allowSelection (meal: IMealSearchResultUi): { [className: string]: boolean } {
    return {
      'no-data': meal.id === null
    }
  }

  onMealSelected(meal: IMealSearchResultUi) {

  }
}
