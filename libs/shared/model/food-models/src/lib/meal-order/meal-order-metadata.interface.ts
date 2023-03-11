import { Category } from "../category/category.interface"
import { Topping } from "../toppings/topping.interface"

export interface IMealOrdersMetadata {
  categories: Category[]
  toppings: Topping[]
}
