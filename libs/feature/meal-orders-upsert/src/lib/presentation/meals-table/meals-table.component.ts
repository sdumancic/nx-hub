import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { MealsDataSource } from "./meals-data-source";
import { MealOrdersUpsertFacadeService } from "../../facade/meal-orders-upsert-facade.service";
import { materialModules } from "@hub/shared/ui/material";
import { IMealsSearchResultUi } from "./meals-search-result.ui.model";

@Component({
  selector: 'hub-meals-table',
  standalone: true,
  imports: [CommonModule,...materialModules],
  templateUrl: './meals-table.component.html',
  styleUrls: ['./meals-table.component.scss']
})
export class MealsTableComponent implements OnInit, OnDestroy{

  @Output() addToCartEmitter = new EventEmitter<IMealsSearchResultUi>();
  datasource: MealsDataSource
  displayedColumns = ['imageUrl','name','price','quantity','actions']
  private readonly unsubscribe$ = new Subject<void>()
  constructor(public facade: MealOrdersUpsertFacadeService) {}

  ngOnInit (): void {
    this.datasource = new MealsDataSource(this.facade)
  }

  addQuantity(element) {
    element.quantity++;
  }

  removeQuantity(element) {
    if (element.quantity > 1){
      element.quantity--;
    }
  }

  addToCart(element) {
    this.addToCartEmitter.emit(element);
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}
