import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { BehaviorSubject, filter, Observable, skip, Subject, takeUntil } from "rxjs";
import { Category, Topping } from "@hub/shared/model/food-models";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IOverviewFilterChip } from "../../filter-chips/overview-filter-chip.model";
import { OrdersOverviewFiltersService } from "../../service/orders-overview-filters.service";
import { MealOrdersOverviewFacadeService } from "../../../../facade/meal-orders-overview-facade.service";
import { OrdersOverviewFormService } from "../../../../forms/orders-overview-form.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { OverviewFilterChipComponent } from "../../filter-chips/overview-filter-chip/overview-filter-chip.component";
import {
  OverviewFilterCounterComponent
} from "../../filter-counter/overview-filter-counter/overview-filter-counter.component";
import { MatIconModule } from "@angular/material/icon";

export const ORDERS_OVERVIEW_SIDEBAR_FILTERS_DIALOG =
  'orders-overview-sidebar-filters-dialog'

@Component({
  selector: 'hub-overview-sidebar-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatDividerModule, OverviewFilterChipComponent, OverviewFilterCounterComponent, MatIconModule],
  templateUrl: './overview-sidebar-filter.component.html',
  styleUrls: ['./overview-sidebar-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewSidebarFilterComponent implements OnInit, OnDestroy {
  @Output() resetAllStatusesEmitted = new EventEmitter<void>()
  @Output() resetOpenStatusesEmitted = new EventEmitter<void>()
  categoryLov$: Observable<Category[]> =
    this.ordersFacade.categories$

  toppingLov$: Observable<Topping[]> =
    this.ordersFacade.toppings$

  formGroup: FormGroup
  activeFiltersCount$: Observable<number>
  filterChips$: Observable<IOverviewFilterChip[]>

  private readonly pinned$ = new BehaviorSubject<boolean>(false)
  private readonly unsubscribe$ = new Subject<void>()

  constructor (
    private readonly filtersService: OrdersOverviewFiltersService,
    private readonly ordersFacade: MealOrdersOverviewFacadeService,
    private readonly formService: OrdersOverviewFormService,
    private readonly dialogRef: MatDialogRef<OverviewSidebarFilterComponent>
  ) {}

  ngOnInit (): void {
    this.formGroup = this.formService.formGroup
    this.activeFiltersCount$ = this.filtersService.activeFiltersCount$
    this.filterChips$ = this.filtersService.appliedFilterChips$
    this.listenContainerClick()
  }

  get sidebarPinned$ (): Observable<boolean> {
    return this.pinned$.asObservable()
  }

  closeSidebar (): void {
    this.pinned$.next(false)
    this.dialogRef.close()
  }

  pinSidebar (): void {
    this.pinned$.next(!this.pinned$.value)
    this.dialogRef.disableClose = this.pinned$.value
  }

  get activeTabIndex (): number {
    return this.ordersFacade.activeTabIndex
  }

  onReset (): void {
    if (this.activeTabIndex === 0) {
      this.resetAllStatusesEmitted.next()
    } else {
      this.resetOpenStatusesEmitted.next()
    }
  }

  onSearch (): void {
    this.ordersFacade.search(this.formService.formGroupRawValue)
  }

  onFilterChipRemoval (controlKey: string): void {
    this.formService.formGroup
      .get(controlKey)
      .setValue(null, { emitEvent: false })
    this.onSearch()
  }

  private listenContainerClick (): void {
    this.filtersService.containerClicks$
      .pipe(
        skip(1),
        filter(() => !this.pinned$.value),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.closeSidebar())
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
