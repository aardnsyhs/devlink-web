import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { snippetService } from "@/services/snippet.service";

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

export function useDeleteSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => snippetService.delete(slug),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: snippetKeys.all }),
  });
}
