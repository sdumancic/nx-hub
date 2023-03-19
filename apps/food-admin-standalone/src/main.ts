import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withEnabledBlockingInitialNavigation } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { APP_ROUTES } from "./app/app.routes";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { importProvidersFrom, LOCALE_ID } from "@angular/core";
import { environment } from "./environments/environment";
import { CUSTOM_DATE_FORMATS, FOOD_API_BACKEND_URL, GOOGLE_MAPS_API_KEY } from "@hub/shared/util/app-config";
import { provideHttpClient, withJsonpSupport } from "@angular/common/http";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { registerLocaleData } from '@angular/common';
import localeHr from '@angular/common/locales/hr';
registerLocaleData(localeHr);


bootstrapApplication(AppComponent, {
  providers: [
    {provide: FOOD_API_BACKEND_URL, useValue: environment.foodApi},
    {provide: GOOGLE_MAPS_API_KEY, useValue: environment.googleMapsApiKey},
    {provide: MAT_DATE_LOCALE, useValue: environment.locale},
    {provide: LOCALE_ID, useValue: environment.locale},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {strict: true}},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/
    ),
    provideHttpClient(withJsonpSupport()),
    importProvidersFrom(BrowserAnimationsModule)
  ],
}).catch((err) => console.error(err));
