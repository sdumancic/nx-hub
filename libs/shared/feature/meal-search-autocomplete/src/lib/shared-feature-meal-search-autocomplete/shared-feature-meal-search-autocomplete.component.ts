import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  Inject,
  ChangeDetectorRef,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MealSearchFacadeService } from '../facade/meal-search-facade.service';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  EMPTY,
  filter,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { Category, } from '@hub/shared/model/food-models';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MealSearchAutocompleteFormService } from '../form/meal-search-autocomplete-form.service';
import { IMealSearchUi } from '../model/meal-search-ui.model';
import { MealSearchMapper } from '../facade/meal-search.mapper';

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
  providers: [
    MealSearchFacadeService,
    MealSearchAutocompleteFormService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => SharedFeatureMealSearchAutocompleteComponent
      ),
      multi: true,
    },
  ],
})
export class SharedFeatureMealSearchAutocompleteComponent
  implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor, Validator
{
  isLoading$ = this.facade.isLoading$;
  categories$: Observable<Category[]> = this.facade.categories$;
  mealsSearchList$: Observable<IMealSearchUi[] | []> | undefined;
  formGroup!: FormGroup;
  readonly = false;

  private readonly unsubscribe$ = new Subject();
  private readonly mealsManualList$ = new BehaviorSubject<IMealSearchUi[]>([]);

  constructor(
    // @Optional() @Self()  private readonly controlDirective: NgControl,
    @Optional() @Self() @Inject(NG_VALIDATORS) validators: any[],
    private readonly cdRef: ChangeDetectorRef,
    private readonly facade: MealSearchFacadeService,
    private readonly formService: MealSearchAutocompleteFormService
  ) {
    // this.controlDirective.valueAccessor = this;
    this.formGroup = this.formService.createFormGroup();
  }

  onChange: any = (dealer: IMealSearchUi | null) => {
    // indicate value change
  };

  onTouched: any = () => {
    // indicate interaction
  };

  ngOnInit() {
    /*const validator = this.controlDirective?.control?.validator
    if (validator){
      this.formGroup.setValidators(validator)
      this.formGroup.updateValueAndValidity()
      this.controlDirective.control?.setValidators(this.validate.bind(this))
    }*/
    this.fetchCategories();
    this.mealsSearchList$ = merge(
      this.mealsSearchResult$,
      this.mealsManualList$
    );
  }

  ngAfterViewInit() {
    this.facade.categories$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (val?.length > 0) {
          this.onChange(MealSearchMapper.emptyMeal(val[0].id));
          this.formService.categoryIdControl.setValue(val[0].id, {
            emitEvent: false,
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  writeValue(value: Partial<IMealSearchUi> | null): void {
    if (value === null) {
      this.formGroup.reset();
    } else {
      this.fetchOneMeal$(Number(value.id))
        .pipe(take(1))
        .subscribe((mealSearchUi) => {
          console.log(mealSearchUi);
          this.mealsManualList$.next([mealSearchUi]);
          this.formGroup.patchValue(mealSearchUi, { emitEvent: false });
          this.nameControl.setValue(mealSearchUi);
          this.onOptionSelected(mealSearchUi);
        });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable({ emitEvent: false });
      this.resetReadonlyAndList();
    } else {
      this.formGroup.enable({ emitEvent: false });
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const errors = {
      ...this.formService.getFormGroupErrors(
        this.formGroup.get('categoryIdControl') as FormGroup
      ),
      ...this.formService.getFormGroupErrors(
        this.formGroup.get('mealName') as FormGroup
      ),
    };

    return Object.keys(errors).length ? errors : null;
  }

  private get mealsSearchResult$(): Observable<IMealSearchUi[] | []> {
    return this.formGroup.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      filter((value: IMealSearchUi) => !value?.id),
      filter((value: IMealSearchUi) =>
        value.name?.length ? value.name?.length > 1 : false
      ),
      switchMap((searchValues: IMealSearchUi) => {
        return this.isValidSearchValue(searchValues)
          ? this.searchMeal$(searchValues)
          : of([]);
      }),
      takeUntil(this.unsubscribe$)
    );
  }

  private readonly isValidSearchValue = (value: IMealSearchUi): boolean => {
    return value?.categoryId !== null && value.name?.trim().length
      ? value.name?.trim().length > 0
      : false;
  };

  get categoryIdControl(): FormControl {
    return this.formService.categoryIdControl;
  }

  get nameControl(): FormControl {
    return this.formService.nameControl;
  }

  private fetchOneMeal$(id: number): Observable<IMealSearchUi> {
    this.facade.isLoading = true;
    return this.facade.fetchOneMeal$(id).pipe(
      delay(200),
      tap(() => (this.facade.isLoading = false)),

      catchError(() => {
        this.facade.isLoading = false;
        return EMPTY;
      })
    );
  }

  private searchMeal$(searchValues: any): Observable<IMealSearchUi[]> {
    this.facade.isLoading = true;

    return this.facade.searchMeal$(searchValues).pipe(
      delay(1000),
      tap(() => (this.facade.isLoading = false)),

      catchError(() => {
        this.facade.isLoading = false;
        return EMPTY;
      })
    );
  }

  private fetchCategories(): void {
    this.categoryIdControl.setValue(null);
    this.facade.fetchCategories();
  }

  onOptionSelected(meal: IMealSearchUi) {
    //this.readonly = true
    this.onChange(meal);
    this.onTouched();
  }

  getOptionText = (option: IMealSearchUi): string => {
    return option?.id ? option.name + ' ($' + option.price + ')' : '';
  };

  onCategoryChanged(categoryId: any) {
    this.onChange(MealSearchMapper.emptyMeal(categoryId));
    this.onTouched();
    this.formService.nameControl.setValue(null);
  }

  resetValue(): void {
    this.resetReadonlyAndList();
    const emptyMeal = MealSearchMapper.emptyMeal(
      this.formService.categoryIdControl.getRawValue()
    );
    this.formGroup.setValue(emptyMeal);
    this.onChange(emptyMeal);
  }

  private resetReadonlyAndList(): void {
    this.mealsManualList$.next([]);
    this.readonly = false;
  }
}
