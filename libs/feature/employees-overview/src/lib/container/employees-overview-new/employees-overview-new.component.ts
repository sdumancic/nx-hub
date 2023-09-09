import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from '@hub/shared/ui/material';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeOverviewTableComponent } from '../../presentation/employees-overview/table/employee-overview-table/employee-overview-table.component';
import { EmployeeOverviewQuickFilterComponent } from '../../presentation/employees-overview/quick-filter/employee-overview-quick-filter/employee-overview-quick-filter.component';
import { EmployeeOverviewHeaderComponent } from '../../presentation/employees-overview/header/employee-overview-header/employee-overview-header.component';
import { OverviewQuery } from '../../business/employees-overview/overview.query';
import { EmployeesOverviewQuery } from '../../business/employees-overview/employees-overview.query';
import { EmployeesOverviewBusiness } from '../../business/employees-overview/employees-overview-business.service';
import { EmployeeOverviewForm } from '../../presentation/employees-overview/form/employee-overview-form.service';
import { EmployeeOverviewFacade } from '../../facade/employees-overview/employee-overview-facade.service';
import { EmployeeOverviewStateService } from '../../facade/employees-overview/state/employee-overview-state.service';
import { EmployeeOverviewFiltersService } from '../../facade/employee-overview-filters.service';
import { OverviewUrlParamsService } from '../../facade/employees-overview/url-params/overview-url-params.service';
import { endWith, Observable, Subject, take } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchMeta } from '../../data-access/standard.model';
import {
  ActivatedRoute,
  Params,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  EMPLOYEE_OVERVIEW_SIDEBAR_FILTERS_DIALOG,
  EmployeeOverviewSidebarFilterComponent,
} from '../../presentation/employees-overview/sidebar-filter/employee-overview-sidebar-filter/employee-overview-sidebar-filter.component';
import { takeUntil } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { EmployeeOverviewSearchResultUi } from '../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model';
import { EmployeeOverviewSearchUi } from '../../presentation/employees-overview/form/employee-overview-search.ui.model';
import { EmployeeOverviewNavigatorComponent } from '../../presentation/employees-overview/navigator/employee-overview-navigator.component';
import { Tabs } from '../../facade/tabs.enum';
import {
  EmployeeOverviewQuickFilter,
  EmployeeOverviewQuickFilterForm,
} from '../../presentation/employees-overview/quick-filter/employee-overview-quick-filter/employee-overview-quick-filter-form.service';

@Component({
  selector: 'hub-employees-overview-new',
  standalone: true,
  imports: [
    ...materialModules,
    CommonModule,
    ReactiveFormsModule,
    EmployeeOverviewTableComponent,
    EmployeeOverviewQuickFilterComponent,
    EmployeeOverviewHeaderComponent,
    RouterLinkActive,
    RouterLink,
    EmployeeOverviewNavigatorComponent,
  ],
  templateUrl: './employees-overview-new.component.html',
  styleUrls: ['./employees-overview-new.component.scss'],
  providers: [
    { provide: OverviewQuery, useClass: EmployeesOverviewQuery },
    EmployeesOverviewBusiness,
    EmployeeOverviewForm,
    EmployeeOverviewFacade,
    EmployeeOverviewStateService,
    EmployeeOverviewFiltersService,
    OverviewUrlParamsService,
    EmployeeOverviewQuickFilterForm,
  ],
})
export class EmployeesOverviewNewComponent implements OnInit, OnDestroy {
  sidebarPinned$: Observable<boolean>;
  activeTab: Tabs = Tabs.EMPLOYEE_OVERVIEW;
  sidebarDialogRef: MatDialogRef<any>;
  searchCount$: Observable<number>;
  searchMeta$: Observable<SearchMeta>;
  activeFiltersCount$: Observable<number>;
  unsubscribeFromQueryParamChanges$ = new Subject<void>();
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly matDialog: MatDialog,
    private readonly viewContainerRef: ViewContainerRef,
    private route: ActivatedRoute,
    private employeeOverviewForm: EmployeeOverviewForm,
    private employeeOverviewFacade: EmployeeOverviewFacade,
    private filtersService: EmployeeOverviewFiltersService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly quickFilterForm: EmployeeOverviewQuickFilterForm
  ) {
    this.searchCount$ = this.employeeOverviewFacade.searchCount$;
    this.searchMeta$ = this.employeeOverviewFacade.searchMeta$;
    this.activeFiltersCount$ = this.filtersService.activeFiltersCount$;
  }

  @HostListener('click') onContainerClick(): void {
    this.filtersService.nextContainerClick();
  }

  ngOnInit(): void {
    this.employeeOverviewFacade
      .refreshMetadata$()
      .pipe(take(1))
      .subscribe(() => {
        this.setActiveTab(Tabs.EMPLOYEE_OVERVIEW);
        this.subscribeToQueryParamChanges();
        this.setInitialQueryParams(this.route.snapshot.queryParams);
        this.setSearchUiFromQueryParams(this.route.snapshot.queryParams);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onOpenSidebarFilters(tab: Tabs) {
    console.log('opening sidebar for tab ', tab);
    if (tab !== Tabs.EMPLOYEE_OVERVIEW) {
      return;
    }
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

    dialogRef.componentInstance.resetEmitted
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe(() => {
        this.onReset(Tabs.EMPLOYEE_OVERVIEW);
      });

    this.sidebarPinned$ = dialogRef.componentInstance.sidebarPinned$.pipe(
      takeUntil(dialogRef.afterClosed()),
      endWith(false)
    );
  }

  onSearch(retainPagination = false) {
    this.unsubscribeFromQueryParamChanges$.next();
    this.employeeOverviewFacade.search(
      this.employeeOverviewForm.formGroupRawValue,
      retainPagination
    );
    this.subscribeToQueryParamChanges();
  }

  onReset(tab: Tabs) {
    console.log('on reset from tab', tab);
    if (tab !== Tabs.EMPLOYEE_OVERVIEW) {
      return;
    }
    this.employeeOverviewForm.formGroup.reset({ emitEvent: false });
    this.onSearch();
  }

  onSort(event: Sort): void {
    this.employeeOverviewFacade.sort(event.active, event.direction);
    this.onSearch(true);
  }

  onPaginate(event: PageEvent): void {
    this.employeeOverviewFacade.paginate(event.pageIndex, event.pageSize);
    this.onSearch(true);
  }

  onSelectionChange(event: EmployeeOverviewSearchResultUi[]): void {
    this.cdRef.detectChanges();
  }

  onCreateNewEmployee() {
    this.employeeOverviewFacade.refreshMetadata$().pipe(take(1)).subscribe();
  }

  private subscribeToQueryParamChanges(): void {
    this.employeeOverviewFacade
      .urlChanged$()
      .pipe(takeUntil(this.unsubscribeFromQueryParamChanges$))
      .subscribe((queryParams: Params) => {
        this.setSearchUiFromQueryParams(queryParams);
      });
  }

  private setFormValues(searchValues: EmployeeOverviewSearchUi) {
    this.employeeOverviewForm.formGroup.patchValue(searchValues, {
      emitEvent: false,
    });
    this.quickFilterForm.setFormValue(
      this.employeeOverviewFacade.extractQuickFilterPart(searchValues)
    );
  }

  private async initDefaultStateAndSearch(): Promise<void> {
    if (this.sidebarDialogRef !== undefined) {
      this.sidebarDialogRef.close();
    }
  }

  private setActiveTab(tab: Tabs): void {
    this.activeTab = tab;
  }

  private setInitialQueryParams(queryParams: Params) {
    this.employeeOverviewFacade.mergeSetUrl(queryParams);
  }

  private setSearchUiFromQueryParams(queryParams: Params) {
    const searchValues =
      this.employeeOverviewFacade.extractSearchValuesFromQueryParams(
        queryParams
      );
    const searchMeta =
      this.employeeOverviewFacade.extractSearchMetaFromQueryParams(queryParams);

    this.setFormValues(searchValues);
    this.employeeOverviewFacade.updateStateFromSearchUiAndSearchMeta(
      searchValues,
      searchMeta
    );
  }

  onSearchFromQuickFilters(value: EmployeeOverviewQuickFilter) {
    this.employeeOverviewForm.formGroup.patchValue(value);
    this.onSearch(false);
  }
}
