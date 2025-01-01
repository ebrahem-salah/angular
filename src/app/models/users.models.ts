export interface Users {
  PaginationResult: PaginationResult[];
  data: User[];
  resulte: number;
}

export interface User {
  id: string;
  userName: string;
  name: string;
  email: string;
  phone: string;
  profileImg: string;
  password: string;
  passwordChangeAt: string;
  passwordResetExpires: string;
  passwordResetVerified: string;
  role: string;
  addresses: addresses[];
  refreshToken: string;
  active: string;
  wishList: string[];
  order: string[];
  accessToken: string;
}
export interface addresses {
  _id: string;
  alias: string;
  city: string;
  address: string;
  street: string;
  phone: string;
}
export interface PaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
  next: number;
  prev: number;
}
