import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, Subject, takeUntil } from "rxjs";
import { CartItem, MealTopping } from "@hub/shared/model/food-models";
import { materialModules } from "@hub/shared/ui/material";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MealToppingsTableComponent } from "../../../presentation/meal-toppings-table/meal-toppings-table.component";
import { MealToppingChange } from "../../../model/meal-topping-change.interface";

@Component({
  selector: "hub-select-topping",
  standalone: true,
  imports: [CommonModule, ...materialModules, MealToppingsTableComponent],
  templateUrl: "./select-topping.component.html",
  styleUrls: ["./select-topping.component.scss"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SelectToppingComponent implements OnInit, OnDestroy {
  @Input() cartItems$: Observable<CartItem[]>;
  @Input() mealToppingsMap$:  Observable<Map<number, MealTopping[]>>;
  @Output() mealToppingChanged = new EventEmitter<MealToppingChange>();
  expandedElement: CartItem | null;

  displayedColumns: string[] = ["imageUrl","meal", "quantity","price","actions"];
  private mealToppingsMap:  Map<number, MealTopping[]> = new Map<number, MealTopping[]>();
  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.mealToppingsMap$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(mealToppingsMap => this.mealToppingsMap = mealToppingsMap);
  }

  toppingsForMeal(id:number): MealTopping[] {
    return this.mealToppingsMap.get(id);
  }

  onCartItemToppingChanged(item: MealToppingChange) {
    this.mealToppingChanged.next(item);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
