import { CartItems } from './cart.model';
import { User } from './users.models';

export interface Orders {
  PaginationResult: PaginationResult[];
  data: Order[];
  resulte: number;
}

export interface Order {
  _id?: string;
  user?: User;
  cartItems?: CartItems[];
  createdAt?: string;
  isDelivered?: boolean;
  isPaid: boolean;
  paidAt: string;
  shippingAddress: ShippingAddress[];
  paymentMethod: string;
  shippingPrice: number;
  taxPrice: number;
  totalOrderPrice: number;
  delivereAt: string;
}
export interface ShippingAddress {
  street: string;
  phone: string;
  city: string;
}
export interface PaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
  next: number;
  prev: number;
}
