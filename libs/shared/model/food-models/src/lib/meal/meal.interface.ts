import { Category } from "../category/category.interface";

export interface Meal {
  id: number;
  name: string;
  description: string;
  iconUrl1: string;
  iconUrl2: string;
  iconUrl3: string;
  active: boolean;
  category: Category;
  calories: number;
  rating: number;
  price: number;
  createdAt: Date;
  modifiedAt: Date;
}
