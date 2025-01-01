import { Category } from '../models/category.models';
import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Categories, PaginationResult } from '../models/category.models';
import { Observable, tap } from 'rxjs';
import { SubCategories, SubCategory } from '../models/subcategory.models';
import { Products } from '../models/poduct.models';

@Injectable({
  providedIn: 'root',
})
export class SubCategoriesService {
  private apiService = inject(ApiService);
  url = '/subcategory';
  
  getProductsBySubCategory(id?: string): Observable<Products> {
    if (id) {
      return this.apiService.getAllData<Products>(
        `/subcategory/${id}/products`
      );
    } else return this.apiService.getAllData<Products>(`/subcategory`);
  }
  getAll(): Observable<SubCategories> {
    
    return this.apiService.getAllData<SubCategories>(this.url);
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
