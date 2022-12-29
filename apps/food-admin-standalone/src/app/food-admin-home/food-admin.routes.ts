import { Route } from '@angular/router';

export const FOOD_ADMIN_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  {
    path: 'landing',
    loadChildren: () =>
      import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@hub/shared/testlib').then((mod) => mod.sharedTestlibRoutes),
  },
];
