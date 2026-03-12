import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "@/services/snippet.service";
import { toast } from "sonner";
import { Snippet } from "@/types/snippet";
import { getApiErrorMessage } from "@/lib/api-error";

type SnippetMutationPayload = Record<string, unknown> & {
  tag_ids?: number[];
};

function toSnippetApiPayload(payload: SnippetMutationPayload) {
  const { tag_ids, ...rest } = payload;

  return {
    ...rest,
    tags: tag_ids ?? [],
  };
}

type SnippetPaginated = {
  data: Snippet[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export const snippetKeys = {
  all: ["snippets"] as const,
  list: (params?: Record<string, unknown>) =>
    [...snippetKeys.all, "list", params] as const,
  detail: (slug: string) => [...snippetKeys.all, "detail", slug] as const,
};

function normalizeMetaNumber(value: unknown): number {
  if (Array.isArray(value)) {
    return Number(value[value.length - 1] ?? 0) || 0;
  }
  return Number(value ?? 0) || 0;
}

export function useSnippets(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: snippetKeys.list(params),
    queryFn: ({ signal }) =>
      snippetService.getAll(params, signal).then((r) => ({
        ...r.data,
        meta: {
          ...r.data.meta,
          current_page: normalizeMetaNumber(r.data.meta.current_page),
          last_page: normalizeMetaNumber(r.data.meta.last_page),
          per_page: normalizeMetaNumber(r.data.meta.per_page),
          total: normalizeMetaNumber(r.data.meta.total),
        },
      })),
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
    mutationFn: (payload: SnippetMutationPayload) =>
      snippetService.create(toSnippetApiPayload(payload)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      toast.success("Snippet berhasil dibuat");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      slug?: string;
      payload: SnippetMutationPayload;
    }) => snippetService.update(id, toSnippetApiPayload(payload)),
    onMutate: async ({ id, slug, payload }) => {
      await queryClient.cancelQueries({ queryKey: snippetKeys.all });

      const previousLists = queryClient.getQueriesData<SnippetPaginated>({
        queryKey: snippetKeys.all,
      });
      const previousDetail = slug
        ? queryClient.getQueryData<Snippet>(snippetKeys.detail(slug))
        : undefined;

      queryClient.setQueriesData<SnippetPaginated>(
        { queryKey: snippetKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((snippet) =>
              snippet.id === id ? { ...snippet, ...payload } : snippet,
            ),
          };
        },
      );

      if (slug) {
        queryClient.setQueryData<Snippet>(snippetKeys.detail(slug), (old) =>
          old ? { ...old, ...payload } : old,
        );
      }

      return { previousLists, previousDetail, slug };
    },
    onError: (error, _variables, context) => {
      context?.previousLists?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });

      if (context?.slug) {
        queryClient.setQueryData(
          snippetKeys.detail(context.slug),
          context.previousDetail,
        );
      }

      toast.error(getApiErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      toast.success("Snippet berhasil diperbarui");
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      if (variables.slug) {
        await queryClient.invalidateQueries({
          queryKey: snippetKeys.detail(variables.slug),
        });
      }
    },
  });
}

export function useDeleteSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; slug?: string }) =>
      snippetService.delete(id),
    onMutate: async ({ id, slug }) => {
      await queryClient.cancelQueries({ queryKey: snippetKeys.all });

      const previousLists = queryClient.getQueriesData<SnippetPaginated>({
        queryKey: snippetKeys.all,
      });
      const previousDetail = slug
        ? queryClient.getQueryData<Snippet>(snippetKeys.detail(slug))
        : undefined;

      queryClient.setQueriesData<SnippetPaginated>(
        { queryKey: snippetKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((snippet) => snippet.id !== id),
            meta: {
              ...old.meta,
              total: Math.max(0, old.meta.total - 1),
            },
          };
        },
      );

      if (slug) {
        queryClient.removeQueries({ queryKey: snippetKeys.detail(slug) });
      }

      return { previousLists, previousDetail, slug };
    },
    onError: (error, _variables, context) => {
      context?.previousLists?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });

      if (context?.slug && context.previousDetail) {
        queryClient.setQueryData(
          snippetKeys.detail(context.slug),
          context.previousDetail,
        );
      }

      toast.error(getApiErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      toast.success("Snippet berhasil dihapus");
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      if (variables.slug) {
        await queryClient.invalidateQueries({
          queryKey: snippetKeys.detail(variables.slug),
        });
      }
    },
  });
}
