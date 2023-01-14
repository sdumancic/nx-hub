import { Meal } from './meal.interface';

export interface PagedMeals {
  list: Meal[];
  count: number;
  limit: number;
  offset: number;
}
