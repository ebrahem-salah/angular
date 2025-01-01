import { OrdersService } from './../../../../service/orders.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Order, Orders } from '../../../../models/orders.models.';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'admin-categories',
  standalone: true,
  templateUrl: './orders-detil.component.html',
  styleUrl: './orders-detil.component.scss',
  providers: [MessageService],
  imports: [
    FieldsetModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    RouterLink,
    CommonModule,
    ToastModule,
    InputSwitchModule,
    FormsModule,
  ],
  
})
export class AdminOrdersDetilComponent {
  private messageService = inject(MessageService);
  private ordersService = inject(OrdersService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  currentId?: string;
  orders?: Order;
  toPaid?: boolean;
  toDelivered?: boolean;
  ngOnInit(): void {
    this.getId();
  }

  getId() {
    const subscription = this.route.params.subscribe((params) => {
      if (params['id']) {
        const subscription = this.ordersService.get(params['id']).subscribe({
          next: (order: Order) => {
            console.log(order);
            this.orders = order;
            this.currentId = order._id as string;
            this.toPaid = order.isPaid;
            this.toDelivered = order.isDelivered;
          },
          error: (error) => {
            console.error('Error fetching order:', error);
          },
        });
        this.destroyRef.onDestroy(() => subscription.unsubscribe());
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  selectedStatusToPaid(event: any) {
    const pay = 'pay';
    const subscription = this.ordersService
      .updateOrder(this.currentId as string, event, pay)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order is paid ',
          });
        },
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  selectedStatusToDelivered(event: any) {
    const deliver = 'deliver';
    const subscription = this.ordersService
      .updateOrder(this.currentId as string, event, deliver)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order is delivered ',
          });
        },
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
