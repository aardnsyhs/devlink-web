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

  update: (id: number, payload: { name: string }) =>
    api.put<{ data: Tag }>(`/tags/${id}`, payload),

  delete: (id: number) => api.delete(`/tags/${id}`),
};
