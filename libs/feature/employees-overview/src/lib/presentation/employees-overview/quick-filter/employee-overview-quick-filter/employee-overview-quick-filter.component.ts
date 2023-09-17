import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from '@hub/shared/ui/material';
import { EmployeeOverviewFilterCounterComponent } from '../../filter-counter/employee-overview-filter-counter/employee-overview-filter-counter.component';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Tabs } from '../../../../facade/tabs.enum';
import {
  EmployeeOverviewQuickFilter,
  EmployeeOverviewQuickFilterForm,
} from './employee-overview-quick-filter-form.service';

@Component({
  selector: 'hub-employee-overview-quick-filter',
  standalone: true,
  imports: [
    CommonModule,
    ...materialModules,
    EmployeeOverviewFilterCounterComponent,
  ],
  templateUrl: './employee-overview-quick-filter.component.html',
  styleUrls: ['./employee-overview-quick-filter.component.scss'],
})
export class EmployeeOverviewQuickFilterComponent {
  formService = inject(EmployeeOverviewQuickFilterForm);

  @Input() activeFiltersCount$: Observable<number>;
  @Input() activeTab: Tabs;
  @Input() metadataLoading$: Observable<boolean>;
  @Output() openSidebarFilters = new EventEmitter<Tabs>();
  @Output() searchEmitter = new EventEmitter<EmployeeOverviewQuickFilter>();
  @Output() resetEmitter = new EventEmitter<Tabs>();
  formGroup: FormGroup;
  private readonly unsubscribe$ = new Subject<void>();

  constructor() {
    this.formGroup = this.formService.formGroup;
  }

  ngOnInit(): void {
    this.listenQuickFilterValueChanges();
  }

  private listenQuickFilterValueChanges(): void {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe(() => this.searchEmitter.emit(this.formGroup.getRawValue()));
  }

  clearUsername(): void {
    this.formGroup.get('username').reset();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onUsernameEnter(element: HTMLInputElement) {
    element.blur();
  }

  openSidebarFilter() {
    this.openSidebarFilters.emit(this.activeTab);
  }

  resetFilters(event: Event): void {
    event.stopPropagation();
    this.resetEmitter.emit(this.activeTab);
  }

  onFirstnameEnter(element: HTMLInputElement) {
    element.blur();
  }

  clearFirstname() {
    this.formGroup.get('firstName').reset();
  }

  onLastnameEnter(element: HTMLInputElement) {
    element.blur();
  }

  clearLastname() {
    this.formGroup.get('lastName').reset();
  }
}
