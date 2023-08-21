import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { materialModules } from "@hub/shared/ui/material";
import {
  EmployeeOverviewFilterCounterComponent
} from "../../filter-counter/employee-overview-filter-counter/employee-overview-filter-counter.component";
import { Observable, Subject } from "rxjs";
import { EmployeeOverviewForm } from "../../form/employee-overview-form.service";
import { FormGroup } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { EmployeeOverviewFiltersService } from "../../../../facade/employee-overview-filters.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'hub-employee-overview-quick-filter',
  standalone: true,
  imports: [CommonModule,  ...materialModules, EmployeeOverviewFilterCounterComponent],
  templateUrl: './employee-overview-quick-filter.component.html',
  styleUrls: ['./employee-overview-quick-filter.component.scss'],
})
export class EmployeeOverviewQuickFilterComponent {
  @Output() openSidebarFilters = new EventEmitter<number>()
  @Output() searchEmitter = new EventEmitter<number>()
  @Output() resetEmitter = new EventEmitter<number>()
  formGroup: FormGroup
  activeFiltersCount$: Observable<number>
  private readonly unsubscribe$ = new Subject<void>()

  constructor (
    private readonly formService: EmployeeOverviewForm,
    private readonly filtersService: EmployeeOverviewFiltersService
  ) {}

  ngOnInit (): void {
    this.formGroup = this.formService.formGroup
    this.activeFiltersCount$ = this.filtersService.activeFiltersCount$
    this.listenQuickFilterValueChanges()
  }

  private listenQuickFilterValueChanges (): void {
    this.filtersService.quickFiltersValueChange$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() =>
        this.searchEmitter.emit()
     )
  }

  clearUsername (): void {
    this.formService.usernameControl.reset()
  }


  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  onUsernameEnter(element: HTMLInputElement) {
    element.blur()
  }

  openSidebarFilter() {
    this.openSidebarFilters.emit(1)
  }

  resetFilters (event: Event): void {
    event.stopPropagation()
    this.resetEmitter.emit()
  }

  onFirstnameEnter(element: HTMLInputElement) {
    element.blur()
  }

  clearFirstname() {
    this.formService.firstNameControl.reset()
  }

  onLastnameEnter(element: HTMLInputElement) {
    element.blur()
  }

  clearLastname() {
    this.formService.lastNameControl.reset()
  }
}
