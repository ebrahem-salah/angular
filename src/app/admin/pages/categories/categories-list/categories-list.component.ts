import { Category } from './../../../../models/category.models';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CategoriesService } from '../../../../service/categories.service';
import {
  Categories,
  PaginationResult,
} from '../../../../models/category.models';

@Component({
  selector: 'admin-categories-list',
  standalone: true,
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
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
export class AdminCategoriesListComponent implements OnInit {
  private messageService = inject(MessageService);
  private categoryService = inject(CategoriesService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  categories = signal<Categories[]>([]);
  pagination = signal<PaginationResult[]>([]);
  category = signal<Category[]>([]);
  resulte = signal<number>(0);
  error = signal('');

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const subscription = this.categoryService.getAll().subscribe({
      next: (res: Categories) => {
        this.category.set(res.data); // تعيين المصفوفة documents
        console.log(res.data);
        // this.sentCategory = res.data
        // console.log(this.sentCategory);
      },

      error: (err) => console.error(err.error.message),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',

      accept: () => {
        const subscription = this.categoryService.delete(categoryId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Category is deleted ',
            });
            this.getAll();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Category not deleted',
            });
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      },
    });
  }
}
