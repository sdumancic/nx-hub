import { InjectionToken } from '@angular/core';
import { MatDateFormats } from "@angular/material/core";

export const FOOD_API_BACKEND_URL =  new InjectionToken(
  'FOOD_API_BACKEND_URL'
);

export const WORKPLACE_RESERVATION_API_BACKEND_URL =  new InjectionToken(
  'WORKPLACE_RESERVATION_API_BACKEND_URL'
);

export const GOOGLE_MAPS_API_KEY = new InjectionToken('GOOGLE_MAPS_API_KEY')


export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD.MM.YYYY'
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM-YYYY'
  }
};
