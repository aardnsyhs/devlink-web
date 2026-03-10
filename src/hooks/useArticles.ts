import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/services/article.service";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Article, ArticlePaginated } from "@/types/article";

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? "Terjadi kesalahan, coba lagi.";
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
    onMutate: async ({ slug, payload }) => {
      await queryClient.cancelQueries({ queryKey: articleKeys.all });

      const previousLists = queryClient.getQueriesData<ArticlePaginated>({
        queryKey: articleKeys.all,
      });
      const previousDetail = queryClient.getQueryData<Article>(
        articleKeys.detail(slug),
      );

      queryClient.setQueriesData<ArticlePaginated>(
        { queryKey: articleKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((article) =>
              article.slug === slug ? { ...article, ...payload } : article,
            ),
          };
        },
      );

      queryClient.setQueryData<Article>(articleKeys.detail(slug), (old) =>
        old ? { ...old, ...payload } : old,
      );

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

      toast.error(getErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      toast.success("Artikel berhasil diperbarui");
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      await queryClient.invalidateQueries({
        queryKey: articleKeys.detail(variables.slug),
      });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => articleService.delete(slug),
    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: articleKeys.all });

      const previousLists = queryClient.getQueriesData<ArticlePaginated>({
        queryKey: articleKeys.all,
      });
      const previousDetail = queryClient.getQueryData<Article>(
        articleKeys.detail(slug),
      );

      queryClient.setQueriesData<ArticlePaginated>(
        { queryKey: articleKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((article) => article.slug !== slug),
            meta: {
              ...old.meta,
              total: Math.max(0, old.meta.total - 1),
            },
          };
        },
      );

      queryClient.removeQueries({ queryKey: articleKeys.detail(slug) });

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

      toast.error(getErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      toast.success("Artikel berhasil dihapus");
    },
    onSettled: async (_data, _error, slug) => {
      await queryClient.invalidateQueries({ queryKey: articleKeys.all });
      await queryClient.invalidateQueries({
        queryKey: articleKeys.detail(slug),
      });
    },
  });
}
