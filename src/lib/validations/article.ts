import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  excerpt: z.string().min(10, "Excerpt minimal 10 karakter"),
  content: z.string().min(20, "Konten minimal 20 karakter"),
  status: z.enum(["draft", "published", "archived"]),
  tag_ids: z.array(z.number()).optional(),
});

export type ArticleSchema = z.infer<typeof articleSchema>;
