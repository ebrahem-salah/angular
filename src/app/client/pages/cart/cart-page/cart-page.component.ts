import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../../../service/cart.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  private cartService = inject(CartService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  totalPriceAfterDisc = this.cartService.totalPriceAfterDisc;
  orderId = this.cartService.orderId;
  discountApplied = this.cartService.discountApplied;

  navigateToCheckOut() {
    this.router.navigateByUrl('/checkout');
  }
  // اضافه كوبون خصم
  applyCoupon(couponCode: string) {
    this.cartService.applyCoupon({ name: couponCode }).subscribe({
      next: () => {
        // عند نجاح الكوبون
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Discount applied successfully!',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Coupon is invalid or expired',
        });
      },
    });
  }

  // تحديث الكمية في السلة
  updateQuantity(cartId: string, quantity: number) {
    // التحقق من الكمية المتاحة

    this.cartService
      .update(cartId, { quantity } as unknown as number)
      .subscribe({
        // next: () => {
        //   this.loadCartItems(); // تحديث السلة بعد التعديل
        // },
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
      .subscribe();
  }

  ngOnInit() {
    // this.loadCartItems();
  }
  loadCartItems() { 
    // this.cartService.get().subscribe();
  }
}
