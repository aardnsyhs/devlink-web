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
  getAll: (params?: Record<string, unknown>) =>
    api.get<SnippetPaginated>("/snippets", { params }),

  getBySlug: (slug: string) => api.get<{ data: Snippet }>(`/snippets/${slug}`),

  create: (payload: Record<string, unknown>) =>
    api.post<{ data: Snippet }>("/snippets", payload),

  update: (slug: string, payload: Record<string, unknown>) =>
    api.put<{ data: Snippet }>(`/snippets/${slug}`, payload),

  delete: (slug: string) => api.delete(`/snippets/${slug}`),
};
