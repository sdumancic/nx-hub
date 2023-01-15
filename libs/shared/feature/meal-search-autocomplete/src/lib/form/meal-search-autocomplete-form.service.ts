import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup, ValidationErrors,
  ValidatorFn
} from "@angular/forms";
import { IMealSearchUi } from "../model/meal-search-ui.model";

@Injectable()
export class MealSearchAutocompleteFormService {
  private readonly CATEGORY_ID_CONTROL = [null];
  private readonly ID_CONTROL = [null];
  private readonly NAME_CONTROL = [null];
  private readonly DESCRIPTION_CONTROL = [null]
  private readonly CALORIES_CONTROL = [null]
  private readonly PRICE_CONTROL = [null]

  private readonly MEAL_SEARCH = {
    id: this.ID_CONTROL,
    name: this.NAME_CONTROL,
    description: this.DESCRIPTION_CONTROL,
    calories: this.CALORIES_CONTROL,
    price: this.PRICE_CONTROL,
    categoryId: this.CATEGORY_ID_CONTROL,
  };

  private formGroup: FormGroup | undefined;

  constructor(private readonly formBuilder: FormBuilder) {}

  public get categoryIdControl(): FormControl {
    return this.formGroup?.get('categoryId') as FormControl;
  }

  public get nameControl(): FormControl {
    return this.formGroup?.get('name') as FormControl;
  }

  public setValue(value: IMealSearchUi, emitEvent?: boolean): void {
    this.formGroup?.setValue(value, {
      emitEvent: emitEvent,
    });
  }

  public createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group(this.MEAL_SEARCH);
    this.formGroup = formGroup;
    return formGroup;
  }

  public setSynchronousValidators(validator: ValidatorFn): void {
    this.categoryIdControl.setValidators(validator);
    this.nameControl.setValidators(validator);
    this.formGroup?.updateValueAndValidity();
  }

  public reset(): void {
    this.formGroup?.reset();
  }

  getFormGroupErrors(formGroup: FormGroup): ValidationErrors {
    return {
      ...formGroup.get('categoryId')?.errors,
      ...formGroup.get('name')?.errors
    };
  }
}
