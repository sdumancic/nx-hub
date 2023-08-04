import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  WORKPLACE_RESERVATION_API_BACKEND_URL,
  GOOGLE_MAPS_API_KEY,
} from '@hub/shared/util/app-config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
