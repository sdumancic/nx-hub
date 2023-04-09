import { Route } from '@angular/router';
import { FoodAdminHomeComponent } from './food-admin-home/food-admin-home.component';

export const APP_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'shell' },
  {
    path: 'shell',
    component: FoodAdminHomeComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('@hub/shared/feature/auth').then(mod => mod.LoginComponent)
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
      },
      {
        path: 'orders/overview',
        canLoad: ['regularUserAuthGuard'],
        canActivate: ['regularUserAuthGuard'],
        loadChildren: () => import('@hub/feature/meal-orders-overview').then((mod) => mod.mealOverviewRoutes),
      },
      {
        path: 'orders/edit',
        canLoad: ['adminUserAuthGuard'],
        canActivate: ['adminUserAuthGuard'],
        loadChildren: () => import('@hub/feature/meal-orders-upsert').then((mod) => mod.mealOrderUpsertRoutes),
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
    loadComponent: () => import('@hub/shared/feature/auth').then(mod => mod.LoginComponent)
  },
  {
    path: 'testlib',
    loadChildren: () =>
      import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
  },
];
