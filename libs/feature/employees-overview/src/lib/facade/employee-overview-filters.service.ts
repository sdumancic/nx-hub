import { Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { merge, Observable, Subject, zip } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import {
  DEPARTMENT_CONTROL_KEY,
  EmployeeOverviewSearchUi,
  GENDER_CONTROL_KEY,
  ROLES_CONTROL_KEY,
  STATE_CONTROL_KEY,
} from '../presentation/employees-overview/form/employee-overview-search.ui.model';
import {
  OverviewFilterChip,
  OverviewFilterChipTypeEnum,
} from '../presentation/employees-overview/filter-chips/overview-filter-chip.model';
import { EmployeeOverviewFacade } from './employees-overview/employee-overview-facade.service';
import { EmployeeOverviewForm } from '../presentation/employees-overview/form/employee-overview-form.service';
import { EmployeeOverviewMapper } from './employees-overview/employee-overview.mapper';
import { LovItem } from '@hub/shared/workplace-reservation-data-access';

@Injectable()
export class EmployeeOverviewFiltersService implements OnDestroy {
  private rolesLov: LovItem[];
  private genderLov: LovItem[];
  private departmentsLov: LovItem[];
  private statesLov: LovItem[];

  private readonly containerClick$ = new Subject<void>(); // outside clicks for sidebar closing
  private readonly filterChipsRefresh$ =
    new Subject<EmployeeOverviewSearchUi>();
  private readonly unsubscribe$ = new Subject<void>();
  private readonly momentDateFormat: string = 'DD.MM.yyyy';

  get activeFiltersCount$(): Observable<number> {
    return this.facade.searchValues$.pipe(
      distinctUntilChanged(),
      map(this.countActiveFilters)
    );
  }

  get appliedFilterChips$(): Observable<OverviewFilterChip[]> {
    return merge(this.facade.searchValues$, this.filterChipsRefresh$).pipe(
      map(this.getFilterChips)
    );
  }

  get containerClicks$(): Observable<void> {
    return this.containerClick$.asObservable();
  }

  constructor(
    private readonly facade: EmployeeOverviewFacade,
    private readonly formService: EmployeeOverviewForm
  ) {
    this.subscribeToMetadataChanges();
  }

  ngOnDestroy(): void {
    this.filterChipsRefresh$.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  nextContainerClick(): void {
    this.containerClick$.next();
  }

  private subscribeToMetadataChanges(): void {
    zip(
      this.facade.rolesLov$,
      this.facade.departmentsLov$,
      this.facade.gendersLov$,
      this.facade.statesLov$,
      this.facade.searchValues$
    )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (
          data: [
            LovItem[],
            LovItem[],
            LovItem[],
            LovItem[],
            EmployeeOverviewSearchUi
          ]
        ) => {
          const [roles, departments, genders, statuses, searchValues] = data;
          this.rolesLov = roles;
          this.departmentsLov = departments;
          this.genderLov = genders;
          this.statesLov = statuses;
          this.filterChipsRefresh$.next(searchValues);
        }
      );
  }

  private readonly isActiveFilter = (value: any): boolean => {
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return value !== null && value !== '' && value !== false;
  };

  private readonly countActiveFilters = (
    searchValues: EmployeeOverviewSearchUi
  ): number => {
    return Object.values(searchValues).filter(this.isActiveFilter).length;
  };

  private readonly getFilterChips = (
    searchValues: EmployeeOverviewSearchUi
  ): OverviewFilterChip[] => {
    return Object.keys(searchValues)
      .map((key) => this.getChip(key, searchValues[key]), [])
      .filter((value) => value !== null);
  };

  private readonly getChip = (
    key: string,
    value: string
  ): OverviewFilterChip | null => {
    if (!this.isActiveFilter(value)) {
      return null;
    }
    const valueType: OverviewFilterChipTypeEnum =
      EmployeeOverviewMapper.getFilterType(key);
    return {
      controlKey: key,
      label: EmployeeOverviewMapper.getFilterTranslation(key),
      value: this.getFilterValue(key, value, valueType),
      type: valueType,
      removable: this.isChipRemovable(key),
    };
  };

  private isChipRemovable(key) {
    if (this.facade.activeTabIndex === 1 && key === 'statuses') {
      return false;
    }
    return EmployeeOverviewMapper.getFilterRemovable(key);
  }

  private readonly getFilterValue = (
    key: string,
    value: any,
    type: OverviewFilterChipTypeEnum
  ): string => {
    if (Array.isArray(value)) {
      return value
        .map((code: string) => this.getMetadataCodeDescriptionValue(key, code))
        .join(', ');
    }

    if (type === OverviewFilterChipTypeEnum.number) {
      return value.toString(10);
    }

    if (type === OverviewFilterChipTypeEnum.boolean) {
      return '';
    }

    if (
      type === OverviewFilterChipTypeEnum.date &&
      !isNaN(Date.parse(value)) &&
      !isNaN(moment(value).toDate().getDate())
    ) {
      console.log(value);
      return moment(value).format(this.momentDateFormat);
    }

    if (typeof value === 'string') {
      return value;
    }
  };

  // keys are search ui attributes/form controls
  private readonly getMetadataCodeDescriptionValue = (
    key: string,
    code: string
  ): string => {
    if (key === GENDER_CONTROL_KEY) {
      return this.genderLov.find((dealer) => dealer.code === code)?.value;
    } else if (key === DEPARTMENT_CONTROL_KEY) {
      return this.departmentsLov.find((usage) => usage.code === code)?.value;
    } else if (key === STATE_CONTROL_KEY) {
      return this.statesLov.find((type) => type.code === code)?.value;
    } else if (key === ROLES_CONTROL_KEY) {
      return this.rolesLov.find((status) => status.code === code)?.value;
    }
  };
}
