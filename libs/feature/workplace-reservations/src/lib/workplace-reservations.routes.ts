import { Route } from '@angular/router';
import { FeatureWorkplaceReservationsComponent } from './feature-workplace-reservations/feature-workplace-reservations.component';



export const workplaceReservationsRoutes: Route[] = [
  { path: 'overview', component: FeatureWorkplaceReservationsComponent },
  { path: 'booking', component: FeatureWorkplaceReservationsComponent },
  { path: 'seat-reservations', component: FeatureWorkplaceReservationsComponent },
];
