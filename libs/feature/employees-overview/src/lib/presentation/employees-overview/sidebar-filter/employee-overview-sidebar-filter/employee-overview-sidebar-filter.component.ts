import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeOverviewForm } from '../../form/employee-overview-form.service';
import { EmployeeOverviewFacade } from '../../../../facade/employees-overview/employee-overview-facade.service';
import { BehaviorSubject, Observable, skip, Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeOverviewFilterChipsComponent } from '../../filter-chips/employee-overview-filter-chips/employee-overview-filter-chips.component';
import { EmployeeOverviewFilterCounterComponent } from '../../filter-counter/employee-overview-filter-counter/employee-overview-filter-counter.component';
import { OverviewFilterChip } from '../../filter-chips/overview-filter-chip.model';
import { EmployeeOverviewFiltersService } from '../../../../facade/employee-overview-filters.service';
import { filter, takeUntil } from 'rxjs/operators';
import { LovItem } from '@hub/shared/workplace-reservation-data-access';

export const EMPLOYEE_OVERVIEW_SIDEBAR_FILTERS_DIALOG =
  'employee-overview-sidebar-filters-dialog';

@Component({
  selector: 'hub-employee-overview-sidebar-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    EmployeeOverviewFilterChipsComponent,
    EmployeeOverviewFilterCounterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './employee-overview-sidebar-filter.component.html',
  styleUrls: ['./employee-overview-sidebar-filter.component.scss'],
})
export class EmployeeOverviewSidebarFilterComponent
  implements OnInit, OnDestroy
{
  @Output() resetEmitted = new EventEmitter<void>();

  formGroup: FormGroup;
  activeFiltersCount$: Observable<number>;
  filterChips$: Observable<OverviewFilterChip[]>;

  gendersLov$: Observable<LovItem[]>;
  departmentsLov$: Observable<LovItem[]>;
  rolesLov$: Observable<LovItem[]>;
  statesLov$: Observable<LovItem[]>;

  private readonly pinned$ = new BehaviorSubject<boolean>(false);
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<EmployeeOverviewSidebarFilterComponent>,
    private readonly formService: EmployeeOverviewForm,
    private readonly filtersService: EmployeeOverviewFiltersService,
    private readonly facade: EmployeeOverviewFacade
  ) {}

  get sidebarPinned$(): Observable<boolean> {
    return this.pinned$.asObservable();
  }

  ngOnInit(): void {
    this.formGroup = this.formService.formGroup;
    this.statesLov$ = this.facade.statesLov$;
    this.gendersLov$ = this.facade.gendersLov$;
    this.departmentsLov$ = this.facade.departmentsLov$;
    this.rolesLov$ = this.facade.rolesLov$;
    this.activeFiltersCount$ = this.filtersService.activeFiltersCount$;
    this.filterChips$ = this.filtersService.appliedFilterChips$;
    this.listenContainerClick();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeSidebar(): void {
    this.pinned$.next(false);
    this.dialogRef.close();
  }

  pinSidebar(): void {
    this.pinned$.next(!this.pinned$.value);
    this.dialogRef.disableClose = this.pinned$.value;
  }

  onSearch(): void {
    this.facade.search(this.formService.formGroupRawValue);
  }

  onReset(): void {
    this.resetEmitted.next();
  }

  onFilterChipRemoval(controlKey: string): void {
    this.formGroup.get(controlKey).setValue(null, { emitEvent: false });
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
}
