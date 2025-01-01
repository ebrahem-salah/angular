import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, input, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { SearchService } from '../../../service/search.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductsService } from '../../../service/products.service';
import { Product } from '../../../models/poduct.models';
import { RouterLink } from '@angular/router';
import { ProductsItemComponent } from '../../pages/productss/products-item/products-item.component';
import { SearchResultListComponent } from '../search-result-list/search-result-list.component';
import { OrderListModule } from 'primeng/orderlist';
import { Listbox } from 'primeng/listbox';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    OrderListModule,
  ],
})
export class SearchResultItemComponent {
  searchService = inject(SearchService);
  private productService = inject(ProductsService);
  products = this.productService.searchProducts;

  message = input<string>('');


}
