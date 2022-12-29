import { Topping } from "../toppings/topping.interface";
import { OrderItem } from "./order-item.interface";


export interface ToppingItem {
  id: number;
  quantity: number;
  priceNoVat: number;
  priceWithVat: number;
  topping: Topping;
  orderItem: OrderItem;
  //order: Order;
  createdAt: Date;
  modifiedAt: Date;
}
