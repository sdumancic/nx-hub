import { Route } from '@angular/router';
import { FeatureEmployeesOverviewComponent } from "./feature-employees-overview/feature-employees-overview.component";


export const employeesOverviewRoutes: Route[] = [
  { path: 'overview', component: FeatureEmployeesOverviewComponent },
];
