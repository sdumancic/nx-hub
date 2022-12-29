import { Meal } from '../meal/meal.interface';
import { Topping } from '../toppings/topping.interface';
import { Order } from './order.interface';


export interface ToppingItem {
  id: number;
  quantity: number;
  priceNoVat: number;
  priceWithVat: number;
  topping: Topping;
  order: Order;
  createdAt: Date;
  modifiedAt: Date;
}
