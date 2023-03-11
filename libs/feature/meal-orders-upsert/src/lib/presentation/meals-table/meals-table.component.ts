import { Component, Input, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { MealsDataSource } from "./meals-data-source";
import { MealOrdersUpsertFacadeService } from "../../facade/meal-orders-upsert-facade.service";
import { materialModules } from "@hub/shared/ui/material";

@Component({
  selector: 'hub-meals-table',
  standalone: true,
  imports: [CommonModule,...materialModules],
  templateUrl: './meals-table.component.html',
  styleUrls: ['./meals-table.component.scss']
})
export class MealsTableComponent implements OnInit, OnDestroy{

  @Input() timeFormat = 'HH:mm'
  @Input() dateFormat = 'dd/MM/yyyy'
  datasource: MealsDataSource
  displayedColumns = ['imageUrl','name','price','quantity','actions']
  constructor(public facade: MealOrdersUpsertFacadeService) {
  }

  private readonly unsubscribe$ = new Subject<void>()

  ngOnInit (): void {
    this.datasource = new MealsDataSource(this.facade)
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  addQuantity(element) {
    console.log('add ',element);
  }

  removeQuantity(element) {
    console.log('remove ',element);
  }
}
