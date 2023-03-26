import { Component, Inject, Input, LOCALE_ID, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, Subject, takeUntil } from "rxjs";
import { CartItem, MealTopping, Topping } from "@hub/shared/model/food-models";
import { materialModules } from "@hub/shared/ui/material";
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: "hub-select-topping",
  standalone: true,
  imports: [CommonModule, ...materialModules],
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
  private mealToppingsMap:  Map<number, MealTopping[]> = new Map<number, MealTopping[]>();
  cartItems: CartItem[] = [];
  expandedElement: CartItem | null;


  displayedColumns: string[] = ["imageUrl","meal", "quantity","price","actions"];
  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.cartItems$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(meals => this.cartItems = meals);
    this.mealToppingsMap$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(mealToppingsMap => this.mealToppingsMap = mealToppingsMap);

  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toppingsForMeal(id:number): MealTopping[] {
    return this.mealToppingsMap.get(id);
  }
}
