import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SharedUiNavigatorComponent } from '@hub/shared/ui/navigator';
import { environment } from "../../environments/environment";

@Component({
  selector: 'hub-food-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLinkWithHref,
    SharedUiNavigatorComponent,
  ],

  templateUrl: './food-admin-home.component.html',
  styleUrls: ['./food-admin-home.component.scss'],
})
export class FoodAdminHomeComponent {

  url: string
  constructor() {
    this.url = environment.foodApi
  }
  menuItems = [
    {
      name: 'Dashboard',
      icon: 'bx-grid-alt',
      routerLink: 'dashboard',
    },
    {
      name: 'Category',
      icon: 'bx-collection',
      children: [
        { name: 'Overview', routerLink: 'categories/overview' },
        { name: 'Edit', routerLink: 'categories/overview' },
      ],
    },
    {
      name: 'Meals',
      icon: 'bx-book-alt',
      children: [
        { name: 'Overview', routerLink: 'meals/overview' },
        { name: 'Edit', routerLink: 'meals/edit' },
        { name: 'Manage toppings', routerLink: 'meals/toppings' },
      ],
    },
    {
      name: 'Toppings',
      icon: 'bx-book-alt',
      children: [
        { name: 'Overview', routerLink: 'toppings/overview' },
        { name: 'Edit', routerLink: 'toppings/edit' },
      ],
    },
    {
      name: 'Orders',
      icon: 'bx-pie-chart-alt-2',
      children: [
        { name: 'Overview', routerLink: 'orders/overview' },
        { name: 'Edit', routerLink: 'orders/edit' },
        { name: 'Manage', routerLink: 'orders/manage' },
      ],
    },
  ];

  onLogout() {
    console.log('logout')
  }
}
