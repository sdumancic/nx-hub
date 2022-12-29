import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from "@angular/router";
import { FOOD_ADMIN_ROUTES } from "./food-admin.routes";

@Component({
  selector: 'hub-food-admin-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './food-admin-home.component.html',
  styleUrls: ['./food-admin-home.component.scss'],
})
export class FoodAdminHomeComponent {}
