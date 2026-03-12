import api from "@/lib/api";
import { ArticlePaginated, Article } from "@/types/article";

export const articleService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<ArticlePaginated>("/articles", { params }),

  getBySlug: (slug: string) => api.get<{ data: Article }>(`/articles/${slug}`),

  create: (payload: FormData | Record<string, unknown>) =>
    api.post<{ data: Article }>("/articles", payload),

  update: (id: number, payload: Record<string, unknown>) =>
    api.put<{ data: Article }>(`/articles/${id}`, payload),

  delete: (id: number) => api.delete(`/articles/${id}`),
};
