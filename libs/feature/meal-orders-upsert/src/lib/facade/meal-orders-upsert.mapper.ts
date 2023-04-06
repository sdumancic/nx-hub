import {
  CartItem,
  Customer,
  Meal,
  MealTopping,
  Order,
  OrderItem,
  PagedMeals, Topping, ToppingCartItem,
  ToppingItem
} from "@hub/shared/model/food-models";
import { IMealsSearchResultUi } from "../presentation/meals-table/meals-search-result.ui.model";
import { CustomerFormUi } from "../forms/customer-form-ui.interface";
import { CustomerSearchResultUi } from "../model/customer-search-result-ui.interface";
import { MealToppingTableItem } from "../presentation/meal-toppings-table/meal-toppings-table.component";

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
      totalPriceWithVat: mealUi.price * mealUi.quantity,
      toppings: []
    };
  }

  static fromCustomerUiToCustomer(customerUi: CustomerFormUi): Partial<Customer> {
    return {
      id: customerUi.id ? customerUi.id : null,
      firstName: customerUi.firstName,
      lastName: customerUi.lastName,
      city: customerUi.city,
      address: customerUi.address,
      customerLocation: {
        type: "Point",
        coordinates: [
          customerUi.longitude,
          customerUi.latitude
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
        longitude: res.customerLocation["type"] === "Point" ? res.customerLocation["coordinates"][0] : null,
        latitude: res.customerLocation["type"] === "Point" ? res.customerLocation["coordinates"][1] : null
      };
    });
  }

  static mealToppingsToMealToppingTableItems(mealToppings: MealTopping[]): MealToppingTableItem[] {
    return mealToppings.map(mealTopping => {
      return {
        toppingId: mealTopping.topping.id,
        toppingName: mealTopping.topping.name,
        toppingPrice: mealTopping.price,
        toppingDesc: mealTopping.topping.description,
        quantity: 0
      } as MealToppingTableItem;
    });
  }

  static toNewOrder(cartItems: CartItem[], customer: CustomerSearchResultUi): Partial<Order> {
    return {
      id: null,
      notes: null,
      deliveryAddress: customer.address,
      deliveryCity: customer.city,
      deliveryLocation: {
        type: "Point",
        coordinates: [
          customer.longitude,
          customer.latitude,
        ]
      },
      paymentMethod: 'CASH',
      orderItems: MealOrdersUpsertMapper.cartItemsToOrderItems(cartItems),
      customer: {
        id: customer.id
      }
    } as Partial<Order>;
  }

  static cartItemsToOrderItems(cartItems: CartItem[]): OrderItem[]{
    return cartItems.map(item => {
      return {
        id: null,
        quantity: item.quantity,
        priceNoVat: item.totalPriceNoVat,
        priceWithVat: item.totalPriceWithVat,
        order: null,
        meal: item.meal,
        toppingsItems: MealOrdersUpsertMapper.toppingCartItemsToToppingItems(item.toppings)
      } as OrderItem
    })
  }

  private static toppingCartItemsToToppingItems(toppingCartItems: ToppingCartItem[]): ToppingItem[] {
    return toppingCartItems.map(toppingCartItem => {
      return {
        id: null,
        quantity: toppingCartItem.quantity,
        priceNoVat: toppingCartItem.totalPrice,
        priceWithVat: toppingCartItem.totalPrice,
        topping: {
          id: toppingCartItem.toppingId
        },
        toppingPriceForMeal: toppingCartItem.toppingPrice,
        orderItem: null,
      }
    })
  }

 static orderItemsToCartItems(orderItems: OrderItem[]): CartItem[]{
    return orderItems.map(item => {
      return {
        meal: item.meal,
        toppings: MealOrdersUpsertMapper.toppingItemsToToppingCartItems(item.toppingsItems),
        quantity: item.quantity,
        totalPriceNoVat: item.priceNoVat,
        totalPriceWithVat: item.priceWithVat
      } as CartItem
    })
  }

  static toppingItemsToToppingCartItems(toppingItems: ToppingItem[]): ToppingCartItem[]{
    if (!toppingItems){
      return []
    };
    if (toppingItems.length === 0){
      return []
    };
    return toppingItems.map(item => {
      return {
        toppingId: item.topping.id,
        toppingName: item.topping.name,
        toppingPrice: item.priceWithVat,
        quantity: item.quantity,
        totalPrice: item.priceWithVat
      } as ToppingCartItem
    })
  }

  static orderToCustomerSearchResult(order: Order): CustomerSearchResultUi {
    return {
      id: order.customer.id,
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      city: order.deliveryCity,
      address: order.deliveryAddress,
      latitude: order.deliveryLocation.coordinates[1],
      longitude: order.deliveryLocation.coordinates[0]
    }
  }
}
