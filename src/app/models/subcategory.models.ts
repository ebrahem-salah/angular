import { Category } from './category.models';

export interface SubCategories {
  PaginationResult: PaginationResult[];
  data: SubCategory[];
  resulte: number;
}

export interface SubCategory {
  _id: string;
  name: string;
  image: string;
  category: Category;
}

export interface PaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
  next: number;
  prev: number;
}
