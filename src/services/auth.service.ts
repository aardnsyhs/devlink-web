import api from "@/lib/api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/auth";

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload),

  logout: () => api.post("/auth/logout"),

  me: () => api.get<{ data: { user: User } }>("/me"),

  updateProfile: (payload: UpdateProfilePayload) =>
    api.put<{ message: string; data: { user: User } }>("/me", payload),
};
