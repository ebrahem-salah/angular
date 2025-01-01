import { Product } from './../../../../models/poduct.models';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductsService } from '../../../../service/products.service';
import { ActivatedRoute } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ImageModule } from 'primeng/image';
import { CartService } from '../../../../service/cart.service';
import { Cart, CartItems } from '../../../../models/cart.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TokenService } from '../../../../service/token.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    RatingModule,
    CommonModule,
    FormsModule,
    InputNumberModule,
    ImageModule,
    ToastModule,
  ],
  providers: [MessageService],

  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  private productService = inject(ProductsService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private tokenService = inject(TokenService);
  private cartService = inject(CartService);
  cartItems: CartItems[] = [];
  product?: Product;
  quantity?: number;
  color?: string;
  priceDiscount?: number;
  selectedImage!: string;
  image: boolean = false;

  ngOnInit() {
    // this.selectedImage = this.product?.imageCover;
    const subscription = this.activatedRoute.params.subscribe((params) => {
      if (params['productId']) {
        this.getProduct(params['productId']);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  getProduct(productId: string) {
    const subscription = this.productService
      .get(productId)
      .subscribe((data) => {
        this.product = data;
        if (data.images.length > 0) {
          this.selectedImage = data.images[0];
          this.image = true;
        } else {
          this.selectedImage = data.imageCover;
        }
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  addToCart() {
    if (!this.isUserLoggedIn()) {
      return this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Please login to add to cart',
      });

      // return; // لا نحتاج لإرسال الطلب للخادم إذا لم يكن المستخدم مسجل دخول
    }
    const cartItem: CartItems = {
      productId: this.product?._id as string,
      name: this.product?.name,
      color: this.color, // Assuming the first color is selected//+
      quantity: (this.quantity as number) || 1,
      price: this.product?.price ,
    };

    return this.cartService
      .add(cartItem)
      .subscribe((data) => console.log(data));
  }

  byNow() {
    throw new Error('Method not implemented.');
  }
  changeSelectedImage(imageUrl: string) {
    if (imageUrl) this.selectedImage = imageUrl;
  }
  isUserLoggedIn(): boolean {
    // return !!localStorage.getItem('accessToken'); // تحقق إذا كان التوكن موجودًا في localStorage
    return !!this.tokenService.getAccessToken();
  }
}
