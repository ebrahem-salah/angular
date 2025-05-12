import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { EMPTY, map, Observable, of, tap } from 'rxjs';
import { Products, Product, PaginationResult } from '../models/poduct.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiService = inject(ApiService);
  private readonly url = '/products';
  productCount = signal(0);
  product = signal<Product[]>([]);
  products = signal<Products[]>([]);
  searchProducts = signal<Product[]>([]);
  paginationResult = signal<PaginationResult | undefined>(undefined); // ✅ ت

  private http = inject(HttpClient);
  private readonly URL = environment.Url;

  
  // import { rxResource } from '@angular/core/rxjs-interop';

  // getAllData = rxResource({
  //   loader: () =>
  //     this.http
  //       .get<Products>(`${this.URL}${this.url}`)
  //       .pipe(map((vr) => vr.resulte)),
  // });

  // ✅ إضافة كاش لحفظ المنتجات
  private cachedProducts: Product[] = [];
  private lastRequestParams: any = null;
  /**
   * جلب جميع المنتجات مع دعم الفلاتر لتحديد التصنيفات.
   * @param categoryFilter قائمة تصنيفات المنتجات.
   */
  getAll(
    categoryFilter?: string[],
    page: number = 1,
    limit: number = 12,
    sort?: string,
    fields?: string,
    keyword?: string
  ): Observable<Products> {
    const params: any = { page, limit };

    // إضافة الفئات إذا وُجدت
    if (categoryFilter && categoryFilter.length > 0) {
      params.category = categoryFilter.join(',');
    }
    // إضافة معاملات Pagination والبحث والتصفية
    params.page = page;
    params.limit = limit;
    if (sort) params.sort = sort;
    if (fields) params.fields = fields;
    if (keyword) params.keyword = keyword;
    // إضافة مصطلح البحث إذا وُجد

    // ✅ تجنب طلب جديد إذا لم تتغير الفلاتر
    if (
      this.lastRequestParams &&
      JSON.stringify(this.lastRequestParams) === JSON.stringify(params)
    ) {
      console.log('✅ جلب المنتجات من الكاش');
      return of({
        data: this.cachedProducts,
        PaginationResult: this.paginationResult(),
      } as Products);
    }

    this.lastRequestParams = params;

    return this.apiService.getAllData<Products>(this.url, params).pipe(
      tap((data: Products) => {
        this.cachedProducts = data.data; // حفظ المنتجات في الكاش
        this.productCount.set(data.data.length);
        this.product.set(data.data);
        this.paginationResult.set(data.PaginationResult);
      })
    );
  }
  // getProductsBySubCategory(id?: string): Observable<Products> {
  //   if (id) {
  //     return this.apiService.getAllData<Products>(
  //       `/subcategory/${id}/products`
  //     );
  //   }
  //   return of()
  // }

  getProductsBySubCategory(id?: string): Observable<Products> {
    if (!id) return EMPTY;
    // التحقق مما إذا كانت المنتجات محملة مسبقًا
    if (this.cachedProducts.length) {
      const filteredProducts = this.cachedProducts.filter(
        (p) => p.subCategory?._id === id
      );
      if (filteredProducts.length) {
        return of({
          data: filteredProducts,
          PaginationResult: this.paginationResult(),
        } as Products);
      }
    }
    return this.apiService.getAllData<Products>(`/subcategory/${id}/products`);
  }

  getSearches(searchTerm?: string): Observable<Products> {
    const params: any = {};
    if (searchTerm?.trim()) {
      params.keyword = searchTerm;
    }
    return this.apiService.getAllData<Products>(this.url, params).pipe(
      tap((data: Products) => {
        this.searchProducts.set(data.data);
      })
    );
  }

  /**
   * إعادة تحميل المنتجات وإجبار تحديث الكاش.
   */
  refreshProducts(): void {
    this.cachedProducts = [];
    this.lastRequestParams = null;
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
