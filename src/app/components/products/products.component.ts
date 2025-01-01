import { SubCategoriesService } from './../../service/subCategories.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Product } from '../../models/poduct.models';
import { ProductsService } from '../../service/products.service';
import { SubCategory } from '../../models/subcategory.models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <h3>Products</h3>
    <ul>
      <li *ngFor="let product of products">
        {{ product.name }} - {{ product.price | currency }}
      </li>
    </ul>
  `,
})

export class ProductsComponent {
  @Input() subcategoryId!: string; // استقبال subcategoryId من المكون الأب
  products: any = [];

  constructor(
    private productsService: SubCategoriesService,
    private http: HttpClient
  ) {}

  ngOnChanges() {
    if (this.subcategoryId) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this.productsService
      .getProductsBySubCategory(this.subcategoryId)
      .subscribe((data) => {
        this.products = data.data;
      });
  }
}
