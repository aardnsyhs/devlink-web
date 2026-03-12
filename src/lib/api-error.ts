import { AxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  const message = axiosError.response?.data?.message;
  if (message) return message;

  const firstError = axiosError.response?.data?.errors
    ? Object.values(axiosError.response.data.errors)[0]
    : null;

  if (Array.isArray(firstError) && firstError[0]) return firstError[0];
  if (typeof firstError === "string" && firstError) return firstError;

  return "Terjadi kesalahan, coba lagi.";
}
