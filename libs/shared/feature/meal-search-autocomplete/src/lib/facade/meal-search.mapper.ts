import { IMealSearchResultUi } from '../model/meal-search-result-ui.model';
import { Meal, PagedMeals } from '@hub/shared/model/food-models';

export class MealSearchMapper {
  static fromResource(resource: PagedMeals): IMealSearchResultUi[] {
    return resource.list.map(
      (element) =>
        ({
          id: element.id,
          name: element.name,
          description: element.description,
          calories: element.calories,
          price: element.price
        } as IMealSearchResultUi)
    );
  }
}
