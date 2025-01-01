import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import {
  Categories,
  Category,
  PaginationResult,
} from '../models/category.models';
import { Observable, tap } from 'rxjs';
import { SubCategories, SubCategory } from '../models/subcategory.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiService = inject(ApiService);
  category = signal<Category[]>([]);
  subCategory = signal<SubCategory[]>([]);

  url = '/category';

  getAll(categoryId?: string): Observable<Categories> {
    return this.apiService.getAllData<Categories>(`${this.url}`).pipe(
      tap((data) => {
        this.category.set(data.data);
      })
    );
  }

  getSubCategory(categoryId?: string): Observable<SubCategories> {
    if (categoryId) {
      return this.apiService.getAllData<SubCategories>(
        `${this.url}/${categoryId}/subcategory`
      ).pipe(
        tap((data) => {
          this.subCategory.set(data.data);
        })
      );
    }
    return this.apiService.getAllData<SubCategories>(`${this.url}`);
  }
  add(category: Category): Observable<Category> {
    return this.apiService.addNewData<Category>(this.url, category);
  }
  delete(categoryId: string): Observable<Category> {
    return this.apiService.deleteData<Category>(`${this.url}/${categoryId}`);
  }
  get(categoryId: string): Observable<Category> {
    return this.apiService.getOne<Category>(`${this.url}/${categoryId}`);
  }
  update(id: string, category: Category): Observable<Category> {
    return this.apiService.updateData<Category>(`${this.url}/` + id, category);
  }
}
