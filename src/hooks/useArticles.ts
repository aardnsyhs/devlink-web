import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/services/article.service";
import { AxiosError } from "axios";
import { toast } from "sonner";

function getErrorMessage(error: AxiosError<{ message?: string }>) {
  return error.response?.data?.message ?? "Terjadi kesalahan, coba lagi.";
}

export const articleKeys = {
  all: ["articles"] as const,
  list: (params?: Record<string, unknown>) =>
    [...articleKeys.all, "list", params] as const,
  detail: (slug: string) => [...articleKeys.all, "detail", slug] as const,
};

export function useArticles(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: () => articleService.getAll(params).then((r) => r.data),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articleService.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      articleService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      toast.success("Artikel berhasil dibuat");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: Record<string, unknown>;
    }) => articleService.update(slug, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      toast.success("Artikel berhasil diperbarui");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => articleService.delete(slug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      toast.success("Artikel berhasil dihapus");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}
