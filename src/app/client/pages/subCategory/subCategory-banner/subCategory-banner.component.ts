import { Categories, Category } from '../../../../models/category.models';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../../service/categories.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SubCategory } from '../../../../models/subcategory.models';

@Component({
  selector: 'app-subCategory-banner',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CascadeSelectModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './subCategory-banner.component.html',
  styleUrl: './subCategory-banner.component.scss',
})
export class SubCategoryBannerComponent implements OnInit {
  private categoryService = inject(CategoriesService);
  private destroyref = inject(DestroyRef);
  categories: Category[] = [];
  subCategory = signal<SubCategory[]>([]);
  category = signal<Category[]>([]);

  options?: { label: string; value: string }[] = [];

  getCategories() {
    const subscription = this.categoryService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.categories = data.data;
        this.options = data.data.map((cat) => ({
          label: cat.name,
          value: cat._id,
        }));
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.destroyref.onDestroy(() => subscription.unsubscribe());
  }

  ngOnInit() {
    this.getCategories();
    this.get();
  }

  get() {
    const subscription = this.categoryService.getAll().subscribe({
      next: (data) => {
        this.category.set(data.data); // تعيين المصفوفة documents
      },
      error(err) {
        console.log('Error fetching product:', err);
      },
    });

    this.destroyref.onDestroy(() => subscription.unsubscribe());
  }

  onCategoryChange(categoryId: string): void {
    if (categoryId) {
      // جلب Subcategories بناءً على Category ID
      this.categoryService.getAll(categoryId).subscribe({
        next: (data) => {
          this.subCategory.set(
            data.data.map((item: Category) => ({
              ...item,
              category: item, // ربط التصنيف الفرعي بالتصنيف الرئيسي
            }))
          );
          console.log(data.data);
        },
      });
    } else {
      // إذا لم يتم اختيار Category، قم بإعادة تعيين Subcategories
      this.subCategory.set([]);
    }
  }
}
