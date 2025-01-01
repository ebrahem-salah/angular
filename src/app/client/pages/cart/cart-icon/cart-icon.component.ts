import { Component, inject } from '@angular/core';
import { CartService } from '../../../../service/cart.service';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { TokenService } from '../../../../service/token.service';
import { RouterLink } from '@angular/router';
export const cartKey = 'cart';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, BadgeModule, RouterLink],
  // providers: [CartService],
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.scss',
})
export class CartIconComponent {
  private tokenService = inject(TokenService);
  checkout() {
    throw new Error('Method not implemented.');
  }
  private cartservice = inject(CartService);
  cartCount = this.cartservice.cartCount;
  cartPrice = this.cartservice.cartPrice;

  ngOnInit() {
    this.loadCart();
  }
  isUserLoggedIn(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  loadCart() {
    if (this.isUserLoggedIn()) {
      // طلب البيانات من الخادم
      this.cartservice.getAll().subscribe();
    }
  }
}
