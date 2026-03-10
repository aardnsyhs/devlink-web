import api from "@/lib/api";
import { ArticlePaginated, Article } from "@/types/article";

export const articleService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<ArticlePaginated>("/articles", { params }),

  getBySlug: (slug: string) => api.get<{ data: Article }>(`/articles/${slug}`),

  create: (payload: FormData | Record<string, unknown>) =>
    api.post<{ data: Article }>("/articles", payload),

  update: (slug: string, payload: Record<string, unknown>) =>
    api.put<{ data: Article }>(`/articles/${slug}`, payload),

  delete: (slug: string) => api.delete(`/articles/${slug}`),
};
