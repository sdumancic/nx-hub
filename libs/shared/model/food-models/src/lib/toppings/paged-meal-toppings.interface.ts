import { MealTopping } from "./meal-topping.interface";

export interface PagedMealToppings {
  list: MealTopping[];
  count: number;
  limit: number;
  offset: number;
}
