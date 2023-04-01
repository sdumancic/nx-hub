import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, find, Observable } from "rxjs";
import { FOOD_API_BACKEND_URL } from "@hub/shared/util/app-config";
import { CartItem, ToppingCartItem } from "@hub/shared/model/food-models";
import { MealToppingChange } from "../model/meal-topping-change.interface";



@Injectable()
export class CartInMemoryService {

  private readonly cartItems$: BehaviorSubject<CartItem[]>;

  constructor(
    @Inject(FOOD_API_BACKEND_URL) private url: string,
    private readonly http: HttpClient
  ) {
    this.cartItems$ = new BehaviorSubject<CartItem[]>([]);
  }

  addCartItem(cartItem: CartItem){
    this.cartItems$.next([...this.cartItems$.value, cartItem])
  }

  public setCartItems(items: CartItem[]){
    this.cartItems$.next(items);
  }

  public addOrUpdateCartItem(cartItem: CartItem){
    const existingCartItem = this.getCartItems().find(i => i.meal.id === cartItem.meal.id);
    if (existingCartItem != null){
      existingCartItem.quantity = existingCartItem.quantity + cartItem.quantity;
      existingCartItem.totalPriceNoVat = existingCartItem.totalPriceNoVat + (cartItem.meal.price * cartItem.quantity);
      existingCartItem.totalPriceWithVat = existingCartItem.totalPriceWithVat + (cartItem.meal.price * cartItem.quantity);
      this.cartItems$.next([...this.getCartItems()]);
    } else {
      this.addCartItem(cartItem);
    }

  }

  getCartItems$():Observable<CartItem[]>{
    return this.cartItems$.asObservable();
  }

  getCartItems():CartItem[]{
    return this.cartItems$.value;
  }


  /**
   * Adds or updates topping on specific cart item
   * @param mealId
   * @param toppingId
   * @param quantity
   * @param toppingPrice
   */
  public addOrUpdateToppingForCartItem(mealToppingChange: MealToppingChange){
    const {mealId, toppingId, toppingName,  toppingPrice, quantity} = mealToppingChange;
    const existingCartItem = this.getCartItems().find(i => i.meal.id === mealId);

    if (existingCartItem != null){
      const foundCartItemIndex = existingCartItem.toppings?.findIndex(topping => topping.toppingId === toppingId);
      const newToppingCartItem: ToppingCartItem = {
        toppingId: toppingId,
        toppingName: toppingName,
        toppingPrice: toppingPrice,
        quantity:quantity,
        totalPrice: toppingPrice * quantity
      }
      if (foundCartItemIndex === -1) {
        existingCartItem.toppings = [...existingCartItem.toppings, newToppingCartItem];
      } else {
        const copy = [...existingCartItem.toppings];
        if (quantity === 0){
          copy.splice(foundCartItemIndex, 1);
        } else {
          copy.splice(foundCartItemIndex, 1, newToppingCartItem);
        }
        existingCartItem.toppings = copy;
      }
      this.cartItems$.next([...this.getCartItems()]);
    } else {
      throw new Error("CartItem does not exist");
    }
  }

}
