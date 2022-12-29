import { Route } from '@angular/router';
import { FoodAdminHomeComponent } from './food-admin-home/food-admin-home.component';

export const APP_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'shell' },
  {
    path: 'shell',
    loadChildren: () =>
      import('./food-admin-home/food-admin.routes').then(
        (mod) => mod.FOOD_ADMIN_ROUTES
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
  },
];
