import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Product, Products } from '../../../models/poduct.models';
import { ProductsService } from '../../../service/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SearchService } from '../../../service/search.service';
import { SearchResultItemComponent } from '../search-result-item/search-result-item.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { RouterLink } from '@angular/router';
import { OrderListModule } from 'primeng/orderlist';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    AvatarModule,
    OverlayModule,
    SearchResultItemComponent,
    RouterLink,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private productService = inject(ProductsService);
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);

  overlayOpen = this.searchService.overlayOpen;

  products = this.productService.searchProducts;
  message = signal<string>('');

  onSearch(searchTerm: string) {
    const search = searchTerm.toLowerCase();
    console.log(searchTerm);

    if (searchTerm.length >= 3) {
      this.overlayOpen.set(true);

      // اشتراك البحث
      const subscription = this.productService.getSearches(search).subscribe({
        next: (data: Products) => {
          this.products.set(data.data);
          this.message.set(''); // مسح الرسالة السابقة
        },
        error: () => {
          this.products.set([]); // إعادة تعيين المنتجات إلى قائمة فارغة
          this.message.set(`No product item found for this: ${searchTerm}`);
        },
      });

      // إلغاء الاشتراك عند التدمير
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    } else {
      // إذا كان طول المدخلات أقل من 3
      this.overlayOpen.set(false);
      this.products.set([]); // إعادة التعيين إلى قائمة فارغة
      this.message.set('');
    }
  }
}
