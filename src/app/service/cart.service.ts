import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Cart, Cartdata, CartItems, Coupon } from '../models/cart.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

export const cartKey = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiService = inject(ApiService);
  cartCount = signal<number>(0);
  cartPrice = signal<number>(0);
  cartItems = signal<CartItems[]>([]); // إشارة لعناصر السلة
  cartId = signal<string>('');
  cart = signal<Cartdata[]>([]);
  totalPrice = signal<number>(0);
  totalPriceAfterDisc = signal<number>(0);
  orderId = signal<string | undefined>('');
  discountApplied = signal<number>(0);
  private url = '/cart';

  constructor() {
    this.loadStoredCartData();
  }


  /** ✅ تحميل البيانات المحفوظة في sessionStorage عند بدء الخدمة */
  private loadStoredCartData() {
    const storedCart = sessionStorage.getItem('cartData');
    if (storedCart) {
      const cart: Cart = JSON.parse(storedCart);
      this.updateCartState(cart);
    }
  }

  /** ✅ تحديث بيانات السلة وحفظها في sessionStorage */
  private updateCartState(cart: Cart) {
    if (cart) {
      console.log(cart);
      this.cartCount.set(cart.numOfCartItems || 0);
      this.cartPrice.set(
        cart.data?.totalPriceAfterDiscount ?? cart.data?.totalPrice ?? 0
      );
      this.orderId.set(cart.data?._id);
      this.cartItems.set(cart.data.cartItems);
      this.totalPrice.set(cart.data?.totalPrice || 0);
      this.totalPriceAfterDisc.set(cart.data?.totalPriceAfterDiscount || 0);
      this.discountApplied.set(cart.discountApplied || 0);

      sessionStorage.setItem('cartData', JSON.stringify(cart));
    } else {
      this.clearCartState();
    }
  }

  /** ✅ مسح بيانات السلة عند تسجيل الخروج */
  clearCartState() {
    this.cartCount.set(0);
    this.cartPrice.set(0);
    this.cartItems.set([]);
    this.cartId.set('');
    sessionStorage.removeItem('cartData');
    sessionStorage.removeItem('cartId');
  }

  /** ✅ توحيد `get()` و `getAll()` في دالة واحدة */
  get(): Observable<Cart> {
    return this.apiService.getOne<Cart>(this.url).pipe(
      tap((cart) => {
        this.updateCartState(cart);
      })
    );
  }


  /** ✅ إضافة عنصر للسلة */
  add(cartItems: CartItems): Observable<Cart> {
      return this.apiService
        .addNewData<Cart>(this.url, cartItems as unknown as Cart)
        .pipe(tap((cart) => this.updateCartState(cart)));
    
  }

  /** ✅ تحديث الكمية */
  update(id: string, quantity: number): Observable<Cart> {
    return this.apiService
      .updateData<Cart>(`${this.url}/update/${id}`, quantity as unknown as Cart)
      .pipe(tap((cart) => this.updateCartState(cart)));
  }

  /** ✅ إزالة عنصر من السلة */
  remove(cartId: string): Observable<Cart> {
    localStorage.removeItem('cart');
    return this.apiService
      .deleteData<Cart>(`${this.url}/${cartId}`)
      .pipe(tap((cart) => this.updateCartState(cart)));
  }

  /** ✅ تطبيق الكوبون */
  applyCoupon(data: { name: string }): Observable<Cart> {
    return this.apiService
      .updateData<Cart>(`${this.url}/applyCoupon`, data as unknown as Cart)
      .pipe(
        tap((cart) => {
          this.totalPriceAfterDisc.set(cart.totalPriceAfterDiscount!);
          this.discountApplied.set(cart.discountApplied);
        })
      );
  }
}
