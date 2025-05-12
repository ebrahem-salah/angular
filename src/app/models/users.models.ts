export interface Users {
  PaginationResult: PaginationResult[];
  data: User[];
  resulte: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  slug: string;
  email: string;
  phone: string;
  profileImg: string;
  passwordChangeAt: string;
  passwordResetExpires: string;
  passwordResetVerified: string;
  role: string;
  addresses: address[];
  active: string;
  wishList: string[];
  order: string[];
}
export interface address {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  secondPhone: string;
  governorate: string;
  street: string;
  region: string;
  buildingNo: number;
  floor: number;
  landmark: string;
}
export interface PaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
  next: number;
  prev: number;
}
