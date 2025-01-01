import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { combineLatest } from 'rxjs';
import { UsersService } from '../../../service/users.service';
import { ProductsService } from '../../../service/products.service';
import { OrdersService } from '../../../service/orders.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [OrdersService],
})
export class AdminDashboardComponent {
  private usersService = inject(UsersService);
  private productsService = inject(ProductsService);
  private ordersService = inject(OrdersService);
  private destroyRef = inject(DestroyRef);
  usersCount = this.usersService.usersCount;
  productCount = this.productsService.productCount;
  ordersCount = this.ordersService.ordersCount;
  totalOrderPrice = signal(0);
  totalOrderIsPaided = signal(0);
  totalOrderIsDelivered = signal(0);
  totalOrderIsNotDelivered = signal(0);
  totalOrderIsNotPaided = signal(0);

  ngOnInit() {
    const subscription = combineLatest([
      this.usersService.getAll(),
      this.productsService.getAll(),
      this.ordersService.getTotalOrderPrice(),
      this.ordersService.getAll(),
    ]).subscribe((data) => {
      // this.usersCount.set(data[0].resulte);
      // this.productCount.set(data[1].resulte);
      this.totalOrderPrice.set(data[2] as unknown as number);
      // this.ordersCount.set(data[3].resulte);
      this.totalOrderIsPaided.set(
        data[3].data.filter((order) => order.isPaid === true).length
      );
      console.log(this.ordersCount());
      console.log(this.totalOrderPrice());
      console.log(this.productCount());
      console.log(this.usersCount());

      this.totalOrderIsDelivered.set(
        data[3].data.filter((order) => order.isDelivered === true).length
      );

      this.totalOrderIsNotDelivered.set(
        this.ordersCount() - this.totalOrderIsDelivered()
      );
      this.totalOrderIsNotPaided.set(
        this.ordersCount() - this.totalOrderIsPaided()
      );
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
