import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import {
  LoginSchema,
  RegisterSchema,
  UpdateProfileSchema,
} from "@/lib/validations/auth";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { withQueryTelemetry } from "@/lib/query-telemetry";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginSchema) => authService.login(payload),
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.token);
      toast.success("Login berhasil");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterSchema) => authService.register(payload),
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.token);
      toast.success("Registrasi berhasil");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      toast.info("Kamu sudah logout");
    },
    onError: () => {
      toast.error("Gagal logout ke server, sesi lokal tetap dihapus.");
    },
    onSettled: () => {
      logout();
      router.push("/login");
    },
  });
}

export function useUpdateProfile() {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: UpdateProfileSchema) =>
      authService.updateProfile({
        name: payload.name,
        email: payload.email,
        ...(payload.password
          ? {
              password: payload.password,
              password_confirmation: payload.password_confirmation,
            }
          : {}),
      }),
    onSuccess: ({ data }) => {
      setUser(data.data.user);
      toast.success("Profile berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useMe() {
  const { token, setUser } = useAuthStore();
  const query = useQuery({
    queryKey: authKeys.me,
    queryFn: () =>
      withQueryTelemetry("auth.me", () =>
        authService.me().then((r) => r.data.data.user),
      ),
    enabled: !!token,
    staleTime: 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}
