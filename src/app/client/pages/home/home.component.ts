import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../service/products.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MenubarComponent } from '../../shared/menubar/menubar.component';
import { RouterOutlet } from '@angular/router';
import { BannerComponent } from '../../../ui/banner/banner.component';
import { CategoryBannerComponent } from '../category/category-banner/category-banner.component';
import { FeaturedProductsComponent } from '../productss/featured-products/featured-products.component';
import { ProductsListComponent } from '../productss/products-list/products-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenubarComponent,
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    BannerComponent,
    CategoryBannerComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
