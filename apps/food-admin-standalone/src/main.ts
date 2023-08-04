import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import localeHr from '@angular/common/locales/hr';
import { AppComponent } from './app/app.component';


import { registerLocaleData } from '@angular/common';
import { AuthGuard, AuthService } from "@hub/shared/feature/auth";
import { Router } from "@angular/router";

registerLocaleData(localeHr);

export function AdminUserAuthGuard(authService: AuthService, router: Router) {
  return new AuthGuard(true, authService, router);
}

export function RegularUserAuthGuard(authService: AuthService, router: Router) {
  return new AuthGuard(false, authService, router);
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);


