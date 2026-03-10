import { codeToHtml } from "shiki";

export async function highlightCodeWithShiki(code: string, language: string) {
  const normalizedLanguage = language?.toLowerCase() || "text";

  try {
    return await codeToHtml(code, {
      lang: normalizedLanguage,
      theme: "github-dark",
    });
  } catch {
    return await codeToHtml(code, {
      lang: "text",
      theme: "github-dark",
    });
  }
}
