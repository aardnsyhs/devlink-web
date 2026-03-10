import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/services/article.service";

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

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => articleService.delete(slug),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: articleKeys.all }),
  });
}
