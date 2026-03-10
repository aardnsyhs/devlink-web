import { Tag } from "./tag";

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published" | "archived";
  views: number;
  likes: number;
  published_at: string | null;
  author: {
    id: number;
    name: string;
  };
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface ArticlePaginated {
  data: Article[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
