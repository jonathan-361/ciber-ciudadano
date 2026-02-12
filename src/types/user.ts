export interface User {
  id?: number;
  name: string;
  last_name: string;
  email: string;
  password: string;
  birth_date: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
