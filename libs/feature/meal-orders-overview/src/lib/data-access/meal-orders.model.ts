import { Category, Topping } from "@hub/shared/model/food-models";

export interface IMealOrdersMetadata {
  categories: Category[]
  toppings: Topping[]
}
