import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/services/article.service";
import { toast } from "sonner";
import { Article, ArticlePaginated } from "@/types/article";
import { getApiErrorMessage } from "@/lib/api-error";

type ArticleMutationPayload = Record<string, unknown> & {
  tag_ids?: number[];
};

function toArticleApiPayload(payload: ArticleMutationPayload) {
  const { tag_ids, ...rest } = payload;

  return {
    ...rest,
    tags: tag_ids ?? [],
  };
}

export const articleKeys = {
  all: ["articles"] as const,
  list: (params?: Record<string, unknown>) =>
    [...articleKeys.all, "list", params] as const,
  detail: (slug: string) => [...articleKeys.all, "detail", slug] as const,
};

function normalizeMetaNumber(value: unknown): number {
  if (Array.isArray(value)) {
    return Number(value[value.length - 1] ?? 0) || 0;
  }
  return Number(value ?? 0) || 0;
}

export function useArticles(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: articleKeys.list(params),
    queryFn: ({ signal }) =>
      articleService.getAll(params, signal).then((r) => ({
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
    mutationFn: (payload: ArticleMutationPayload) =>
      articleService.create(toArticleApiPayload(payload)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      toast.success("Artikel berhasil dibuat");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      slug?: string;
      payload: ArticleMutationPayload;
    }) => articleService.update(id, toArticleApiPayload(payload)),
    onMutate: async ({ id, slug, payload }) => {
      await queryClient.cancelQueries({ queryKey: articleKeys.all });

      const previousLists = queryClient.getQueriesData<ArticlePaginated>({
        queryKey: articleKeys.all,
      });
      const previousDetail = slug
        ? queryClient.getQueryData<Article>(articleKeys.detail(slug))
        : undefined;

      queryClient.setQueriesData<ArticlePaginated>(
        { queryKey: articleKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((article) =>
              article.id === id ? { ...article, ...payload } : article,
            ),
          };
        },
      );

      if (slug) {
        queryClient.setQueryData<Article>(articleKeys.detail(slug), (old) =>
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
          articleKeys.detail(context.slug),
          context.previousDetail,
        );
      }

      toast.error(getApiErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      toast.success("Artikel berhasil diperbarui");
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      if (variables.slug) {
        await queryClient.invalidateQueries({
          queryKey: articleKeys.detail(variables.slug),
        });
      }
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; slug?: string }) =>
      articleService.delete(id),
    onMutate: async ({ id, slug }) => {
      await queryClient.cancelQueries({ queryKey: articleKeys.all });

      const previousLists = queryClient.getQueriesData<ArticlePaginated>({
        queryKey: articleKeys.all,
      });
      const previousDetail = slug
        ? queryClient.getQueryData<Article>(articleKeys.detail(slug))
        : undefined;

      queryClient.setQueriesData<ArticlePaginated>(
        { queryKey: articleKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((article) => article.id !== id),
            meta: {
              ...old.meta,
              total: Math.max(0, old.meta.total - 1),
            },
          };
        },
      );

      if (slug) {
        queryClient.removeQueries({ queryKey: articleKeys.detail(slug) });
      }

      return { previousLists, previousDetail, slug };
    },
    onError: (error, _variables, context) => {
      context?.previousLists?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });

      if (context?.slug && context.previousDetail) {
        queryClient.setQueryData(
          articleKeys.detail(context.slug),
          context.previousDetail,
        );
      }

      toast.error(getApiErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      toast.success("Artikel berhasil dihapus");
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      if (variables.slug) {
        await queryClient.invalidateQueries({
          queryKey: articleKeys.detail(variables.slug),
        });
      }
    },
  });
}
