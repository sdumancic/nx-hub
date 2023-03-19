import { Inject, Injectable, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';

import {
  Categories,
  Category, IMealOrdersMetadata,
  PagedMeals,
  PagedOrders, PagedToppings,
  Topping
} from "@hub/shared/model/food-models";
import { FOOD_API_BACKEND_URL } from '@hub/shared/util/app-config';
import { FormControl, FormGroup } from "@angular/forms";


export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};
export interface CustomerForm{
  firstName: string;
  lastName: string;
  city:string;
  address: string;
  latitude: number;
  longitude: number;
}
@Injectable()
export class CustomerSearchFormService{

  form: FormGroup

  constructor() {
    this.form = new FormGroup<ControlsOf<CustomerForm>>({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      city: new FormControl(''),
      address: new FormControl(''),
      latitude: new FormControl(null),
      longitude: new FormControl(null)
    });
  }

}
