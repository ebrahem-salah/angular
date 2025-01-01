import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

import { Observable, tap } from 'rxjs';
import { Brand, Brands } from '../models/brands.models';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private apiService = inject(ApiService);
  category = signal<Brands[]>([]);
  url = '/brands';
  getAll(): Observable<Brands> {
    return this.apiService.getAllData<Brands>(this.url);
  }
  add(Brand: Brand): Observable<Brand> {
    return this.apiService.addNewData<Brand>(this.url, Brand);
  }
  delete(BrandId: string): Observable<Brand> {
    return this.apiService.deleteData<Brand>(`${this.url}/${BrandId}`);
  }
  get(BrandId: string): Observable<Brand> {
    return this.apiService.getOne<Brand>(`${this.url}/${BrandId}`);
  }
  update(id: string, Brand: Brand): Observable<Brand> {
    return this.apiService.updateData<Brand>(`${this.url}/` + id, Brand);
  }
}
