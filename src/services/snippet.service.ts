import api from "@/lib/api";
import { Snippet } from "@/types/snippet";

interface SnippetPaginated {
  data: Snippet[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const snippetService = {
  getAll: (params?: Record<string, unknown>, signal?: AbortSignal) =>
    api.get<SnippetPaginated>("/snippets", { params, signal }),

  getBySlug: (slug: string) => api.get<{ data: Snippet }>(`/snippets/${slug}`),

  create: (payload: Record<string, unknown>) =>
    api.post<{ data: Snippet }>("/snippets", payload),

  update: (id: number, payload: Record<string, unknown>) =>
    api.put<{ data: Snippet }>(`/snippets/${id}`, payload),

  delete: (id: number) => api.delete(`/snippets/${id}`),
};
