import { Product } from './poduct.models';
import { User } from './users.models';

export interface Cart {
  data: Cartdata;
  numOfCartItems?: number;
}
export interface Cartdata {
  _id?: string;
  cartItems: CartItems[];
  totalPrice?: number;
  totalPriceAfterDiscount?: number;
  numOfCartItems?: number;
  user?: User;
  createdAt?: Date;
}

export interface CartItems {
  name?: string;
  productId?: string;
  price?: number;
  quantity: number;
  product?: Product;
  color?: string;
  _id?: string;
  availableQuantity?: number;
}
