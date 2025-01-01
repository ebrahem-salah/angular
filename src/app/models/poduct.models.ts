import { Brand } from './brands.models';
import { Category } from './category.models';
import { SubCategory } from './subcategory.models';

export interface Products {
  data: Product[];
  PaginationResult: PaginationResult[];
  resulte: number;
}

export interface Product {
  image: any;
  name: any;
  _id: string;
  title: string;
  description: string;
  createdAt: Date;
  imageCover: string;
  images: string[];
  price: number;
  priceDiscount?: number;
  ratingsAverge?: number;
  ratingsQuantity?: number;
  sold: number;
  quantity: number;
  subcategory: SubCategory;
  updatedAt: string;
  colors: string[];
  brand: Brand;
  category: Category;
  discountedPrice?: number;
  discount: discount;
}

export interface PaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
}

export interface discount {
  name: String;
  type: string;
  value: string;
  startDate: string;
  endDate: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  products: Products;
}
