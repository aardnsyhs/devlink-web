import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "@/services/snippet.service";
import { AxiosError } from "axios";
import { toast } from "sonner";

function getErrorMessage(error: AxiosError<{ message?: string }>) {
  return error.response?.data?.message ?? "Terjadi kesalahan, coba lagi.";
}

export const snippetKeys = {
  all: ["snippets"] as const,
  list: (params?: Record<string, unknown>) =>
    [...snippetKeys.all, "list", params] as const,
  detail: (slug: string) => [...snippetKeys.all, "detail", slug] as const,
};

export function useSnippets(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: snippetKeys.list(params),
    queryFn: () => snippetService.getAll(params).then((r) => r.data),
  });
}

export function useSnippet(slug: string) {
  return useQuery({
    queryKey: snippetKeys.detail(slug),
    queryFn: () => snippetService.getBySlug(slug).then((r) => r.data.data),
    enabled: !!slug,
  });
}

export function useCreateSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      snippetService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      toast.success("Snippet berhasil dibuat");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: Record<string, unknown>;
    }) => snippetService.update(slug, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      toast.success("Snippet berhasil diperbarui");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => snippetService.delete(slug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      toast.success("Snippet berhasil dihapus");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}
