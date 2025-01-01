import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../../service/users.service';
import { TokenService } from '../../../service/token.service';

@Component({
  selector: 'admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SidebarModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private usersService = inject(UsersService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  logout() {
    const subscribtion = this.usersService.logout().subscribe({
      next: () => {
        this.tokenService.clearTokens();
        localStorage.removeItem('username');
        this.router.navigate(['/']);
      },
    });
    this.destroyRef.onDestroy(() => subscribtion.unsubscribe());
  }
}
