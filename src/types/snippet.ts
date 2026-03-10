import { Tag } from "./tag";

export interface Snippet {
  id: number;
  title: string;
  slug: string;
  description: string;
  code: string;
  language: string;
  status: "draft" | "published" | "archived";
  views: number;
  likes: number;
  published_at: string | null;
  author: { id: number; name: string };
  tags: Tag[];
  created_at: string;
  updated_at: string;
}
