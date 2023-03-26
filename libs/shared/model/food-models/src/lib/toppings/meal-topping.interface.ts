import { Topping } from "./topping.interface";


export interface MealTopping{
  id: number,
  price: number,
  createdAt: string,
  modifiedAt: string,
  topping: Partial<Topping>
}
