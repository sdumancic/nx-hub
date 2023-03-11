import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { WORKPLACE_RESERVATION_API_BACKEND_URL, GOOGLE_MAPS_API_KEY } from "@hub/shared/util/app-config";
import { provideHttpClient, withJsonpSupport } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_ROUTES } from "./app/app.routes";
import { environment } from "./environments/environment";

bootstrapApplication(AppComponent, {
  providers: [
    {provide: WORKPLACE_RESERVATION_API_BACKEND_URL, useValue: environment.workplaceReservationApi},
    {provide: GOOGLE_MAPS_API_KEY, useValue: environment.googleMapsApiKey},
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withEnabledBlockingInitialNavigation() /*, withDebugTracing()*/
    ),
    provideHttpClient(withJsonpSupport()),
    importProvidersFrom(BrowserAnimationsModule),
  ],
}).catch((err) => console.error(err));
