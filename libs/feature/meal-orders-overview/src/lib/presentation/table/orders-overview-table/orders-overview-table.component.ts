import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { OrdersOverviewDataSource } from "../orders-overview-data-source";
import { merge, Observable, Subject, takeUntil, tap } from "rxjs";
import { ISearchMeta } from "../../../facade/state/meal-orders-overview-state.model";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { IOrdersOverviewSearchResultUi } from "../orders-overview-search-result.ui.model";
import { SelectionModel } from "@angular/cdk/collections";
import {
  IDatatableSortDirection,
  IDatatableSortEvent,
  ORDERS_OVERVIEW_DISPLAYED_COLUMNS
} from "../orders-overview-table-config";
import { MealOrdersOverviewMapper } from "../../../facade/meal-orders-overview.mapper";
import { MealOrdersOverviewFacadeService } from "../../../facade/meal-orders-overview-facade.service";
import { materialModules } from "../../../material";
import { Tabs } from "../../../facade/tabs";

@Component({
  selector: 'hub-orders-overview-table',
  standalone: true,
  imports: [CommonModule,...materialModules],
  templateUrl: './orders-overview-table.component.html',
  styleUrls: ['./orders-overview-table.component.scss']
})
export class OrdersOverviewTableComponent implements OnInit, OnDestroy, OnChanges{

  @Input() sourceTab: Tabs;
  @Input() searchCount$: Observable<number>
  @Input() searchMeta: ISearchMeta
  @Input() timeFormat = 'HH:mm'
  @Input() dateFormat = 'dd/MM/yyyy'

  @Output() sortEmitter = new EventEmitter<Sort>()
  @Output() paginate = new EventEmitter<PageEvent>()
  @Output() selectionChange = new EventEmitter<
    IOrdersOverviewSearchResultUi[]
  >()
  @Output() showLocation = new EventEmitter<IOrdersOverviewSearchResultUi>()


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  datasource: OrdersOverviewDataSource

   selection = new SelectionModel<IOrdersOverviewSearchResultUi>(true, [])

  displayedColumns = ORDERS_OVERVIEW_DISPLAYED_COLUMNS
    .filter(el => el.displayed)
    .map(el => el.name)



  rowsPerPage = [10, 25, 50, 100]
  sortConfig: IDatatableSortEvent

  constructor(public facade: MealOrdersOverviewFacadeService) {
  }

  private readonly unsubscribe$ = new Subject<void>()

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['searchMeta']) {
      this.setSortConfig(this.searchMeta)
    }
  }

  ngOnInit (): void {
    this.datasource = new OrdersOverviewDataSource(this.facade)
    this.emitSelectionChange()
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

   onSort (sort: Sort): void {
    this.sortEmitter.emit(sort)
  }

  private setSortConfig (searchMeta: ISearchMeta): void {
    this.sortConfig = {
      column: searchMeta.sorting.attribute ?? '',
      direction: searchMeta.sorting.order as IDatatableSortDirection
    }
  }

  private emitSelectionChange (): void {
    this.selection.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.selectionChange.emit(this.selection.selected))
  }

  onLocationClicked(event: MouseEvent, order: IOrdersOverviewSearchResultUi) {
    event.stopPropagation();
    this.showLocation.next(order);


  }

  onClickEdit(element: any) {
    console.log('clicked on ', element);
  }

  onPageEvent(page: PageEvent) {
    this.paginate.emit(page);
  }
}
