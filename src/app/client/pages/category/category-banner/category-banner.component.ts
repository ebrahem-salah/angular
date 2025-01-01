import { Category } from '../../../../models/category.models';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CategoriesService } from '../../../../service/categories.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SubCategory } from '../../../../models/subcategory.models';

@Component({
  selector: 'app-category-banner',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CascadeSelectModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './category-banner.component.html',
  styleUrl: './category-banner.component.scss',
})
export class CategoryBannerComponent implements OnInit {
  private categoryService = inject(CategoriesService);
  private destroyref = inject(DestroyRef);
  subCategory = signal<SubCategory[]>([]);
  // subCategory = output<SubCategory[]>();
  category = signal<Category[]>([]);
  selectedCategoryId: string | null = null;

  getCategories() {
    const subscription = this.categoryService.getAll().subscribe({
      next: (data) => {
        this.category.set(data.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.destroyref.onDestroy(() => subscription.unsubscribe());
  }

  ngOnInit() {
    this.getCategories();
    // this.getSubCategories();
  }
  onCategorySelect(categoryId: string) {
    this.selectedCategoryId =
      this.selectedCategoryId === categoryId ? null : categoryId;

    if (categoryId) {
      this.categoryService
        .getSubCategory(categoryId as unknown as string)
        .subscribe((data) => {
          this.subCategory.set(data.data);
          console.log(data.data);
        });
    }
  }
}
