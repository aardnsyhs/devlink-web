import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Tag } from "@/types/tag";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => api.get<{ data: Tag[] }>("/tags").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}
