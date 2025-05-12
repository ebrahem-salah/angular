export interface Brands {
  PaginationResult: PaginationResult;
  data: Brand[];
  resulte: number;
}

export interface Brand {
  _id: string;
  name: string;
  image: string;
  checked: boolean;
}

export interface PaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
  next: number;
  prev: number;
}
