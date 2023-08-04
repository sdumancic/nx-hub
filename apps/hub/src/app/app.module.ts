import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { SharedFeatureAuthComponent } from "@hub/shared/feature/auth";

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [BrowserModule, SharedFeatureAuthComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
