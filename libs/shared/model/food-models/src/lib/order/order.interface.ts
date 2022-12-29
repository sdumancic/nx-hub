import { MealItem } from "./meal-item.interface";
import { ToppingItem } from "./topping-item.interface";


export interface Order {
  id: number;
  datePlaced: Date;
  dateDispatched: Date;
  dateCompleted: Date;
  notes: string;
  status: string;
  orderTotalNoVat: number;
  orderTotalWithVat: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryLocation: string;
  paymentMethod: string;
  createdAt: Date;
  modifiedAt: Date;
  mealItems: MealItem[];
  toppingItems?: ToppingItem[];
}
