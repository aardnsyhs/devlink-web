import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { LoginSchema, RegisterSchema } from "@/lib/validations/auth";
import { AxiosError } from "axios";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginSchema) => authService.login(payload),
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.token);
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error.response?.data?.message);
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
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error(error.response?.data?.message);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout();
      router.push("/login");
    },
  });
}
