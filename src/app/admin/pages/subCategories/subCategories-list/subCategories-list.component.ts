import { SubCategoriesService } from './../../../../service/subCategories.service';
import { Category } from '../../../../models/category.models';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import {
  SubCategories,
  PaginationResult,
  SubCategory,
} from '../../../../models/subcategory.models';

@Component({
  selector: 'admin-SubCategories-list',
  standalone: true,
  templateUrl: './subCategories-list.component.html',
  styleUrl: './subCategories-list.component.scss',
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    RouterLink,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class AdminSubCategoriesListComponent implements OnInit {
  private messageService = inject(MessageService);
  private subCategoryService = inject(SubCategoriesService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  subCategories = signal<SubCategories[]>([]);
  pagination = signal<PaginationResult[]>([]);
  subCategory = this.subCategoryService.subCategory;
  resulte = signal<number>(0);
  error = signal('');

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const subscription = this.subCategoryService.getAll().subscribe({
      next: (res) => {
        this.subCategory.set(res.data); // تعيين المصفوفة documents
        console.log(res.data);
      },

      error: (err) => console.error(err.error.message),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteSubCategory(Id: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this SubCategory?',
      header: 'Delete SubCategory',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',

      accept: () => {
        const subscription = this.subCategoryService.delete(Id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'SubCategory is deleted ',
            });
            this.getAll();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'SubCategory not deleted',
            });
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      },
    });
  }
}
