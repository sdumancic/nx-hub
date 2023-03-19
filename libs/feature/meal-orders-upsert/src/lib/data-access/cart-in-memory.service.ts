import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, find, Observable } from "rxjs";
import { FOOD_API_BACKEND_URL } from "@hub/shared/util/app-config";
import { CartItem } from "@hub/shared/model/food-models";



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
      existingCartItem.totalPriceNoVat = cartItem.meal.price * cartItem.quantity;
      existingCartItem.totalPriceWithVat = cartItem.meal.price * cartItem.quantity;
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
}
