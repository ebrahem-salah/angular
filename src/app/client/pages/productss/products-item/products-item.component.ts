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
import { SubCategory } from '../../../../models/subcategory.models';

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
    if (!this.isUserLoggedIn()) {
      // If user is not logged in, add product to guest cart in localStorage
      return this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'please login to add to cart',
      });
    } else {
      const cartItem: Cart | CartItems | Cartdata = {
        productId: this.product()?._id as string,
        name: this.product()?.name,
        color: this.product()?.colors?.[0], // Assuming the first color is selected//+
        quantity: 1,
      };

      // If user is logged in, send request to the server
      this.cartService.add(cartItem).subscribe((data) => console.log(data));
    }
  }

  // Check if the user is logged in
  isUserLoggedIn(): boolean {
    // return !!localStorage.getItem('accessToken'); // تحقق إذا كان التوكن موجودًا في localStorage
    return !!this.tokenService.getAccessToken();
  }
}
