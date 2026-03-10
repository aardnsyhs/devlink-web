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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: snippetKeys.all }),
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: snippetKeys.all }),
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
