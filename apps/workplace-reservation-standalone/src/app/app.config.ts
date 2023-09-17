import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { environment } from '../environments/environment';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  GOOGLE_MAPS_API_KEY,
  WORKPLACE_RESERVATION_API_BACKEND_URL,
} from '@hub/shared/util/app-config';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { employeeOverviewComponentStateReducer } from '@hub/feature/employees-overview';

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
    importProvidersFrom(
      BrowserAnimationsModule,
      LoggerModule.forRoot({
        level: NgxLoggerLevel.TRACE,
      }),
      StoreModule.forRoot({
        componentState: employeeOverviewComponentStateReducer,
      }),
      StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: true, // Restrict extension to log-only mode
      })
    ),
  ],
};
