import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from '@hub/shared/ui/material';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { EmployeeOverviewSearchResultUi } from './employee-overview-search-result.ui.model';
import { EmployeeOverviewDataSource } from '../employee-overview-data-source';
import { EmployeeOverviewFacade } from '../../../../facade/employees-overview/employee-overview-facade.service';
import {
  DatatableSortDirection,
  DatatableSortEvent,
  EMPLOYEE_OVERVIEW_DISPLAYED_COLUMNS,
} from '../employee-overview-table-config';
import { SearchMeta } from '@hub/shared/workplace-reservation-data-access';

@Component({
  selector: 'hub-employee-overview-table',
  standalone: true,
  imports: [CommonModule, ...materialModules],
  templateUrl: './employee-overview-table.component.html',
  styleUrls: ['./employee-overview-table.component.scss'],
})
export class EmployeeOverviewTableComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() searchCount$: Observable<number>;
  @Input() searchMeta: SearchMeta;
  @Input() timeFormat = 'HH:mm';
  @Input() dateFormat = 'dd/MM/yyyy';
  @Input() currency = 'EUR';

  @Output() sortEmitter = new EventEmitter<Sort>();
  @Output() paginate = new EventEmitter<PageEvent>();
  @Output() selectionChange = new EventEmitter<
    EmployeeOverviewSearchResultUi[]
  >();
  @Output() action1 = new EventEmitter<EmployeeOverviewSearchResultUi>();
  @Output() action2 = new EventEmitter<EmployeeOverviewSearchResultUi>();
  @Output() action3 = new EventEmitter<EmployeeOverviewSearchResultUi>();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  matSortActive = 'username';
  matSortDirection = "'asc'";

  datasource: EmployeeOverviewDataSource;

  selection = new SelectionModel<EmployeeOverviewSearchResultUi>(true, []);

  displayedColumns = EMPLOYEE_OVERVIEW_DISPLAYED_COLUMNS.filter(
    (el) => el.displayed
  ).map((el) => el.name);

  rowsPerPage = [10, 25, 50, 100];
  sortConfig: DatatableSortEvent;

  private readonly unsubscribe$ = new Subject<void>();

  constructor(public facade: EmployeeOverviewFacade) {}

  ngOnInit(): void {
    this.datasource = new EmployeeOverviewDataSource(this.facade);
    this.displayedColumns = EMPLOYEE_OVERVIEW_DISPLAYED_COLUMNS.filter(
      (el) => el.displayed
    ).map((el) => {
      return el.name;
    });

    const totalWidth = EMPLOYEE_OVERVIEW_DISPLAYED_COLUMNS.filter(
      (el) => el.displayed
    )
      .map((el) => el.width)
      .reduce((acc, curr) => acc + curr);
    document.documentElement.style.setProperty(
      '--totalWidth',
      totalWidth.toString()
    );
    this.emitSelectionChange();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchMeta']) {
      if (this.paginator) {
        this.paginator.pageIndex =
          changes['searchMeta'].currentValue.pagination.index - 1;
      }
      this.setSortConfig(this.searchMeta);
    }
  }

  onSort(sort: Sort): void {
    this.sortEmitter.emit(sort);
  }

  onPageEvent(page: PageEvent) {
    this.paginate.emit(page);
  }

  onClickAction1(row: EmployeeOverviewSearchResultUi) {
    this.action1.emit(row);
  }

  onClickAction2(row: EmployeeOverviewSearchResultUi) {
    this.action2.emit(row);
  }

  onClickAction3(row: EmployeeOverviewSearchResultUi) {
    this.action3.emit(row);
  }

  private setSortConfig(searchMeta: SearchMeta): void {
    this.sortConfig = {
      column: searchMeta.sorting.attribute ?? '',
      direction:
        searchMeta.sorting.order === 'asc'
          ? DatatableSortDirection.ASCENDING
          : searchMeta.sorting.order === 'desc'
          ? DatatableSortDirection.DESCENDING
          : DatatableSortDirection.ASCENDING,
    };
    this.matSortActive = this.sortConfig.column;
    this.matSortDirection = this.sortConfig.direction;
  }

  private emitSelectionChange(): void {
    this.selection.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.selectionChange.emit(this.selection.selected));
  }
}
