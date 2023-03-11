import { Route } from '@angular/router';
import { FeatureAddressOverviewComponent } from './feature-address-overview/feature-address-overview.component';


export const addressOverviewRoutes: Route[] = [
  { path: 'overview', component: FeatureAddressOverviewComponent },
  { path: 'add', component: FeatureAddressOverviewComponent },
  { path: 'update/:id', component: FeatureAddressOverviewComponent },
];

