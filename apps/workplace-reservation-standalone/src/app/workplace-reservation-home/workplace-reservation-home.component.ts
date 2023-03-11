import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiNavigatorComponent } from "@hub/shared/ui/navigator";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'hub-workplace-reservation-home',
  standalone: true,
  imports: [CommonModule, SharedUiNavigatorComponent, RouterOutlet],
  templateUrl: './workplace-reservation-home.component.html',
  styleUrls: ['./workplace-reservation-home.component.scss'],
})
export class WorkplaceReservationHomeComponent {

  menuItems = [
    {
      name: 'Administration',
      icon: 'bx-collection',
      children: [
        { name: 'Addresses', routerLink: 'address/overview' },
        { name: 'Employees', routerLink: 'employees/overview' },
        { name: 'Locations', routerLink: 'locations/overview' },
        { name: 'Offices', routerLink: 'offices/overview' },
      ],
    },
    {
      name: 'Reservations',
      icon: 'bx-book-alt',
      children: [
        { name: 'Overview', routerLink: 'reservations/overview' },
        { name: 'Booking', routerLink: 'reservations/booking' },
        { name: 'Seat availability', routerLink: 'reservations/seat-availability' },
      ],
    },
  ];

  onLogout() {
    console.log('logout');
  }
}
