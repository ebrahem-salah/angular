import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { Order, Orders } from '../models/orders.models.';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiService = inject(ApiService);
  url = '/orders';
  ordersCount = signal(0);
  totalOrderPrice = signal(0);
  ordersList = signal<Order[]>([]);

  getAll(): Observable<Orders> {
    return this.apiService.getAllData<Orders>(this.url).pipe(
      tap((data) => {
        this.ordersCount.set(data.data.length);
        this.ordersList.set(data.data);
      })
    );
  }
  add(order: Order): Observable<Order> {
    return this.apiService.addNewData<Order>(this.url, order);
  }
  checkout(orderId: string) {
    return this.apiService.addNewData<Order>(`${this.url}/${orderId}`);
  }
  delete(orderId: string): Observable<Order> {
    return this.apiService.deleteData<Order>(`${this.url}/${orderId}`);
  }
  get(orderId: string): Observable<Order> {
    return this.apiService.getOne<Order>(`${this.url}/${orderId}`);
  }
  updateOrder(id: string, order: Order, pay: string): Observable<Order> {
    return this.apiService.updateData<Order>(`${this.url}/${id}/${pay}`, order);
  }
  getTotalOrderPrice(): Observable<Order> {
    return this.apiService
      .getAllData<Order>(`${this.url}/totalOrdersPrice`)
      .pipe(tap((data) => this.totalOrderPrice.set(data.totalOrderPrice)));
  }
}
