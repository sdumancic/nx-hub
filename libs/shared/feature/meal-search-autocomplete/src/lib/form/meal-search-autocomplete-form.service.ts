import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { combineLatest, merge, Observable, zip } from "rxjs";
import { IMealSearchParams } from "../model/meal-search-params.model";

@Injectable()
export class MealSearchAutocompleteFormService {

  private readonly CATEGORY_ID_CONTROL = [null]
  private readonly MEAL_NAME_CONTROL = [null]

  private readonly MEAL_SEARCH = {
    categoryId: this.CATEGORY_ID_CONTROL,
    mealName: this.MEAL_NAME_CONTROL
  }

  private formGroup: FormGroup | undefined

  constructor (private readonly formBuilder: FormBuilder) {}

  public get categoryIdControl (): FormControl {
    return this.formGroup?.get('categoryId') as FormControl
  }

  public get mealNameControl (): FormControl {
    return this.formGroup?.get('mealName') as FormControl
  }

  public setValue (value: IMealSearchParams, emitEvent?: boolean): void {
    this.formGroup?.setValue(value, {
      emitEvent: emitEvent
    })
  }

  public createFormGroup (): FormGroup {
    const formGroup = this.formBuilder.group(this.MEAL_SEARCH)
    this.formGroup = formGroup
    return formGroup
  }

  public setSynchronousValidators (validator: ValidatorFn): void {
    this.categoryIdControl.setValidators(validator)
    this.mealNameControl.setValidators(validator)
    this.formGroup?.updateValueAndValidity()
  }

  public reset (): void {
    this.formGroup?.reset()
  }


}
