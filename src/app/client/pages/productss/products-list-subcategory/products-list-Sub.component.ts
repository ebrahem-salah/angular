import { Component,  inject, Input, signal } from '@angular/core';
import { ProductsItemComponent } from '../products-item/products-item.component';
import { ProductsService } from '../../../../service/products.service';
import { CategoriesService } from '../../../../service/categories.service';
import { Category } from '../../../../models/category.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeSelectModule } from 'primeng/treeselect';

@Component({
  selector: 'app-products-list-sub',
  standalone: true,
  imports: [
    ProductsItemComponent,
    FormsModule,
    CommonModule,
    CheckboxModule,
    TreeSelectModule,
    
  ],
  templateUrl: './products-list-Sub.component.html',
  styleUrl: './products-list-Sub.component.scss',
})
export class ProductsListSubComponent {
  private categoryService = inject(CategoriesService);
  private productService = inject(ProductsService);
  products = this.productService.product;
  category: Category[] = [];
  isCategoryPage?: boolean;
  loading: boolean = false;
  subCategory = this.categoryService.subCategory;
  selectedCategoryIds: string[] = [];
  // ngOnInit() {
  //   const subscription = this.activatedRoute.params.subscribe((params) => {
  //     params['categoryId']
  //       ? this.getAllProducts([params['categoryId']])
  //       : this.getAllProducts(this.selectedCategoryIds);

  //     params['categoryId']
  //       ? (this.isCategoryPage = true)
  //       : (this.isCategoryPage = false);
  //   });
  //   this.getCategories();
  //   this.destroyRef.onDestroy(() => subscription.unsubscribe());
  // }

  // getAllProducts(categorFilter?: string[]) {
  //   const subscription = this.productService
  //     .getAll(categorFilter)
  //     .subscribe((data) => this.products.set(data.data));
  //   console.log(this.products());
  //   this.destroyRef.onDestroy(() => subscription.unsubscribe());
  // }
  // getCategories() {
  //   const subscription = this.categoryService
  //     .getAll()
  //     .subscribe((data) => (this.category = data.data));
  //   this.destroyRef.onDestroy(() => subscription.unsubscribe());
  // }
  // categoryFilter() {
  //   this.selectedCategoryIds = this.category
  //     .filter((category) => category.checked)
  //     .map((category) => category._id);

  //   if (this.selectedCategoryIds) {
  //     this.getAllProducts(this.selectedCategoryIds);
  //   } else {
  //     this.getAllProducts();
  //   }
  // }
}
