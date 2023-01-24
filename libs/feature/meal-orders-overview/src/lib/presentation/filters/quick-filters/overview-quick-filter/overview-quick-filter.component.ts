import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, of, Subject, takeUntil } from "rxjs";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { OrdersOverviewFormService } from "../../../../forms/orders-overview-form.service";
import { OrdersOverviewFiltersService } from "../../service/orders-overview-filters.service";
import { MatIconModule } from "@angular/material/icon";
import {
  OverviewFilterCounterComponent
} from "../../filter-counter/overview-filter-counter/overview-filter-counter.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";


@Component({
  selector: 'hub-overview-quick-filter',
  standalone: true,
  imports: [CommonModule, MatIconModule, OverviewFilterCounterComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './overview-quick-filter.component.html',
  styleUrls: ['./overview-quick-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class OverviewQuickFilterComponent implements OnInit, OnDestroy{
  @Input() activeTabIndex: number
  @Output() allOrdersSearchEmitted = new EventEmitter<void>()
  @Output() openOrdersSearchEmitted = new EventEmitter<void>()
  @Output() openSidebarFilters = new EventEmitter<number>()
  @Output() allOrdersResetEmitted = new EventEmitter<void>()
  @Output() openOrdersResetEmitted = new EventEmitter<void>()

  loading$: Observable<boolean> = of(false)
  formGroup: FormGroup
  activeFiltersCount$: Observable<number>

  private readonly unsubscribe$ = new Subject<void>()

  constructor (
    private readonly formService: OrdersOverviewFormService,
    private readonly filtersService: OrdersOverviewFiltersService
  ) {}

  ngOnInit (): void {
    this.formGroup = this.formService.formGroup
    this.activeFiltersCount$ = this.filtersService.activeFiltersCount$
    this.listenQuickFilterValueChanges()
  }

  resetFilters (event: Event): void {
    console.log('reset filter')
    event.stopPropagation()
    if (this.activeTabIndex === 0) {
      this.allOrdersResetEmitted.emit()
    } else if (this.activeTabIndex === 1) {
      this.openOrdersResetEmitted.emit()
    }
  }

  private listenQuickFilterValueChanges (): void {
    this.filtersService.quickFiltersValueChange$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() =>
        this.activeTabIndex === 0
          ? this.allOrdersSearchEmitted.emit()
          : this.openOrdersSearchEmitted.emit()
      )
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  clearInput (): void {
    this.formService.searchControl.reset()
  }

  onSearchEnter (element: HTMLInputElement): void {
    element.blur()
  }

  openSidebarFilter (): void {
    console.log('button click')
    this.openSidebarFilters.emit(this.activeTabIndex)
  }
}
