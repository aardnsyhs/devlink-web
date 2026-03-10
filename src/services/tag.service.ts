import api from "@/lib/api";
import { Tag } from "@/types/tag";

interface TagPaginated {
  data: Tag[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const tagService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<TagPaginated>("/tags", { params }),

  create: (payload: { name: string }) =>
    api.post<{ data: Tag }>("/tags", payload),

  update: (slug: string, payload: { name: string }) =>
    api.put<{ data: Tag }>(`/tags/${slug}`, payload),

  delete: (slug: string) => api.delete(`/tags/${slug}`),
};
