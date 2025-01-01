import { SubCategory } from './subcategory.models';
export interface Categories {
  PaginationResult: PaginationResult[];
  data: Category[];
  resulte: number;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  checked: boolean;
  subcategories?: SubCategory[]; // إضافة الـ SubCategories

}

export interface PaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
  next: number;
  prev: number;
}
