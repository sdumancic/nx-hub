import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EmployeeOverviewQuickFilter,
  EmployeeOverviewQuickFilterComponent,
} from '../quick-filter/employee-overview-quick-filter/employee-overview-quick-filter.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { Tabs } from '../../../facade/tabs.enum';

@Component({
  selector: 'hub-employee-overview-navigator',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeOverviewQuickFilterComponent,
    MatTabsModule,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './employee-overview-navigator.component.html',
  styleUrls: ['./employee-overview-navigator.component.scss'],
})
export class EmployeeOverviewNavigatorComponent {
  @Input() activeFiltersCount$: Observable<number>;
  @Input() activeTab: Tabs;
  @Output() openSideBarFilters = new EventEmitter<Tabs>();
  @Output() resetFilter = new EventEmitter<Tabs>();
  @Output() search = new EventEmitter<EmployeeOverviewQuickFilter>();

  onOpenSidebarFilters(tabIndex: number) {
    this.openSideBarFilters.emit(tabIndex);
  }

  onSearchFromQuickFilters(formGroupValues: EmployeeOverviewQuickFilter) {
    this.search.emit(formGroupValues);
  }

  onResetFromSidebarFilters(tab: Tabs) {
    this.resetFilter.emit(tab);
  }
}
