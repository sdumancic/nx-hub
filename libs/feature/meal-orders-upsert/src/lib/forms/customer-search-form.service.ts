import { Injectable } from "@angular/core";
import { Form, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomerFormUi } from "./customer-form-ui.interface";


export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};
@Injectable()
export class CustomerSearchFormService{

  private form: FormGroup;

  public createFormGroup(): FormGroup {
    this.form = new FormGroup<ControlsOf<CustomerFormUi>>({
      id: new FormControl<number>(null, ),
      firstName: new FormControl<string>('', {validators:[Validators.required]}),
      lastName: new FormControl<string>('',{validators:[Validators.required]}),
      city: new FormControl<string>('',{validators:[Validators.required]}),
      address: new FormControl<string>('',{validators:[Validators.required]}),
      latitude: new FormControl<number>(null, {updateOn: 'blur',validators:[Validators.required]}),
      longitude: new FormControl<number>(null, {updateOn: 'blur',validators:[Validators.required]})
    });
    return this.form;
  }

  public disableFormControls() {
    this.firstNameControl.disable();
    this.lastNameControl.disable();
    this.addressControl.disable();
    this.cityControl.disable();
    this.latitudeControl.disable();
    this.longitudeControl.disable();
  }
  public enableFormControls() {
    this.firstNameControl.enable();
    this.lastNameControl.enable();
    this.addressControl.enable();
    this.cityControl.enable();
    this.latitudeControl.enable();
    this.longitudeControl.enable();
  }
  public setValue(value: Partial<CustomerFormUi>){
    this.form.patchValue(value);
  }
  public resetValue(){
    this.form.reset();
  }

  get formGroupRawValue (): CustomerFormUi {
    return { ...(this.form.getRawValue() as CustomerFormUi) }
  }

  get firstNameControl(): FormControl {
    return this.form.get('firstName') as FormControl;
  }
  get lastNameControl(): FormControl {
    return this.form.get('lastName') as FormControl;
  }
  get cityControl(): FormControl {
    return this.form.get('city') as FormControl;
  }
  get addressControl(): FormControl {
    return this.form.get('address') as FormControl;
  }

  get latitudeControl(): FormControl {
    return this.form.get('latitude') as FormControl;
  }
  get longitudeControl(): FormControl {
    return this.form.get('longitude') as FormControl;
  }
  get idControl(): FormControl {
    return this.form.get('id') as FormControl;
  }

}


