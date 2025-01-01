import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Category } from '../../models/category.models';
import { SubCategory } from '../../models/subcategory.models';
import { SubCategoriesService } from '../../service/subCategories.service';
import { Product } from '../../models/poduct.models';
import { ProductsService } from '../../service/products.service';
import { ProductsComponent } from '../products/products.component';
import { CategoriesService } from '../../service/categories.service';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProductsComponent],

  template: `
    <h2>Subcategories</h2>
    <ul>
      <li
        *ngFor="let subCategory of subcategories"
        (click)="onSubCategorySelect(subCategory._id)"
      >
        {{ subCategory.name }}
        <!-- تضمين مكون المنتجات -->
        <app-products
          *ngIf="selectedSubCategoryId === subCategory._id"
          [subcategoryId]="subCategory._id"
        >
        </app-products>
      </li>
    </ul>
  `,
})
export class SubcategoriesComponent {
  private categoryService = inject(CategoriesService);
  private subCategoryService = inject(SubCategoriesService);
  @Input() categoryId!: string; // استقبال categoryId من المكون الرئيسي
  subcategories: SubCategory[] = [];
  selectedSubCategoryId: string | null = null;
  private productService = inject(ProductsService);
  products: any = [];

  ngOnChanges() {
    if (this.categoryId) {
      this.loadSubcategories();
    }
  }

  loadSubcategories() {
    this.categoryService.getSubCategory(this.categoryId).subscribe((data) => {
      this.subcategories = data.data;
      console.log(data.data);
    });
  }

  onSubCategorySelect(subCategoryId: string) {
    this.subCategoryService
      .getProductsBySubCategory(subCategoryId)
      .subscribe((data) => {
        this.products = data.data;
        console.log(data);
      });

    this.selectedSubCategoryId =
      this.selectedSubCategoryId === subCategoryId ? null : subCategoryId;
  }
}
