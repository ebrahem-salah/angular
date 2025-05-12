import { Component, inject } from '@angular/core';
import { CartService } from '../../../../service/cart.service';
import { OrdersService } from '../../../../service/orders.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, // أضف هذا
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Divider, DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatDividerModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCardModule,
    DropdownModule,
    DividerModule,
    CommonModule,
    FormsModule,
    ToastModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  onSubmitt() {
    throw new Error('Method not implemented.');
  }
  private messageService = inject(MessageService);
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private router = inject(Router);

  cartItems = this.cartService.cartItems; // إشارة إلى عناصر السلة
  totalPrice = this.cartService.cartPrice; // إشارة إلى الإجمالي النهائي
  totalPriceAfterDisc = this.cartService.cartPrice; // إشارة إلى الإجمالي بعد الخصم

  shippingAddress: string = '';
  shippingCity: string = '';
  shippingZip: string = '';
  selectedPaymentMethod: string = 'creditCard';

  ngOnInit(): void {
    // this.cartService.get().subscribe(); // تحميل عناصر السلة عند بدء التحميل
  }

  // تأكيد الطلب
  placeOrder(): void {
    const order = {
      cartId: this.cartService.cartId(), // استخدام معرف السلة
      shippingAddress: this.shippingAddress,
      shippingCity: this.shippingCity,
      shippingZip: this.shippingZip,
      paymentMethod: this.selectedPaymentMethod,
      totalPrice: this.totalPrice(),
      totalPriceAfterDiscount: this.totalPriceAfterDisc(),
    };

    this.ordersService.checkout(order.cartId).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Checkout completed successfully',
        });
        this.router.navigateByUrl('/'); // توجيه المستخدم إلى صفحة الطلبات
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error during checkout process',
        });
      },
    });

    // إرسال الطلب إلى الخادم
    this.ordersService.checkout(order.cartId).subscribe({
      next: () => {
        // console.log('Order placed successfully:', response);
        alert('Order placed successfully!');
        this.router.navigateByUrl('/orders'); // توجيه المستخدم إلى صفحة الطلبات
      },
      error: () => {
        // console.error('Error placing order:', err);
        alert('Failed to place order. Please try again.');
      },
    });
  }
  loadCartItems() {
    throw new Error('Method not implemented.');
  }

  // checkoutForm: FormGroup;
  // paymentMethods = [
  //   { label: 'Credit Card', value: 'credit_card' },
  //   { label: 'PayPal', value: 'paypal' },
  //   { label: 'Cash on Delivery', value: 'cod' },
  // ];

  // constructor(private fb: FormBuilder) {
  //   this.checkoutForm = this.fb.group({
  //     fullName: ['', Validators.required],
  //     address: ['', Validators.required],
  //     phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  //     paymentMethod: [null, Validators.required],
  //   });
  // }

  // onSubmit() {
  //   if (this.checkoutForm.valid) {
  //     console.log('Checkout details:', this.checkoutForm.value);
  //     alert('Order placed successfully!');
  //   } else {
  //     alert('Please fill out all required fields correctly.');
  //   }
  // }

  checkoutForm: FormGroup;
  items = [
    { name: 'منتج 1', price: 150, quantity: 2 },
    { name: 'منتج 2', price: 200, quantity: 1 },
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.checkoutForm = this.fb.group({
      shippingInfo: this.fb.group({
        fullName: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^01[0-2,5]\d{8}$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
      }),
      paymentInfo: this.fb.group({
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        expiryDate: [
          '',
          [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
        ],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      }),
    });
  }

  get subtotal() {
    return this.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  get total() {
    return this.subtotal + 50; // تكلفة الشحن
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      // إرسال البيانات
      this.snackBar.open('تم تأكيد الطلب بنجاح', 'إغلاق', { duration: 3000 });
    } else {
      this.snackBar.open('يرجى مراجعة البيانات المدخلة', 'إغلاق', {
        duration: 3000,
      });
    }
  }
}
