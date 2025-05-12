import { Component, inject, input, Input, signal } from '@angular/core';
import { Product } from '../../../../models/poduct.models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../service/cart.service';
import { Cart, Cartdata, CartItems } from '../../../../models/cart.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TokenService } from '../../../../service/token.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-products-item',
  standalone: true,
  imports: [CommonModule, RouterLink, ToastModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './products-item.component.html',
  styleUrl: './products-item.component.scss',
})
export class ProductsItemComponent {
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private tokenService = inject(TokenService);

  product = input<Product>();
  hover: boolean = false;

  addToCart() {
    const cartItem: CartItems = {
      productId: this.product()?._id as string,
      name: this.product()?.name,
      color: this.product()?.colors?.[0], // Assuming the first color is selected
      quantity: 1,
    };
  
    if (!this.tokenService.isUserLoggedIn()) {
      // إذا لم يكن المستخدم مسجل دخول، خزّن المنتج في localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
  
      // تحقق إذا كان المنتج موجودًا مسبقًا
      const existingItem = guestCart.find((item: CartItems) => 
        item.productId === cartItem.productId && item.color === cartItem.color
      );
  
      if (existingItem) {
        // إذا كان المنتج موجودًا، قم بزيادة الكمية
        existingItem.quantity += cartItem.quantity;
      } else {
        // إذا لم يكن موجودًا، أضفه إلى السلة
        guestCart.push(cartItem);
      }
  
      // حفظ السلة المحدثة في localStorage
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
  
      // إظهار رسالة
      return this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Item added to guest cart',
      });
    } else {
      // إذا كان المستخدم مسجل دخول، أرسل الطلب إلى الخادم
      this.cartService.add(cartItem).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item added to cart',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error adding item to cart',
          });
        },
      });
    }
  }
  
  // addToCart() {
  //   const cartItem: Cart | CartItems | Cartdata = {

  //     productId: this.product()?._id as string,
  //     name: this.product()?.name,
  //     color: this.product()?.colors?.[0], // Assuming the first color is selected//+
  //     quantity: 1,
  //   };

  //   if (!this.tokenService.isUserLoggedIn()) {
  //     // If user is not logged in, add product to guest cart in localStorage

  //     return this.messageService.add({
  //       severity: 'info',
  //       summary: 'Info',
  //       detail: 'please login to add to cart',
  //     });
  //   } else {
  //     // If user is logged in, send request to the server
  //     this.cartService.add(cartItem).subscribe({
  //       next: () => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'success',
  //           detail: 'Item added to cart',
  //         });
  //       },
  //       error: () => {
  //         this.messageService.add({
  //           severity: 'wroing',
  //           summary: 'wroing',
  //           detail: 'Error adding item to cart',
  //         });
  //       },
  //     });
  //   }
  // }

}
