import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'hub-employees-overview-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './employees-overview-dashboard.component.html',
  styleUrls: ['./employees-overview-dashboard.component.scss'],
})
export class EmployeesOverviewDashboardComponent {}
