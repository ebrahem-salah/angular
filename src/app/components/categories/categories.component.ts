import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Category } from '../../models/category.models';
import { CategoriesService } from '../../service/categories.service';
import { SubCategoriesComponent } from '../../client/pages/subCategory/subCategories/subCategories.component';
import { SubcategoriesComponent } from '../subcategories/subcategories.component';
import { SubCategory } from '../../models/subcategory.models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, SubcategoriesComponent],

  template: `
    <ul>
      <li
        *ngFor="let category of categories"
        (click)="onCategorySelect(category._id)"
      >
        {{ category.name }}
        <!-- تضمين المكون الفرعي لعرض التصنيفات الفرعية -->
        <app-subcategories
          *ngIf="selectedCategoryId === category._id"
          [categoryId]="category._id"
        >
        </app-subcategories>
      </li>
    </ul>
  `,
})

export class CategoriesComponent {
  private categoryService = inject(CategoriesService);
  private destroyref = inject(DestroyRef);

  categories: Category[] = [];
  selectedCategoryId: string | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data.data;
      console.log(data);
    });
  }

  onCategorySelect(categoryId: string) {
    console.log(categoryId);
    this.selectedCategoryId =
      this.selectedCategoryId === categoryId ? null : categoryId;
  }
}
