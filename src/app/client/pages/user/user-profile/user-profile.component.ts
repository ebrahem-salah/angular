import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../service/auth.service';
import { TokenService } from '../../../../service/token.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router';
import { CartService } from '../../../../service/cart.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    DropdownModule,
    ButtonModule,
    PanelModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private cartService = inject(CartService);
  user = this.authService.users;
  userName = this.authService.userName;

  ngOnInit(): void {}
  edit() {
    this.router.navigate(['/customer/account/edit/:' + this.user()?.slug]);
  }
  editAddress() {
    this.router.navigate(['/customer/account/address/:' + this.user()?.slug]);
  }
  logOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.userName = signal('Login');
        this.tokenService.clearTokens();
        this.cartService.clearCartState();
      },
    });
  }
}
