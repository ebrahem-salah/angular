import { Category } from '../models/category.models';
import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Categories, PaginationResult } from '../models/category.models';
import { Observable, of, tap } from 'rxjs';
import { SubCategories, SubCategory } from '../models/subcategory.models';
import { Products } from '../models/poduct.models';

@Injectable({
  providedIn: 'root',
})
export class SubCategoriesService {
  private apiService = inject(ApiService);
  subCategory = signal<SubCategory[]>([]);

  url = '/subcategory';

  getProductsBySubCategory(id: string): Observable<Products> {
    const endpoint = id ? `${this.url}/${id}/products` : this.url;
    if(id){
      return this.apiService.getAllData<Products>(endpoint);
    }
    
    return of(); // إرجاع Observable فارغ (RxJS)
  }
  getAll(): Observable<SubCategories> {
    return this.apiService.getAllData<SubCategories>(this.url).pipe(
      tap((data) => {
        this.subCategory.set(data.data);
      })
    );
  }
  add(category: SubCategory): Observable<SubCategory> {
    return this.apiService.addNewData<SubCategory>(this.url, category);
  }
  delete(subCategoryId: string): Observable<SubCategory> {
    return this.apiService.deleteData<SubCategory>(
      `${this.url}/${subCategoryId}`
    );
  }
  get(subCategoryId: string): Observable<SubCategory> {
    return this.apiService.getOne<SubCategory>(`${this.url}/${subCategoryId}`);
  }
  update(id: string, subcategory: SubCategory): Observable<SubCategory> {
    return this.apiService.updateData<SubCategory>(
      `${this.url}/` + id,
      subcategory
    );
  }
}
