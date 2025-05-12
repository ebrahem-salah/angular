import { ActivatedRoute, Router } from '@angular/router';
import { Component, DestroyRef, inject } from '@angular/core';
import { ProductsItemComponent } from '../products-item/products-item.component';
import { ProductsService } from '../../../../service/products.service';
import { CategoriesService } from '../../../../service/categories.service';
import { Category } from '../../../../models/category.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeSelectModule } from 'primeng/treeselect';
import { SubCategoriesComponent } from '../../subCategory/subCategories/subCategories.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
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
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  private categoryService = inject(CategoriesService);
  private productService = inject(ProductsService);
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  products = this.productService.product;
  selectedCategoryIds: string[] = [];
  category: Category[] = [];
  isCategoryPage?: boolean;
  loading: boolean = false;
  currentPage = 1;
  limit = 10;
  paginationResult = this.productService.paginationResult;
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

  // getAllProducts(categorFilter?: string[]) {
  //   const subscription = this.productService
  //     .getAll(categorFilter)
  //     .subscribe((data) => this.products.set(data.data));
  //   console.log(this.products());
  //   this.destroyRef.onDestroy(() => subscription.unsubscribe());
  // }

  getCategories() {
    const subscription = this.categoryService
      .getAll()
      .subscribe((data) => (this.category = data.data));
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  categoryFilter(id?: string) {
    // this.selectedCategoryIds = this.category
    //   .filter((category) => category.checked)
    //   .map((category) => category._id);

    // this.getAllProducts(
    //   this.selectedCategoryIds.length ? this.selectedCategoryIds : []
    // ); // ✅ تمرير القيم فقط إذا وُجدت.
    if (id) {
      // إذا كان المعرف موجودًا، نقوم بإضافته أو إزالته من القائمة
      const index = this.selectedCategoryIds.indexOf(id);
      if (index === -1) {
        this.selectedCategoryIds.push(id);
      } else {
        this.selectedCategoryIds.splice(index, 1);
      }
    }
    // ✅ تمرير القيم المختارة فقط
    this.getAllProducts(
      this.selectedCategoryIds.length ? this.selectedCategoryIds : []
    );
  }

  getAllProducts(categoryFilter?: string[]) {
    console.log('جلب المنتجات بناءً على التصنيفات:', categoryFilter);

    const subscription = this.productService
      .getAll(categoryFilter, this.currentPage, this.limit) // ✅ تمرير `page` و `limit`
      .subscribe((data) => {
        this.products.set(data.data);
        console.log('المنتجات المحملة:', data.data);
      });

    // ✅ إلغاء الاشتراك عند تدمير المكون
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  getSelectedCategories(): string[] {
    return this.category
      .filter((category) => category.checked)
      .map((category) => category._id);
  }

  prevPage() {
    if (this.productService.paginationResult()?.prev) {
      this.currentPage = this.productService.paginationResult()!.prev;
      this.getAllProducts(this.selectedCategoryIds); // ✅ إرسال التصنيفات المحددة
    }
  }

  nextPage() {
    if (this.productService.paginationResult()?.next) {
      this.currentPage = this.productService.paginationResult()!.next;
      console.log('1');
      this.getAllProducts(this.selectedCategoryIds); // ✅ إرسال التصنيفات المحددة
    }
  }

  loadMore() {
    this.currentPage++; // ✅ زيادة رقم الصفحة عند النقر
    this.productService
      .getAll([], this.currentPage, this.limit)
      .subscribe((data) => {
        const newProducts = data.data;
        const existingProducts = this.productService.product();
        this.productService.product.update(() => [
          ...existingProducts,
          ...newProducts,
        ]); // ✅ دمج المنتجات الجديدة مع القديمة
      });
  }
}
