import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagService } from "@/services/tag.service";
import api from "@/lib/api";
import { Tag } from "@/types/tag";
import { AxiosError } from "axios";
import { toast } from "sonner";

function getErrorMessage(error: AxiosError<{ message?: string }>) {
  return error.response?.data?.message ?? "Terjadi kesalahan, coba lagi.";
}

export const tagKeys = {
  all: ["tags"] as const,
  list: (params?: Record<string, unknown>) =>
    [...tagKeys.all, "list", params] as const,
};

export function useTags(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: () => tagService.getAll(params).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: () =>
      api
        .get<{ data: Tag[] }>("/tags", { params: { per_page: 100 } })
        .then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => tagService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success("Tag berhasil dibuat");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: { name: string };
    }) => tagService.update(slug, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success("Tag berhasil diperbarui");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => tagService.delete(slug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success("Tag berhasil dihapus");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(getErrorMessage(error));
    },
  });
}
