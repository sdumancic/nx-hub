import { Meal, PagedMeals } from '@hub/shared/model/food-models';
import { IMealSearchUi } from '../model/meal-search-ui.model';

export class MealSearchMapper {
  static fromMealToMealSearchUi(resource: Meal): IMealSearchUi {
    return {
      id: resource.id,
      name: resource.name,
      description: resource.description,
      calories: resource.calories,
      price: resource.price,
      categoryId: resource.category.id,
    } as IMealSearchUi;
  }

  static fromResources(resource: PagedMeals): IMealSearchUi[] {
    return resource.list.map(
      (element) =>
        ({
          id: element.id,
          name: element.name,
          description: element.description,
          calories: element.calories,
          price: element.price,
          categoryId: element.category.id,
        } as IMealSearchUi)
    );
  }

  static emptyMeal(categoryId: number): IMealSearchUi {
    return {
      id: null,
      name: null,
      description: null,
      calories: null,
      price: null,
      categoryId: categoryId,
    } as IMealSearchUi;
  }
}
