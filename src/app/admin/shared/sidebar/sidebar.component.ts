import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../../service/users.service';
import { TokenService } from '../../../service/token.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SidebarModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService)
  logout() {
    const subscribtion = this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('username');
        this.router.navigate(['/']);
        
      },
    });
    this.destroyRef.onDestroy(() => subscribtion.unsubscribe());
  }
}
