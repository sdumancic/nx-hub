import { ApplicationConfig } from '@angular/core';
import {
  AuthService,
  JwtInterceptor,
  LocalStorageService,
} from '@hub/shared/feature/auth';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  provideRouter,
  Router,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { APP_ROUTES } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withJsonpSupport,
} from '@angular/common/http';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from "../environments/environment";
import { CUSTOM_DATE_FORMATS, FOOD_API_BACKEND_URL, GOOGLE_MAPS_API_KEY } from "@hub/shared/util/app-config";
import { AdminUserAuthGuard, RegularUserAuthGuard } from "../main";
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: FOOD_API_BACKEND_URL, useValue: environment.foodApi },
    { provide: GOOGLE_MAPS_API_KEY, useValue: environment.googleMapsApiKey },
    { provide: MAT_DATE_LOCALE, useValue: environment.locale },
    { provide: LOCALE_ID, useValue: environment.locale },
    LocalStorageService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { strict: true } },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    {
      provide: 'adminUserAuthGuard',
      useFactory: AdminUserAuthGuard,
      deps: [AuthService, Router],
    },
    {
      provide: 'regularUserAuthGuard',
      useFactory: RegularUserAuthGuard,
      deps: [AuthService, Router],
    },
    { provide: AuthService, useClass: AuthService },
    provideRouter(
      APP_ROUTES,
      withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/
    ),
    provideHttpClient(withJsonpSupport(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    importProvidersFrom(BrowserAnimationsModule),
  ],
};
