import { CartItem, Customer, Meal, PagedMeals } from "@hub/shared/model/food-models";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";
import { CustomerFormUi } from "../forms/customer-form-ui.interface";
import { CustomerSearchResultUi } from "../model/customer-search-result-ui.interface";

export class MealOrdersUpsertMapper {
  static fromResourceCollectionToSearchResultUi(
    resource: PagedMeals
  ): IMealsSearchResultUi[] {
    return resource.list?.map(
      (element) =>
        ({
          id: element.id,
          calories: element.calories,
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
          price: element.price,
          rating: element.rating,
          imageUrl: element.imageUrl,
          quantity: 1
        } as IMealsSearchResultUi)
    );
  }

  static mapMealSearchResultToMeal(mealUi: IMealsSearchResultUi): Meal {
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
    };
  }

  static createCartItem(mealUi: IMealsSearchResultUi): CartItem {
    return {
      meal: MealOrdersUpsertMapper.mapMealSearchResultToMeal(mealUi),
      quantity: mealUi.quantity,
      totalPriceNoVat: mealUi.price * mealUi.quantity,
      totalPriceWithVat: mealUi.price * mealUi.quantity
    };
  }

  static fromCustomerUiToCustomer(customerUi: CustomerFormUi): Partial<Customer> {
    return {
      id: customerUi.id ? customerUi.id: null,
      firstName: customerUi.firstName,
      lastName: customerUi.lastName,
      city: customerUi.city,
      address: customerUi.address,
      customerLocation: {
        type: "Point",
        coordinates: [
          customerUi.longitude,
          customerUi.latitude,
        ]
      }
    } as Customer;
  }

  static fromCustomerSearchResultUiToForm(value: CustomerSearchResultUi): CustomerFormUi {
    return {
      id: value.id,
      firstName: value.firstName,
      lastName: value.lastName,
      address: value.address,
      city: value.city,
      longitude: value.longitude,
      latitude: value.latitude
    } as CustomerFormUi;
  }

  static mapCustomerArrayToCustomerSearchResultUi(results: Customer[]): CustomerSearchResultUi[] {
    return results.map(res => {
      return <CustomerSearchResultUi>{
        id: res.id,
        lastName: res.lastName,
        firstName: res.firstName,
        city: res.city,
        address: res.address,
        customerLocation: res.customerLocation,
        longitude: res.customerLocation['type'] === 'Point' ? res.customerLocation['coordinates'][0] : null,
        latitude: res.customerLocation['type'] === 'Point' ? res.customerLocation['coordinates'][1] : null,
      }
    })
  }
}
