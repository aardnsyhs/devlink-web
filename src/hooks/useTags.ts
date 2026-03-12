import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagService } from "@/services/tag.service";
import api from "@/lib/api";
import { Tag } from "@/types/tag";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

type TagPaginated = {
  data: Tag[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export const tagKeys = {
  all: ["tags"] as const,
  list: (params?: Record<string, unknown>) =>
    [...tagKeys.all, "list", params] as const,
};

function normalizeMetaNumber(value: unknown): number {
  if (Array.isArray(value)) {
    return Number(value[value.length - 1] ?? 0) || 0;
  }
  return Number(value ?? 0) || 0;
}

export function useTags(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: ({ signal }) =>
      tagService.getAll(params, signal).then((r) => ({
        ...r.data,
        meta: {
          ...r.data.meta,
          current_page: normalizeMetaNumber(r.data.meta.current_page),
          last_page: normalizeMetaNumber(r.data.meta.last_page),
          per_page: normalizeMetaNumber(r.data.meta.per_page),
          total: normalizeMetaNumber(r.data.meta.total),
        },
      })),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: ({ signal }) =>
      api
        .get<{ data: Tag[] }>("/tags", { params: { per_page: 100 }, signal })
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
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { name: string };
    }) => tagService.update(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: tagKeys.all });

      const previousLists = queryClient.getQueriesData<TagPaginated>({
        queryKey: tagKeys.all,
      });

      queryClient.setQueriesData<TagPaginated>(
        { queryKey: tagKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((tag) =>
              tag.id === id
                ? {
                    ...tag,
                    name: payload.name,
                    slug: payload.name
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, "-"),
                  }
                : tag,
            ),
          };
        },
      );

      return { previousLists };
    },
    onError: (error, _variables, context) => {
      context?.previousLists?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      toast.error(getApiErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success("Tag berhasil diperbarui");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tagService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: tagKeys.all });

      const previousLists = queryClient.getQueriesData<TagPaginated>({
        queryKey: tagKeys.all,
      });

      queryClient.setQueriesData<TagPaginated>(
        { queryKey: tagKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((tag) => tag.id !== id),
            meta: {
              ...old.meta,
              total: Math.max(0, old.meta.total - 1),
            },
          };
        },
      );

      return { previousLists };
    },
    onError: (error, _variables, context) => {
      context?.previousLists?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      toast.error(getApiErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success("Tag berhasil dihapus");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}
