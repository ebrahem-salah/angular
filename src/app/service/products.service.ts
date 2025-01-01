import { refreshTokenInterceptor } from './jwt.interceptor';
import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { Products, Product } from '../models/poduct.models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiService = inject(ApiService);
  private readonly url = '/products';
  productCount = signal(0);
  products = signal<Product[]>([]);
  product = signal<Product[]>([]);
  searchProducts = signal<Product[]>([]);

  /**
   * جلب جميع المنتجات مع دعم الفلاتر لتحديد التصنيفات.
   * @param categoryFilter قائمة تصنيفات المنتجات.
   */
  getAll(categoryFilter?: string[]): Observable<Products> {
    const params: any = {};

    // إضافة الفئات إذا وُجدت
    if (categoryFilter && categoryFilter.length > 0) {
      params.category = categoryFilter.join(',');
    }

    // إضافة مصطلح البحث إذا وُجد
    return this.apiService.getAllData<Products>(this.url, params).pipe(
      tap((data: Products) => {
        this.productCount.set(data.data.length);
        this.products.set(data.data);
        this.product.set(data.data);
      })
    );
  }
  getProductsBySubCategory(id?: string): Observable<Products> {
    if (id) {
      return this.apiService.getAllData<Products>(
        `/subcategory/${id}/products`
      );
    }
    return this.apiService.getAllData<Products>(this.url);
  }

  getSearches(searchTrem?: string): Observable<Products> {
    const params: any = {};
    if (searchTrem) {
      params.keyword = searchTrem;
    }
    return this.apiService.getAllData<Products>(this.url, params).pipe(
      tap((data: Products) => {
        this.searchProducts.set(data.data);
      })
    );
  }

  /**
   * إضافة منتج جديد إلى السلة.
   * @param product كائن يحتوي على بيانات المنتج الجديد.
   */
  add(product: Product): Observable<Product> {
    return this.apiService.addNewData<Product>(this.url, product);
  }

  /**
   * حذف منتج من السلة باستخدام معرّف المنتج.
   * @param productId معرّف المنتج الذي سيتم حذفه.
   */
  delete(productId: string): Observable<Product> {
    return this.apiService.deleteData<Product>(`${this.url}/${productId}`);
  }

  /**
   * جلب بيانات منتج معين باستخدام معرّف المنتج.
   * @param productId معرّف المنتج.
   */
  get(productId: string): Observable<Product> {
    return this.apiService.getOne<Product>(`${this.url}/${productId}`);
  }

  /**
   * تحديث بيانات منتج موجود.
   * @param id معرّف المنتج الذي سيتم تحديثه.
   * @param product البيانات الجديدة للمنتج.
   */
  update(id: string, product: Product): Observable<Product> {
    return this.apiService.updateData<Product>(`${this.url}/${id}`, product);
  }

  /**
   * جلب بيانات منتج أو مجموعة من المنتجات.
   * @param product معرّف منتج معين (اختياري).
   */
  getData(product?: string): Observable<Products> {
    const endpoint = product ? `${this.url}/${product}` : this.url;
    return this.apiService.getAllData<Products>(endpoint);
  }
}
