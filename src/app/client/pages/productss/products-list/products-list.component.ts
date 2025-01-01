import { ActivatedRoute, Router } from '@angular/router';
import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { ProductsItemComponent } from '../products-item/products-item.component';
import { ProductsService } from '../../../../service/products.service';
import { CategoriesService } from '../../../../service/categories.service';
import { Category } from '../../../../models/category.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeSelectModule } from 'primeng/treeselect';
import { SubCategory } from '../../../../models/subcategory.models';
import { SubCategoriesComponent } from '../../subCategory/subCategories/subCategories.component';
import { SubCategoriesService } from '../../../../service/subCategories.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    ProductsItemComponent,
    FormsModule,
    CommonModule,
    CheckboxModule,
    TreeSelectModule,
    SubCategoriesComponent,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  private categoryService = inject(CategoriesService);
  private subCategoryService = inject(SubCategoriesService);
  private productService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  products = this.productService.products;
  category: Category[] = [];
  isCategoryPage?: boolean;
  loading: boolean = false;
  subCategory = this.categoryService.subCategory;

  ngOnInit() {
    const subscription = this.activatedRoute.params.subscribe((params) => {
      params['categoryId']
        ? this.getAllProducts([params['categoryId']])
        : this.getAllProducts();
      params['categoryId']
        ? (this.isCategoryPage = true)
        : (this.isCategoryPage = false);
    });
    this.getCategories();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  getAllProducts(categorFilter?: string[]) {
    const subscription = this.productService
      .getAll(categorFilter)
      .subscribe((data) => this.products.set(data.data));
    console.log(this.products());
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  getCategories() {
    const subscription = this.categoryService
      .getAll()
      .subscribe((data) => (this.category = data.data));
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  categoryFilter() {
    const selectedCategoryIds = this.category
      .filter((category) => category.checked)
      .map((category) => category._id);

    if (selectedCategoryIds.length > 0) {
      this.getAllProducts(selectedCategoryIds);
      this.router.navigate([`/categories`, { selectedCategoryIds }]); // تحديث المسار
    } else {
      this.getAllProducts();
      this.router.navigate([`/categories`]); // العودة إلى عرض الكل
    }
  }

  subCategoryFilter(subCategoryId: string) {
    this.getAllProducts([subCategoryId]);
    this.router.navigate([
      // `/categories/${this.categoryId}/subcategories/${subCategoryId}/products`
    ]); // التنقل الديناميكي
  }
}
