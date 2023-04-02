import { Topping } from "../toppings/topping.interface";
import { OrderItem } from "./order-item.interface";


export interface ToppingItem {
  id: number;
  quantity: number;
  priceNoVat: number;
  priceWithVat: number;
  topping: Partial<Topping>;
  toppingPriceForMeal: number;
  orderItem: OrderItem;
  createdAt?: Date;
  modifiedAt?: Date;
}
