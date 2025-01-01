import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../service/products.service';
import { ProductsItemComponent } from '../../pages/productss/products-item/products-item.component';
import { DataViewModule } from 'primeng/dataview';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    ProductsItemComponent,
    RatingModule,
  ],
})
export class SearchResultListComponent {
  private productService = inject(ProductsService);
  products = this.productService.searchProducts;
  sortOptions!: SelectItem[];

  sortOrder!: number;

  sortField!: string;
  sortKey: any;

  ngOnInit() {
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
      { label: 'ratingsQuantity High to Low', value: '!ratingsQuantity' },
      { label: 'ratingsQuantity Low to High', value: 'ratingsQuantity' },
    ];
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
