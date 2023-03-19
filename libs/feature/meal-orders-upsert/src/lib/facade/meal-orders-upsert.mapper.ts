import { CartItem, Category, Meal, PagedMeals, Topping } from "@hub/shared/model/food-models";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";

export class MealOrdersUpsertMapper {
  static fromResourceCollectionToSearchResultUi(
    resource: PagedMeals
  ): IMealsSearchResultUi[] {
    return resource.list?.map(
      (element) =>
        ({
          id: element.id,
          calories : element.calories,
          category: {
            id: element.category.id,
            name: element.category.name,
            iconUrl: element.category.iconUrl,
            active: element.category.active,
            createdAt: element.category.createdAt,
            modifiedAt: element.category.modifiedAt
          },
          createdAt: element.createdAt,
          description: element.description,
          modifiedAt: element.modifiedAt,
          name: element.name,
          price:element.price,
          rating: element.rating,
          imageUrl: element.imageUrl,
          quantity: 1
        } as IMealsSearchResultUi)
    );
  }

  static mapMealSearchResultToMeal(mealUi: IMealsSearchResultUi): Meal{
    return {
      id: mealUi.id,
      name: mealUi.name,
      description: mealUi.description,
      imageUrl: mealUi.imageUrl,
      active: true,
      category: mealUi.category,
      calories: mealUi.calories,
      rating: mealUi.rating,
      price: mealUi.price,
      createdAt: mealUi.createdAt,
      modifiedAt: mealUi.modifiedAt
    }
  }

  static createCartItem(mealUi: IMealsSearchResultUi): CartItem {
    return {
      meal: MealOrdersUpsertMapper.mapMealSearchResultToMeal(mealUi),
      quantity: mealUi.quantity,
      totalPriceNoVat: mealUi.price * mealUi.quantity,
      totalPriceWithVat: mealUi.price * mealUi.quantity,
    }
  }
}
