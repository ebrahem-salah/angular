import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Brand, Brands } from '../../../../models/brands.models';
import { BrandsService } from '../../../../service/brands.service';

@Component({
  selector: 'admin-brands-list',
  standalone: true,
  templateUrl: './Brands-list.component.html',
  styleUrl: './Brands-list.component.scss',
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
export class AdminBrandsListComponent implements OnInit {
  private messageService = inject(MessageService);
  private brandsService = inject(BrandsService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  brands = signal<Brand[]>([]);
  resulte = signal<number>(0);
  error = signal('');

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const subscription = this.brandsService.getAll().subscribe({
      next: (data: Brands) => {
        this.brands.set(data.data); // تعيين المصفوفة documents
        console.log(data.data);
      },

      error: (err) => console.error(err.error.message),
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  delete(Id: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Brand?',
      header: 'Delete Brand',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',

      accept: () => {
        const subscription = this.brandsService.delete(Id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Brand is deleted ',
            });
            this.getAll()
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Brand not deleted',
            });
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      },
    });
  }
}
