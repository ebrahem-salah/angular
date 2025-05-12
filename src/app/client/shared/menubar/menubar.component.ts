import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { RouterLink } from '@angular/router';
import { CartIconComponent } from '../../pages/cart/cart-icon/cart-icon.component';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../service/token.service';
import { SearchComponent } from '../../search/search/search.component';
import { UserIconComponent } from "../../pages/user/user-icon/user-icon.component";

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    ToolbarModule,
    RouterLink,
    CartIconComponent,
    CommonModule,
    SearchComponent,
    UserIconComponent
],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss',
})
export class MenubarComponent implements OnInit {
  private tokenService = inject(TokenService);

  
  ngOnInit(): void {
    this.isUserLoggedIn();
  }

  isUserLoggedIn(): boolean {
    if(this.tokenService.getAccessToken()){

      // this.username = localStorage.getItem('username')
    }
    return !!this.tokenService.getAccessToken();
  }
}
