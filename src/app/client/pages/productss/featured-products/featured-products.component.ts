import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsItemComponent } from '../products-item/products-item.component';
import { ProductsService } from '../../../../service/products.service';
import { Product, Products } from '../../../../models/poduct.models';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductsItemComponent],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
})
export class FeaturedProductsComponent implements OnInit {
  ngOnInit() {
    this.getFeaturedProducts();
  }
  private productsService = inject(ProductsService);
  featureProducts = signal<Product[]>([]);

  getFeaturedProducts() {
    const productFilter = `?limit=7`;
    this.productsService.getData(productFilter).subscribe({
      next: (data) => {
        // التأكد من أن البيانات تحتوي على ما نحتاجه
        if (data && data.data) {
          this.featureProducts.set(data.data);
        } else {
          console.error('لم يتم العثور على بيانات المنتجات المميزة');
        }
      },
      error: (error) => {
        console.error('خطأ في جلب البيانات:', error);
      },
    });
  }
}
