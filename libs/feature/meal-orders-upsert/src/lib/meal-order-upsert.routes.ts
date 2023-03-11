import { Route } from '@angular/router';
import { FeatureMealOrdersUpsertComponent } from "./container/feature-meal-orders-upsert.component";

export const mealOrderUpsertRoutes: Route[] = [
  { path: '', redirectTo: 'new', pathMatch:'full' },
  { path: 'new', component: FeatureMealOrdersUpsertComponent },
  { path: ':1', component: FeatureMealOrdersUpsertComponent },
];
