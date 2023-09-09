import { Component, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeOverviewNavigatorComponent } from '../../presentation/employees-overview/navigator/employee-overview-navigator.component';
import {
  EMPLOYEE_OVERVIEW_SIDEBAR_FILTERS_DIALOG,
  EmployeeOverviewSidebarFilterComponent,
} from '../../presentation/employees-overview/sidebar-filter/employee-overview-sidebar-filter/employee-overview-sidebar-filter.component';
import { takeUntil } from 'rxjs/operators';
import { endWith, Observable } from 'rxjs';
import { materialModules } from '@hub/shared/ui/material';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeOverviewQuickFilter } from '../../presentation/employees-overview/quick-filter/employee-overview-quick-filter/employee-overview-quick-filter.component';

@Component({
  selector: 'hub-checkins-overview',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeOverviewNavigatorComponent,
    ...materialModules,
  ],
  templateUrl: './checkins-overview.component.html',
  styleUrls: ['./checkins-overview.component.scss'],
  providers: [],
})
export class CheckinsOverviewComponent {
  sidebarPinned$: Observable<boolean>;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  onOpenSidebarFilters(tabIndex: number): void {
    if (
      this.matDialog.getDialogById(EMPLOYEE_OVERVIEW_SIDEBAR_FILTERS_DIALOG)
    ) {
      return;
    }

    const dialogRef = this.matDialog.open(
      EmployeeOverviewSidebarFilterComponent,
      {
        id: EMPLOYEE_OVERVIEW_SIDEBAR_FILTERS_DIALOG,
        viewContainerRef: this.viewContainerRef,
        hasBackdrop: false,
        autoFocus: false,
        position: { right: '0px', top: '0px' },
        panelClass: 'overview__sidebar-filters-dialog',
      }
    );

    this.sidebarPinned$ = dialogRef.componentInstance.sidebarPinned$.pipe(
      takeUntil(dialogRef.afterClosed()),
      endWith(false)
    );
  }

  onSearchFromQuickFilters(value: EmployeeOverviewQuickFilter) {
    console.log('search from quick filters', value);
  }
}
