import { Route } from '@angular/router';
import { EmployeesOverviewContainerComponent } from "./container/employees-overview/employees-overview-container.component";


export const employeesOverviewRoutes: Route[] = [
  { path: 'overview', component: EmployeesOverviewContainerComponent },
];
