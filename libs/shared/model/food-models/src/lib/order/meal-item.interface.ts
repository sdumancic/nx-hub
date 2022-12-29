import { Meal } from "../meal/meal.interface";
import { Order } from "./order.interface";

export interface MealItem {
  id: number;
  quantity: number;
  priceNoVat: number;
  priceWithVat: number;
  meal: Meal;
  order: Order;
  createdAt: Date;
  modifiedAt: Date;
}
