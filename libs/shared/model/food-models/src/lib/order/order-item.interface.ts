import { Meal } from '../meal/meal.interface';
import { Order } from './order.interface';
import { ToppingItem } from './topping-item.interface';

export interface OrderItem {
  id: number;
  quantity: number;
  priceNoVat: number;
  priceWithVat: number;
  meal: Meal;
  order: Order;
  toppingsItems: ToppingItem[];
  createdAt: Date;
  modifiedAt: Date;
}
