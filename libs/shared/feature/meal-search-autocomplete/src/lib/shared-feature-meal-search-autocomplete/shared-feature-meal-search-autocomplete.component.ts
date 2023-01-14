import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MealSearchFacadeService } from '../facade/meal-search-facade.service';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged, EMPTY,
  filter, merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap
} from "rxjs";
import { Category, Meal } from '@hub/shared/model/food-models';
import { IMealSearchResultUi } from '../model/meal-search-result-ui.model';
import { MealSearchMapper } from '../facade/meal-search.mapper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MealSearchAutocompleteFormService } from '../form/meal-search-autocomplete-form.service';
import { IMealSearchParams } from "../model/meal-search-params.model";

@Component({
  selector: 'hub-shared-feature-meal-search-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './shared-feature-meal-search-autocomplete.component.html',
  styleUrls: ['./shared-feature-meal-search-autocomplete.component.scss'],
  providers: [MealSearchFacadeService, MealSearchAutocompleteFormService],
})
export class SharedFeatureMealSearchAutocompleteComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  isLoading$ = this.facade.isLoading$;
  categories$: Observable<Category[]> = this.facade.categories$;
  private readonly unsubscribe$ = new Subject();
  //mealSuggestions: IMealSearchResultUi[] = [];

  mealsSearchList$: Observable<IMealSearchResultUi[] | []> | undefined
  private readonly mealsManualList$ = new BehaviorSubject<
    IMealSearchResultUi[]
  >([])
  formGroup: FormGroup = this.formService.createFormGroup();

  @ViewChild('autocompleteInput', { read: MatAutocompleteTrigger })
  matAutoCompleteTrigger: MatAutocompleteTrigger | undefined;

  constructor(
    private readonly facade: MealSearchFacadeService,
    private readonly formService: MealSearchAutocompleteFormService) {}

  ngOnInit() {
    this.fetchCategories();
    this.mealsSearchList$ = merge(
      this.mealsSearchResult$,
      this.mealsManualList$
    )
  }
  ngAfterViewInit() {
    this.facade.categories$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (val?.length > 0) {
          this.formService.categoryIdControl.setValue(val[0].id, {emitEvent:false}) ;
        }
      });
    /*this.facade.mealSuggestions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        this.mealSuggestions = val;
        if (val?.length > 0) {
          this.matAutoCompleteTrigger?.openPanel();
        } else {
          if (this.facade.searchFinished$.getValue()) {
            this.mealSuggestions = [MealSearchMapper.emptyMealSearchResultUi()];
            this.matAutoCompleteTrigger?.openPanel();
          } else {
            this.mealSuggestions = [];
          }
        }
      });
*/

  }

  private get mealsSearchResult$ (): Observable<
    IMealSearchResultUi[] | []
  > {
    return this.formGroup.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      filter(value => !value?.mealName?.id),
      switchMap((searchValues:IMealSearchParams) => {
        return this.isValidSearchValue(searchValues)
          ? this.searchMeal$(searchValues)
          : of([])
      }),
      takeUntil(this.unsubscribe$)
    )
  }

  private readonly isValidSearchValue = (value: IMealSearchParams): boolean => {

    return value?.categoryId !== null && value?.mealName?.trim().length > 0
  }

  get categoryControl (): FormControl {
    return this.formService.categoryIdControl
  }

  get mealControl (): FormControl {
    return this.formService.mealNameControl
  }

  private searchMeal$ (
    searchValues: any
  ): Observable<IMealSearchResultUi[]> {
    this.facade.isLoading = true;

    return this.facade.searchMeal$(searchValues).pipe(
      tap(() => ( this.facade.isLoading = false)),
      catchError(() => {
        this.facade.isLoading = false
        return EMPTY
      })
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  private fetchCategories(): void {
    this.categoryControl.setValue(null)
    this.facade.fetchCategories();
  }

  onMealSelected(meal: IMealSearchResultUi) {}

  onOptionSelected (meal: IMealSearchResultUi): void {
    //this.readonly = true
    //this.onChange(meal)
  }

  getOptionText = (option: IMealSearchResultUi): string => {
    return option?.id ? option.name + ' ($' + option.price + ')' : ''
  }
  readonly: any;

  onTouched() {

  }

  onCategoryChanged() {
    this.formService.mealNameControl.setValue(null)
  }
}
