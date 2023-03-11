import { Route } from '@angular/router';
import { WorkplaceReservationHomeComponent } from "./workplace-reservation-home/workplace-reservation-home.component";

export const APP_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'shell' },
  {
    path: 'shell',
    component: WorkplaceReservationHomeComponent,
    children: [
      {
        path: 'address',
        loadChildren: () =>
          import('@hub/feature/address-overview').then((mod) => mod.addressOverviewRoutes),
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('@hub/feature/employees-overview').then((mod) => mod.employeesOverviewRoutes),
      },
      {
        path: 'locations',
        loadChildren: () =>
          import('@hub/feature/locations-overview').then((mod) => mod.locationsOverviewRoutes),
      },
      {
        path: 'offices',
        loadChildren: () =>
          import('@hub/feature/office-overview').then((mod) => mod.officesOverviewRoutes),
      },
      {
        path: 'reservations',
        loadChildren: () =>
          import('@hub/feature/workplace-reservations').then((mod) => mod.workplaceReservationsRoutes),
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('@hub/feature/food-login').then(mod => mod.FeatureFoodLoginComponent)
  },
];
