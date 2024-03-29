import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { materialModules } from "@hub/shared/ui/material";
import { CartItem, Topping, ToppingCartItem } from "@hub/shared/model/food-models";

@Component({
  selector: 'meal-order-cart-small',
  standalone: true,
  imports: [CommonModule, ...materialModules],
  templateUrl: './meal-order-cart-small.component.html',
  styleUrls: ['./meal-order-cart-small.component.scss'],
})
export class MealOrderCartSmallComponent {
  @Input() items: CartItem[]
  @Output() itemsChanged = new EventEmitter<CartItem[]>();
  deleteCartItem(item: CartItem) {
    const ind = this.items.findIndex(i=> i.meal.id === item.meal.id);
    if (ind > -1){
      this.items.splice(ind,1);
      this.itemsChanged.next(this.items);
    }
  }

  orderSubtotal(): number {
    let total = 0;
    this.items.forEach( i => {
      total = total + (i.meal.price * i.quantity)
      for(const topping of i.toppings){
        total = total + +topping.totalPrice
      }
    })
    return total;
  }

  identifyCartItemById(index: number, item: CartItem): number {
    return item.meal.id;
  }

  identifyToppingById(index: number, item: ToppingCartItem): number {
    return item.toppingId;
  }
}
