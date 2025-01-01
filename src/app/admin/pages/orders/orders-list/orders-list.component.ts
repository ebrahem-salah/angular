import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { OrdersService } from '../../../../service/orders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-categories-list',
  standalone: true,
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    RouterLink,
    ToastModule,
    ConfirmDialogModule,
    CommonModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class AdminOrdersListComponent implements OnInit {
  private messageService = inject(MessageService);
  private ordersService = inject(OrdersService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  ordersList = this.ordersService.ordersList;
  ordersCount = this.ordersService.ordersCount;

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const subscription = this.ordersService.getAll().subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteorders(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Order ?',
      header: 'Delete Order',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',

      accept: () => {
        const subscription = this.ordersService.delete(orderId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Order is deleted ',
            });
            this.getAll();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Order not deleted',
            });
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      },
    });
  }
}
