import { Topping } from "./topping.interface";

export interface PagedToppings {
  list: Topping[];
  count: number;
  limit: number;
  offset: number;
}
