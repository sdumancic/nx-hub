import { Meal } from './meal.interface';

export interface PagedMeals {
  list: Meal[];
  count: number;
  limit: number;
  offset: number;
}

export const EMPTY_PAGED_MEALS: PagedMeals = {
  list: [],
  count: 0,
  limit: 0,
  offset: 0
}
