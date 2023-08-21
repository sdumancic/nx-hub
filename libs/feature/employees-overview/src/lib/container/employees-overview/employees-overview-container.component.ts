import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmployeesOverviewQuery } from "../../business/employees-overview/employees-overview.query";
import { EmployeesOverviewBusiness } from "../../business/employees-overview/employees-overview-business.service";
import { OverviewQuery } from "../../business/employees-overview/overview.query";
import { EmployeeOverviewForm } from "../../presentation/employees-overview/form/employee-overview-form.service";
import {
  EmployeeOverviewHeaderComponent
} from "../../presentation/employees-overview/header/employee-overview-header/employee-overview-header.component";
import { materialModules } from "@hub/shared/ui/material";
import { ReactiveFormsModule } from "@angular/forms";
import {
  EmployeeOverviewQuickFilterComponent
} from "../../presentation/employees-overview/quick-filter/employee-overview-quick-filter/employee-overview-quick-filter.component";
import {
  EmployeeOverviewTableComponent
} from "../../presentation/employees-overview/table/employee-overview-table/employee-overview-table.component";
import { endWith, Observable, Subject, take } from "rxjs";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { EmployeeOverviewSearchUi } from "../../presentation/employees-overview/form/employee-overview-search.ui.model";
import { EmployeeOverviewFacade } from "../../facade/employees-overview/employee-overview-facade.service";
import { EmployeeOverviewStateService } from "../../facade/employees-overview/state/employee-overview-state.service";
import { OverviewUrlParamsService } from "../../facade/employees-overview/url-params/overview-url-params.service";
import { EmployeeOverviewMapper } from "../../facade/employees-overview/employee-overview.mapper";
import { takeUntil } from "rxjs/operators";
import {
  EMPLOYEE_OVERVIEW_SIDEBAR_FILTERS_DIALOG,
  EmployeeOverviewSidebarFilterComponent
} from "../../presentation/employees-overview/sidebar-filter/employee-overview-sidebar-filter/employee-overview-sidebar-filter.component";
import { EmployeeOverviewFiltersService } from "../../facade/employee-overview-filters.service";
import { Sort } from "@angular/material/sort";
import { PageEvent } from "@angular/material/paginator";
import {
  EmployeeOverviewSearchResultUi
} from "../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model";
import { SearchMeta } from "../../data-access/standard.model";

@Component({
  selector: "hub-feature-employees-overview",
  standalone: true,
  imports: [...materialModules, CommonModule, ReactiveFormsModule, EmployeeOverviewTableComponent, EmployeeOverviewQuickFilterComponent, EmployeeOverviewHeaderComponent
  ],
  templateUrl: "./employees-overview-container.component.html",
  styleUrls: ["./employees-overview-container.component.scss"],
  providers: [
    { provide: OverviewQuery, useClass: EmployeesOverviewQuery },
    EmployeesOverviewBusiness,
    EmployeeOverviewForm,
    EmployeeOverviewFacade,
    EmployeeOverviewStateService,
    EmployeeOverviewFiltersService,
    OverviewUrlParamsService
  ]
})
export class EmployeesOverviewContainerComponent implements OnInit, OnDestroy {
  sidebarPinned$: Observable<boolean>;
  activeTabIndex = 0;
  sidebarDialogRef: MatDialogRef<any>;
  searchCount$: Observable<number>
  searchMeta$: Observable<SearchMeta>

  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly matDialog: MatDialog,
    private readonly viewContainerRef: ViewContainerRef,
    private route: ActivatedRoute,
    private employeeOverviewForm: EmployeeOverviewForm,
    private employeeOverviewFacade: EmployeeOverviewFacade,
    private filtersService: EmployeeOverviewFiltersService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.searchCount$ = this.employeeOverviewFacade.searchCount$;
    this.searchMeta$ = this.employeeOverviewFacade.searchMeta$
  }

  @HostListener("click") onContainerClick(): void {
    this.filtersService.nextContainerClick();
  }

  ngOnInit(): void {
    const queryParamsMap: ParamMap = this.route.snapshot.queryParamMap;
    if (queryParamsMap.keys.length == 0) {
      this.setDefaultFilterValuesAndSearch();
    } else {
      this.setFilterValuesAndSearch(this.route.snapshot.queryParamMap);
    }
    this.subscribeToQueryParamChanges();
  }

  async tabChanged(event: MatTabChangeEvent): Promise<void> {
    this.activeTabIndex = event.index;
    this.setActiveTab(event.index);
    await this.initDefaultStateAndSearch();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onOpenSidebarFilters(tabIndex: number) {
    if (
      this.matDialog.getDialogById(
        EMPLOYEE_OVERVIEW_SIDEBAR_FILTERS_DIALOG
      )
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
        position: { right: "0px", top: "0px" },
        panelClass: "overview__sidebar-filters-dialog"
      }
    );

    this.sidebarPinned$ = dialogRef.componentInstance.sidebarPinned$.pipe(
      takeUntil(dialogRef.afterClosed()),
      endWith(false)
    );
  }

  onSearch() {
    this.employeeOverviewFacade.search(this.employeeOverviewForm.formGroupRawValue);
  }

  onReset() {
    this.employeeOverviewForm.formGroup.reset({ emitEvent: false });
    this.onSearch();
  }

  onSort (event: Sort): void {
    this.employeeOverviewFacade.sort(event.active, event.direction)
  }

  onPaginate (event: PageEvent): void {
    this.employeeOverviewFacade.paginate(event.pageIndex, event.pageSize)
  }

  onSelectionChange (event: EmployeeOverviewSearchResultUi[]): void {
    this.cdRef.detectChanges()
  }


  private subscribeToQueryParamChanges(): void {
    this.employeeOverviewFacade
      .listenSearchValuesFromQueryParams()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchValues: EmployeeOverviewSearchUi) => {
        this.setFormValues(searchValues);
      });
  }

  private setDefaultFilterValuesAndSearch() {
    this.employeeOverviewFacade.getDefaultSearchValues$()
      .pipe(take(1))
      .subscribe((defaultValues: EmployeeOverviewSearchUi) => {
        this.setFormValues(defaultValues);
        this.employeeOverviewFacade.search(defaultValues);
      });
  }

  private setFilterValuesAndSearch(queryParamMap: ParamMap) {
    this.employeeOverviewFacade.extractSearchValues$(EmployeeOverviewMapper.fromQueryMapToOverviewQueryParams(queryParamMap))
      .pipe(take(1))
      .subscribe((filterValues: EmployeeOverviewSearchUi) => {
        this.setFormValues(filterValues);
        this.employeeOverviewFacade.search(filterValues);
      });

  }

  private setFormValues(searchValues: EmployeeOverviewSearchUi) {
    this.employeeOverviewForm.formGroup.patchValue(searchValues, {
      emitEvent: false
    });
  }

  private async initDefaultStateAndSearch(): Promise<void> {
    if (this.sidebarDialogRef !== undefined) {
      this.sidebarDialogRef.close();
    }
  }

  private setActiveTab(ind: number): void {
    this.activeTabIndex = ind;
  }
}
