import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface EmployeeOverviewQuickFilter {
  username: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class EmployeeOverviewQuickFilterForm {
  private form: FormGroup = new FormGroup({
    username: new FormControl(null, { updateOn: 'blur' }),
    firstName: new FormControl(null, { updateOn: 'blur' }),
    lastName: new FormControl(null, { updateOn: 'blur' }),
  });

  get formGroup(): FormGroup {
    return this.form;
  }

  get formGroupRawValue(): EmployeeOverviewQuickFilter {
    return { ...(this.form.getRawValue() as EmployeeOverviewQuickFilter) };
  }

  setFormValue(value: EmployeeOverviewQuickFilter) {
    this.formGroup.patchValue(value, { emitEvent: false });
  }
}
