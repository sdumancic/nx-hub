import { Meal } from "../meal/meal.interface";
import { Topping } from "../toppings/topping.interface";


export interface CartItem{
  meal: Meal;
  toppings?: Topping[]
  quantity: number;
  totalPriceNoVat: number;
  totalPriceWithVat: number;
}
