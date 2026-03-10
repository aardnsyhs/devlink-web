import { z } from "zod";

export const snippetSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  code: z.string().min(1, "Code tidak boleh kosong"),
  language: z.string().min(1, "Pilih bahasa pemrograman"),
  status: z.enum(["draft", "published", "archived"]),
  tag_ids: z.array(z.number()).optional(),
});

export type SnippetSchema = z.infer<typeof snippetSchema>;
