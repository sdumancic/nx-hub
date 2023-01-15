import { AbstractControl,  ValidationErrors, ValidatorFn } from "@angular/forms";

export const MealRequiredValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value?.categoryId || !control.value?.name) {
    return { required: true }
  }

  return null
}
