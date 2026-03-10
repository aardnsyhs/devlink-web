export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}
