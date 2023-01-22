import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IMealOrdersOverviewSearchUi } from './meal-orders-overview-search.ui.model';

@Injectable()
export class OrdersOverviewFormService {
  private form: FormGroup;

  get formGroup(): FormGroup {
    return this.form;
  }

  get formGroupRawValue(): IMealOrdersOverviewSearchUi {
    return { ...(this.form.getRawValue() as IMealOrdersOverviewSearchUi) };
  }

  get searchValue(): string {
    return this.form.get('search')?.value;
  }

  constructor() {
    this.createFormGroup();
  }

  resetValue(value: IMealOrdersOverviewSearchUi): void {
    this.form.reset(value, { emitEvent: false });
  }

  private createFormGroup(): void {
    this.form = new FormGroup({
      search: new FormControl(null, { updateOn: 'blur' }),
      category: new FormControl(null, { updateOn: 'blur' }),
      topping: new FormControl(null, { updateOn: 'blur' }),
      datePlacedFrom: new FormControl(null, { updateOn: 'blur' }),
      datePlacedTo: new FormControl(null, { updateOn: 'blur' }),
      dateDispatchedFrom: new FormControl(null, { updateOn: 'blur' }),
      dateDispatchedTo: new FormControl(null, { updateOn: 'blur' }),
      dateCompletedFrom: new FormControl(null, { updateOn: 'blur' }),
      dateCompletedTo: new FormControl(null, { updateOn: 'blur' }),
      orderTotalFrom: new FormControl(null, { updateOn: 'blur' }),
      orderTotalTo: new FormControl(null, { updateOn: 'blur' }),
      dateCreatedFrom: new FormControl(null, { updateOn: 'blur' }),
      dateCreatedTo: new FormControl(null, { updateOn: 'blur' }),
      deliveryCity: new FormControl(null, { updateOn: 'blur' }),
      deliveryAddress: new FormControl(null, { updateOn: 'blur' }),
    });
  }

  get searchControl(): FormControl {
    return this.form.get('search') as FormControl;
  }

  get datePlacedFromControl(): FormControl {
    return this.form.get('datePlacedFrom') as FormControl;
  }

  get datePlacedToControl(): FormControl {
    return this.form.get('datePlacedTo') as FormControl;
  }
}
