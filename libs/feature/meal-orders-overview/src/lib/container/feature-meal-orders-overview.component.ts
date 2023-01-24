import { Component, HostListener, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { materialModules } from "../material";
import { MealOrdersOverviewFacadeService } from "../facade/meal-orders-overview-facade.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { endWith, Observable, Subject, takeUntil } from "rxjs";
import { Sort } from "@angular/material/sort";
import { PageEvent } from "@angular/material/paginator";
import { PartOrdersOverviewTabs } from "../presentation/order-overview-tabs";
import { OrdersOverviewFormService } from "../forms/orders-overview-form.service";
import { OrdersOverviewFiltersService } from "../presentation/filters/service/orders-overview-filters.service";
import {
  ORDERS_OVERVIEW_SIDEBAR_FILTERS_DIALOG,
  OverviewSidebarFilterComponent
} from "../presentation/filters/sidebar/overview-sidebar-filter/overview-sidebar-filter.component";
import { IOrdersOverviewSearchResultUi } from "../presentation/table/orders-overview-search-result.ui.model";
import { IMealOrdersOverviewSearchUi } from "../forms/meal-orders-overview-search.ui.model";
import { MatTabChangeEvent } from "@angular/material/tabs";
import {
  OrdersOverviewTableComponent
} from "../presentation/table/orders-overview-table/orders-overview-table.component";
import {
  OverviewQuickFilterComponent
} from "../presentation/filters/quick-filters/overview-quick-filter/overview-quick-filter.component";
import {
  OrdersOverviewHeaderComponent
} from "../presentation/header/orders-overview-header/orders-overview-header.component";
import { OrdersOverviewService } from "../business/orders-overview.service";
import { MealOrdersOverviewStateService } from "../facade/state/meal-orders-overview-state.service";
import { SharedFeatureGoogleMapsDialogComponent } from "@hub/shared/feature/google-maps-dialog";

@Component({
  selector: 'hub-feature-meal-orders-overview',
  standalone: true,
  imports: [...materialModules, CommonModule, ReactiveFormsModule, OrdersOverviewTableComponent, OverviewQuickFilterComponent, OrdersOverviewHeaderComponent],
  templateUrl: './feature-meal-orders-overview.component.html',
  styleUrls: ['./feature-meal-orders-overview.component.scss'],
  providers: [MealOrdersOverviewFacadeService,OrdersOverviewService,MealOrdersOverviewStateService, OrdersOverviewFormService,OrdersOverviewFiltersService]
})
export class FeatureMealOrdersOverviewComponent implements OnDestroy, OnInit {
  searchCount$ = this.ordersFacade.searchCount$;
  searchMeta$ = this.ordersFacade.searchMeta$;
  searchResult$: Observable<IOrdersOverviewSearchResultUi[]> =
    this.ordersFacade.searchResult$;
  sidebarPinned$: Observable<boolean>;

  private readonly unsubscribe$ = new Subject<void>();

  activeTabIndex = PartOrdersOverviewTabs.StatusPlaced;

  sidebarDialogRef: MatDialogRef<any>;

  constructor(
    private readonly ordersFacade: MealOrdersOverviewFacadeService,
    private readonly matDialog: MatDialog,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly ordersFormService: OrdersOverviewFormService,
    private readonly filtersService: OrdersOverviewFiltersService,
    public dialog: MatDialog
  ) {}

  @HostListener('click') onContainerClick(): void {
    this.filtersService.nextContainerClick();
  }

  ngOnInit(): void {
    this.setDefaultValuesAndSearch(['placed']);
    //this.ordersFacade.refreshMetadata();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSortOrders(event: Sort): void {
    this.ordersFacade.sort(event.active, event.direction);
  }

  onPaginateOrders(event: PageEvent): void {
    this.ordersFacade.paginate(event.pageIndex, event.pageSize);
  }

  onOpenSidebarFilters(tabIndex: number): void {
    if (
      tabIndex === 0 &&
      this.matDialog.getDialogById(ORDERS_OVERVIEW_SIDEBAR_FILTERS_DIALOG) !=
        null
    ) {
      return;
    }

    if (
      tabIndex === 1 &&
      this.matDialog.getDialogById(ORDERS_OVERVIEW_SIDEBAR_FILTERS_DIALOG) !=
        null
    ) {
      return;
    }

    this.sidebarDialogRef = this.matDialog.open(
      OverviewSidebarFilterComponent,
      {
        id: ORDERS_OVERVIEW_SIDEBAR_FILTERS_DIALOG,
        viewContainerRef: this.viewContainerRef,
        hasBackdrop: false,
        autoFocus: false,
        backdropClass: 'overview__sidebar-filters-dialog-backdrop',
        panelClass: 'overview__sidebar-filters-dialog',
      }
    );

    this.sidebarPinned$ =
      this.sidebarDialogRef.componentInstance.sidebarPinned$.pipe(
        takeUntil(this.sidebarDialogRef.afterClosed()),
        endWith(false)
      );
    /*
    this.sidebarDialogRef.componentInstance.resetAllStatusesEmitted
      .pipe(takeUntil(this.sidebarDialogRef.afterClosed()))
      .subscribe(() => this.onAllOrdersReset());

    this.sidebarDialogRef.componentInstance.resetOpenStatusesEmitted
      .pipe(takeUntil(this.sidebarDialogRef.afterClosed()))
      .subscribe(() => this.onOpenOrdersReset());*/
  }

  onSearch(): void {
    this.ordersFacade.search(this.ordersFormService.formGroupRawValue);
  }

  private setActiveTab(ind: PartOrdersOverviewTabs): void {
    this.activeTabIndex = ind;
    this.ordersFacade.setActiveTab(ind);
  }

  async tabChanged(event: MatTabChangeEvent): Promise<void> {
    this.activeTabIndex = event.index;
    this.setActiveTab(event.index);
    this.setDefaultValuesAndSearch(['placed']);
  }

  private setDefaultValuesAndSearch(status: string[]): void {
    this.ordersFacade.resetState();
    const searchValues: IMealOrdersOverviewSearchUi = this.ordersFacade.getDefaultSearchValues(status);
    this.ordersFormService.formGroup.patchValue(searchValues, {
      emitEvent: false,
    });
    this.ordersFacade.search(searchValues);
  }

  onAllOrdersReset(): void {
    this.ordersFacade.reset();
    this.ordersFormService.formGroup.reset({ emitEvent: false });
    this.onSearch();
  }

  onShowLocation(order: IOrdersOverviewSearchResultUi) {

      const dialogRef = this.dialog.open(SharedFeatureGoogleMapsDialogComponent, {
        height: '800px',
        width: '700px',
        data: {order},
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }
}
