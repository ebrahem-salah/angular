import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cart, Cartdata, CartItems } from '../models/cart.model';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

export const cartKey = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);
  cartCount = signal<number>(0);
  cartPrice = signal<number>(0);

  private url = '/cart';

  getAll(): Observable<Cart> {
    return this.apiService.getAllData<Cart>(this.url).pipe(
      tap((cart: Cart) => {
        const count: number = cart.numOfCartItems || 0;
        const price: number =
          cart.data?.totalPriceAfterDiscount ?? (cart.data?.totalPrice || 0);
        this.cartCount.set(count);
        this.cartPrice.set(price);
      })
    );
  }

  add(cartItems: CartItems): Observable<Cart> {
    return this.apiService
      .addNewData<Cart>(this.url, cartItems as unknown as Cart)
      .pipe(
        tap((cart: Cart) => {
          const count: number = cart.numOfCartItems || 0;
          const price: number =
            cart.data?.totalPriceAfterDiscount ?? (cart.data?.totalPrice || 0);
          this.cartCount.update(() => count);
          this.cartPrice.update(() => price);
        })
      );
  }
  remove(cartId: string) {
    return this.apiService.deleteData<CartItems>(`${this.url}/${cartId}`);
  }

  update(id: string, quantity: number): Observable<any> {
    return this.apiService.updateData<number>(
      `${this.url}/update/${id}`,
      quantity
    );
  }

}
