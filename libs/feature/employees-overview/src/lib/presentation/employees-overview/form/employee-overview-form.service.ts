import { Injectable } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { EmployeeOverviewSearchUi } from './employee-overview-search.ui.model'

@Injectable()
export class EmployeeOverviewForm {
  private form: FormGroup

  get formGroup (): FormGroup {
    return this.form
  }

  get formGroupRawValue (): EmployeeOverviewSearchUi {
    return { ...(this.form.getRawValue() as EmployeeOverviewSearchUi) }
  }

  constructor () {
    this.createFormGroup()
  }

  resetValue (value: EmployeeOverviewSearchUi): void {
    this.form.reset(value, { emitEvent: false }) // we do not want to emit this event because we do not want quick filters to detect valueChanges
  }

  private createFormGroup (): void {
    this.form = new FormGroup({
      username: new FormControl(null, { updateOn: 'blur' }),
      firstName: new FormControl(null, { updateOn: 'blur' }),
      lastName: new FormControl(null, { updateOn: 'blur' }),
      email: new FormControl(null, { updateOn: 'blur' }),
      street: new FormControl(null, { updateOn: 'blur' }),
      city: new FormControl(null, { updateOn: 'blur' }),
      state: new FormControl(null, {
        updateOn: 'blur'
      }),
      zip: new FormControl(null, { updateOn: 'blur' }),
      roles: new FormControl(null, { updateOn: 'blur' }),
      department: new FormControl(null, { updateOn: 'blur' }),
      gender: new FormControl(null, { updateOn: 'blur' }),
      dobFrom: new FormControl(null, { updateOn: 'blur' }),
      dobUntil: new FormControl(null, { updateOn: 'blur' }),
      hiredOnFrom: new FormControl(null, { updateOn: 'blur' }),
      hiredOnUntil: new FormControl(null, { updateOn: 'blur' }),
      terminatedOnFrom: new FormControl(null, { updateOn: 'blur' }),
      terminatedOnUntil: new FormControl(null, { updateOn: 'blur' })
    })
  }

  get usernameControl (): FormControl {
    return this.form.get('username') as FormControl
  }

  get firstNameControl (): FormControl {
    return this.form.get('firstName') as FormControl
  }

  get lastNameControl (): FormControl {
    return this.form.get('lastName') as FormControl
  }

  get emailControl (): FormControl {
    return this.form.get('email') as FormControl
  }

  get streetControl (): FormControl {
    return this.form.get('street') as FormControl
  }

  get cityControl (): FormControl {
    return this.form.get('city') as FormControl
  }

  get stateControl (): FormControl {
    return this.form.get('state') as FormControl
  }

  get zipControl (): FormControl {
    return this.form.get('zip') as FormControl
  }

  get rolesControl (): FormControl {
    return this.form.get('roles') as FormControl
  }

  get departmentControl (): FormControl {
    return this.form.get('department') as FormControl
  }

  get genderControl (): FormControl {
    return this.form.get('gender') as FormControl
  }

  get dobFromControl (): FormControl {
    return this.form.get('dobFrom') as FormControl
  }

  get dobUntilControl (): FormControl {
    return this.form.get('dobUntil') as FormControl
  }

  get hiredOnFromControl (): FormControl {
    return this.form.get('hiredOnFrom') as FormControl
  }

  get hiredOnUntilControl (): FormControl {
    return this.form.get('hiredOnUntil') as FormControl
  }

  get terminatedOnFromControl (): FormControl {
    return this.form.get('terminatedOnFrom') as FormControl
  }

  get terminatedOnUntilControl (): FormControl {
    return this.form.get('terminatedOnUntil') as FormControl
  }

}
