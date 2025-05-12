import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../service/auth.service';
import { TokenService } from '../../../../service/token.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-icon',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.scss',
})
export class UserIconComponent implements OnInit {
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  users = this.authService.users;
  userName = this.authService.userName;
  isLoggedIn = false; // للتحقق من حالة تسجيل الدخول

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoggedIn = this.tokenService.isUserLoggedIn();
    if (this.isLoggedIn) {
      if (!this.users()) {
        this.authService.myAccount().subscribe({});
      }
    }
  }
}
