import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BehaviorSubject, filter, Observable, skip, Subject, takeUntil } from "rxjs";
import { CartItem, Category, Topping } from "@hub/shared/model/food-models";
import { FormGroup } from "@angular/forms";
import { IOverviewFilterChip } from "../../filter-chips/overview-filter-chip.model";
import { OrdersOverviewFiltersService } from "../../service/orders-overview-filters.service";
import { MealOrdersOverviewFacadeService } from "../../../../facade/meal-orders-overview-facade.service";
import { OrdersOverviewFormService } from "../../../../forms/orders-overview-form.service";
import { MatDialogRef } from "@angular/material/dialog";
import { OverviewFilterChipComponent } from "../../filter-chips/overview-filter-chip/overview-filter-chip.component";
import {
  OverviewFilterCounterComponent
} from "../../filter-counter/overview-filter-counter/overview-filter-counter.component";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import { CUSTOM_DATE_FORMATS } from "@hub/shared/util/app-config";
import { materialModules } from "@hub/shared/ui/material";

export const ORDERS_OVERVIEW_SIDEBAR_FILTERS_DIALOG =
  'orders-overview-sidebar-filters-dialog';

@Component({
  selector: 'hub-overview-sidebar-filter',
  standalone: true,
  imports: [CommonModule, ...materialModules, OverviewFilterChipComponent, OverviewFilterCounterComponent],
  templateUrl: './overview-sidebar-filter.component.html',
  styleUrls: ['./overview-sidebar-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})
export class OverviewSidebarFilterComponent implements OnInit, OnDestroy {
  @Output() resetAllStatusesEmitted = new EventEmitter<void>();
  @Output() resetOpenStatusesEmitted = new EventEmitter<void>();
  categoryLov$: Observable<Category[]> = this.ordersFacade.categories$;


  formGroup: FormGroup;
  activeFiltersCount$: Observable<number>;
  filterChips$: Observable<IOverviewFilterChip[]>;

  private readonly pinned$ = new BehaviorSubject<boolean>(false);
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly filtersService: OrdersOverviewFiltersService,
    private readonly ordersFacade: MealOrdersOverviewFacadeService,
    private readonly formService: OrdersOverviewFormService,
    private readonly dialogRef: MatDialogRef<OverviewSidebarFilterComponent>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _adapter: DateAdapter<any>,

  ) {}

  ngOnInit(): void {
    this.formGroup = this.formService.formGroup;
    this.activeFiltersCount$ = this.filtersService.activeFiltersCount$;
    this.filterChips$ = this.filtersService.appliedFilterChips$;
    this.listenContainerClick();
    this._adapter.setLocale(this._locale);
  }

  get sidebarPinned$(): Observable<boolean> {
    return this.pinned$.asObservable();
  }

  closeSidebar(): void {
    this.pinned$.next(false);
    this.dialogRef.close();
  }

  pinSidebar(): void {
    this.pinned$.next(!this.pinned$.value);
    this.dialogRef.disableClose = this.pinned$.value;
  }

  get activeTabIndex(): number {
    return this.ordersFacade.activeTabIndex;
  }

  onReset(): void {
    if (this.activeTabIndex === 0) {
      this.resetAllStatusesEmitted.next();
    } else {
      this.resetOpenStatusesEmitted.next();
    }
  }

  onSearch(): void {
    this.ordersFacade.search(this.formService.formGroupRawValue);
  }

  onFilterChipRemoval(controlKey: string): void {
    console.log(controlKey);
    this.formService.formGroup
      .get(controlKey)
      .setValue(null, { emitEvent: false });
    this.onSearch();
  }

  private listenContainerClick(): void {
    this.filtersService.containerClicks$
      .pipe(
        skip(1),
        filter(() => !this.pinned$.value),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.closeSidebar());
  }

  identifyCategoryById(index: number, item: Category): number {
    return item.id;
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
