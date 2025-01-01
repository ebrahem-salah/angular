import { ProductsService } from './../../../../service/products.service';
import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Cart, Cartdata, CartItems } from '../../../../models/cart.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OrdersService } from '../../../../service/orders.service';
import { Order } from '../../../../models/orders.models.';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputNumberModule,
    TableModule,
    TagModule,
    RatingModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  cartItems = signal<CartItems[]>([]);
  cartdata = signal<Cart[]>([]);
  cart = signal<Cartdata[]>([]);
  cartId = signal<Cartdata[]>([]);
  quantity = signal<number>(0);
  totalPrice = signal<number>(0);
  total = signal<number>(0);
  totalPriceAfterDisc = signal<number>(0);
  orderId = signal<string | undefined>('');

  navgiteToCheckOut(orderId: string) {
    this.ordersService.checkout(orderId).subscribe((data) => console.log(data));
  }

  // تحديث الكمية في السلة
  updateQuantity(cartId: string, quantity: number) {
    // التحقق من الكمية المتاحة

    this.cartService
      .update(cartId, { quantity } as unknown as number)
      .subscribe({
        next: () => {
          this.loadCartItems(); // تحديث السلة بعد التعديل
        },
        error: (err) => {
          console.error('Error updating quantity:', err);
          if (err.status === 400) {
            alert(err.message); // عرض رسالة الخطأ للمستخدم
          } else {
            alert('حدث خطأ في تحديث الكمية');
          }
        },
      });
  }

  // الحصول على الكمية المتاحة في المخزون للمنتج

  removeItem(cardId: string) {
    this.cartService
      .remove(cardId)
      .subscribe({ next: () => this.loadCartItems() });
  }

  ngOnInit() {
    this.loadCartItems();
  }
  loadCartItems() {
    this.cartService.getAll().subscribe((data) => {
      console.log(data);
      this.orderId.set(data.data._id);
      this.cartItems.set(data.data.cartItems);
      this.totalPrice.set(data.data.totalPrice || 0);
      this.cartId.set(data.data._id as unknown as Cartdata[]);
      this.cart.set(data.data as unknown as Cartdata[]);
      this.totalPriceAfterDisc.set(data.data.totalPriceAfterDiscount || 0);
    });
  }
}
