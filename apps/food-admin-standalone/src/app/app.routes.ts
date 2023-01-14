import { Route } from '@angular/router';
import { FoodAdminHomeComponent } from './food-admin-home/food-admin-home.component';
import { FeatureFoodLoginComponent } from "@hub/feature/food-login";

export const APP_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'shell' },
  {
    path: 'shell',
    component: FoodAdminHomeComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
      },
      {
        path: 'meals',
        loadChildren: () =>
          import('@hub/feature/meal-orders-overview').then((mod) => mod.mealOverviewRoutes),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
      }
    ]

  },
  {
    path: 'login',
    loadComponent: () => import('@hub/feature/food-login').then(mod => mod.FeatureFoodLoginComponent)
  },
  {
    path: 'testlib',
    loadChildren: () =>
      import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
  },
];
