export interface AuthResponseData {
  id: number;
  email: string;
  token: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface RefreshResponseData {
  token: string;
  role: string;
}
