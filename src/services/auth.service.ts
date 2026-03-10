import api from "@/lib/api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload),

  logout: () => api.post("/auth/logout"),

  me: () => api.get<{ data: User }>("/auth/me"),
};
