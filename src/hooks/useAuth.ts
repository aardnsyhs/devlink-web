import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import {
  LoginSchema,
  RegisterSchema,
  UpdateProfileSchema,
} from "@/lib/validations/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";

function getErrorMessage(error: AxiosError<{ message?: string }>) {
  return error.response?.data?.message ?? "Terjadi kesalahan, coba lagi.";
}

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
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
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
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
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
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}
