import { SubCategory } from './../../../../models/subcategory.models';
import { Component, inject, Input, input, OnInit } from '@angular/core';

import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TreeSelectModule } from 'primeng/treeselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { SubCategoriesService } from '../../../../service/subCategories.service';
import { ProductsService } from '../../../../service/products.service';

@Component({
  selector: 'app-subCategories',
  standalone: true,
  imports: [
    MegaMenuModule,
    MenuModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    TreeSelectModule,
    CheckboxModule,
    ListboxModule,
  ],
  templateUrl: './subCategories.component.html',
  styleUrl: './subCategories.component.scss',
})
export class SubCategoriesComponent implements OnInit {
  private subCategoryService = inject(SubCategoriesService);
  private productService = inject(ProductsService);

  products = this.productService.product;

  Products(id: string) {
    this.subCategoryService.getProductsBySubCategory(id).subscribe({
      next: (data) => {
        this.products.set(data.data);
      },
    });
  }
  subcategory = input<SubCategory[]>();
  ngOnInit() {
  }

}
