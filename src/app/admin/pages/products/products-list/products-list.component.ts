import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PaginationResult,
  Product,
  Products,
} from './../../../../models/poduct.models';
import { ProductsService } from '../../../../service/products.service';

import { ColorPickerModule } from 'primeng/colorpicker';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'admin-product-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    PaginatorModule,
    TableModule,
    RouterLink,
    ToastModule,
    CurrencyPipe,
    ConfirmDialogModule,
    DatePipe,
    ColorPickerModule,
    CommonModule,
    RatingModule,
    FormsModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class AdminProductsListComponent implements OnInit {
  private messageService = inject(MessageService);
  private productService = inject(ProductsService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  // products!: Product[];
  pagination = signal<PaginationResult[]>([]);
  product = signal<Product[]>([]);
  resulte = signal<number>(0);
  error = signal('');

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const subscription = this.productService.getAll().subscribe({
      next: (res: Products) => {
        this.product.set(res.data); // تعيين المصفوفة documents
        this.resulte.set(res.resulte);
      },

      error: () => console.error('Error loading data'),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this product ?',
      header: 'Delete Product',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        const subscription = this.productService.delete(productId).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product is deleted ',
            });
            this.getAll();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Product not deleted',
            });
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      },
    });
  }
}
