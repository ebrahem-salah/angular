import { Component, inject } from '@angular/core';
import { CartService } from '../../../../service/cart.service';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { TokenService } from '../../../../service/token.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, BadgeModule, RouterLink],
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.scss',
})
export class CartIconComponent {
  private tokenService = inject(TokenService);
  private cartservice = inject(CartService);

  cartCount = this.cartservice.cartCount;
  cartPrice = this.cartservice.cartPrice;
  

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    if (this.tokenService.isUserLoggedIn()) {
      if (!this.cartCount())
        // طلب البيانات من الخادم
        this.cartservice.get().subscribe();
    }
  }
}
