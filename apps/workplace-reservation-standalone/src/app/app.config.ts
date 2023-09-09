import { ApplicationConfig } from '@angular/core';
import { environment } from '../environments/environment';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GOOGLE_MAPS_API_KEY, WORKPLACE_RESERVATION_API_BACKEND_URL } from "@hub/shared/util/app-config";
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: WORKPLACE_RESERVATION_API_BACKEND_URL,
      useValue: environment.workplaceReservationApi,
    },
    { provide: GOOGLE_MAPS_API_KEY, useValue: environment.googleMapsApiKey },
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/
    ),
    provideHttpClient(withJsonpSupport()),
    importProvidersFrom(BrowserAnimationsModule, LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
    }),),
  ],
};
