import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { RouterLink } from '@angular/router';
import { CartIconComponent } from '../../pages/cart/cart-icon/cart-icon.component';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../service/token.service';
import { SearchComponent } from '../../search/search/search.component';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    ToolbarModule,
    RouterLink,
    CartIconComponent,
    CommonModule,
    SearchComponent,
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss',
})
export class MenubarComponent implements OnInit {
  private tokenService = inject(TokenService);

  username: string | undefined;
  ngOnInit(): void {
    this.isUserLoggedIn();
  }

  isUserLoggedIn(): boolean {
    this.username = localStorage.getItem('username')?.toString();
    return !!this.tokenService.getAccessToken();
  }
}
