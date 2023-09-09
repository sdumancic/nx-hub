import { Route } from '@angular/router';
import { EmployeesOverviewNewComponent } from './container/employees-overview-new/employees-overview-new.component';
import { EmployeesOverviewDashboardComponent } from './container/employees-overview-dashboard/employees-overview-dashboard.component';
import { CheckinsOverviewComponent } from './container/checkins-overview/checkins-overview.component';

export const employeesOverviewRoutes: Route[] = [
  {
    path: 'overview',
    component: EmployeesOverviewDashboardComponent,
    children: [
      {
        path: 'employees',
        component: EmployeesOverviewNewComponent,
      },
      {
        path: 'checkins',
        component: CheckinsOverviewComponent,
      },
    ],
  },
  {
    path: 'overview',
    pathMatch: 'full',
    redirectTo: 'overview/employees',
  },
];
