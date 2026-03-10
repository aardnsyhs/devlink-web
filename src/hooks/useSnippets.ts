import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "@/services/snippet.service";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Snippet } from "@/types/snippet";

type SnippetPaginated = {
  data: Snippet[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message ?? "Terjadi kesalahan, coba lagi.";
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
    onMutate: async ({ slug, payload }) => {
      await queryClient.cancelQueries({ queryKey: snippetKeys.all });

      const previousLists = queryClient.getQueriesData<SnippetPaginated>({
        queryKey: snippetKeys.all,
      });
      const previousDetail = queryClient.getQueryData<Snippet>(
        snippetKeys.detail(slug),
      );

      queryClient.setQueriesData<SnippetPaginated>(
        { queryKey: snippetKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((snippet) =>
              snippet.slug === slug ? { ...snippet, ...payload } : snippet,
            ),
          };
        },
      );

      queryClient.setQueryData<Snippet>(snippetKeys.detail(slug), (old) =>
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
          snippetKeys.detail(context.slug),
          context.previousDetail,
        );
      }

      toast.error(getErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      toast.success("Snippet berhasil diperbarui");
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      await queryClient.invalidateQueries({
        queryKey: snippetKeys.detail(variables.slug),
      });
    },
  });
}

export function useDeleteSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => snippetService.delete(slug),
    onMutate: async (slug) => {
      await queryClient.cancelQueries({ queryKey: snippetKeys.all });

      const previousLists = queryClient.getQueriesData<SnippetPaginated>({
        queryKey: snippetKeys.all,
      });
      const previousDetail = queryClient.getQueryData<Snippet>(
        snippetKeys.detail(slug),
      );

      queryClient.setQueriesData<SnippetPaginated>(
        { queryKey: snippetKeys.all },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((snippet) => snippet.slug !== slug),
            meta: {
              ...old.meta,
              total: Math.max(0, old.meta.total - 1),
            },
          };
        },
      );

      queryClient.removeQueries({ queryKey: snippetKeys.detail(slug) });

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

      toast.error(getErrorMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      toast.success("Snippet berhasil dihapus");
    },
    onSettled: async (_data, _error, slug) => {
      await queryClient.invalidateQueries({ queryKey: snippetKeys.all });
      await queryClient.invalidateQueries({
        queryKey: snippetKeys.detail(slug),
      });
    },
  });
}
