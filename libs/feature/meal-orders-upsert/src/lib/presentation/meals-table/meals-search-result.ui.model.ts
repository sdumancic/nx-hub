import { Category } from "@hub/shared/model/food-models";

export interface IMealsSearchResultUi {
  id: number;
  calories : number
  category: Category
  createdAt: Date
  description: string;
  modifiedAt: Date
  name: string;
  price: number;
  rating: number;
  imageUrl: string;
  quantity: number;
}
