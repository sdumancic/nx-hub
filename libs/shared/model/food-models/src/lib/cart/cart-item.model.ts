import { Meal } from "../meal/meal.interface";
import { ToppingCartItem } from "./topping-cart-item.interface";


export interface CartItem{
  meal: Meal;
  toppings?: ToppingCartItem[]
  quantity: number;
  totalPriceNoVat: number;
  totalPriceWithVat: number;
}
