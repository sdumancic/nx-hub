import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { MealToppingsTableDataSource } from "./meal-toppings-table-datasource";
import { CommonModule } from "@angular/common";
import { materialModules } from "@hub/shared/ui/material";
import { CartItem, MealTopping } from "@hub/shared/model/food-models";
import { MealOrdersUpsertMapper } from "../../facade/meal-orders-upsert.mapper";
import { MealToppingChange } from "../../model/meal-topping-change.interface";


export interface MealToppingTableItem {
  toppingId: number,
  toppingName: string
  toppingPrice: number,
  toppingDesc: string,
  quantity: number
}

@Component({
  selector: "hub-meal-toppings-table",
  templateUrl: "./meal-toppings-table.component.html",
  imports: [CommonModule, ...materialModules],
  styleUrls: ["./meal-toppings-table.component.scss"],
  standalone: true
})
export class MealToppingsTableComponent implements OnChanges {
  @Input() cartItem: CartItem;
  @Input() mealId: number;
  @Input() mealToppings: MealTopping[] = [];
  @Output() cartItemToppingChanged = new EventEmitter<MealToppingChange>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MealToppingTableItem>;
  dataSource: MealToppingsTableDataSource;

  displayedColumns = ["toppingId", "toppingName", "toppingPrice", "quantity"];

  displayTable(): void {
    this.dataSource = new MealToppingsTableDataSource(MealOrdersUpsertMapper.mealToppingsToMealToppingTableItems([...this.mealToppings]));
    this.updateQuantityWhenReturning(this.dataSource);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && (changes["mealToppings"] && !!changes["mealToppings"].currentValue)) {
      this.displayTable();
    }
    if (changes && changes["cartItem"] && !!changes["cartItem"].currentValue && !!this.mealToppings) {
      this.displayTable();
    }
  }

  addQuantity(row: MealToppingTableItem): void {
    row.quantity++;
    const mealToppingChange: MealToppingChange = { ...row, mealId: this.mealId };
    this.cartItemToppingChanged.next(mealToppingChange);
  }

  removeQuantity(row: MealToppingTableItem): void {
    row.quantity--;
    const mealToppingChange: MealToppingChange = { ...row, mealId: this.mealId };
    this.cartItemToppingChanged.next(mealToppingChange);
  }

  private updateQuantityWhenReturning(dataSource: MealToppingsTableDataSource) {
    if (this.cartItem.toppings?.length > 0) {
      this.cartItem.toppings.forEach(t => {
        const mealToppingTableItem = this.dataSource.data.find(row => row.toppingId === t.toppingId);
        mealToppingTableItem.quantity = t.quantity;
      });
    }
  }
}

