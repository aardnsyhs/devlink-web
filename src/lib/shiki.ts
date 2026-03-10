import { codeToHtml } from "shiki";

type ShikiTheme = "github-dark" | "github-light";

function parseHighlightedLines(input?: string) {
  const highlighted = new Set<number>();
  if (!input) return highlighted;

  for (const part of input.split(",")) {
    const chunk = part.trim();
    if (!chunk) continue;

    if (chunk.includes("-")) {
      const [startRaw, endRaw] = chunk.split("-");
      const start = Number(startRaw);
      const end = Number(endRaw);

      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;

      const from = Math.max(1, Math.min(start, end));
      const to = Math.max(1, Math.max(start, end));

      for (let line = from; line <= to; line += 1) highlighted.add(line);
      continue;
    }

    const line = Number(chunk);
    if (Number.isFinite(line) && line > 0) highlighted.add(line);
  }

  return highlighted;
}

function withLineMetadata(html: string, highlightedLines?: string) {
  const highlighted = parseHighlightedLines(highlightedLines);
  let lineNumber = 0;

  return html.replace(/<span class="line">/g, () => {
    lineNumber += 1;
    const extra = highlighted.has(lineNumber) ? " is-highlighted" : "";
    return `<span class="line${extra}" data-line="${lineNumber}">`;
  });
}

export async function highlightCodeWithShiki(
  code: string,
  language: string,
  theme: ShikiTheme,
  highlightedLines?: string,
) {
  const normalizedLanguage = language?.toLowerCase() || "text";

  try {
    const html = await codeToHtml(code, {
      lang: normalizedLanguage,
      theme,
    });

    return withLineMetadata(html, highlightedLines);
  } catch {
    const html = await codeToHtml(code, {
      lang: "text",
      theme,
    });

    return withLineMetadata(html, highlightedLines);
  }
}

export async function highlightCodeWithShikiAutoTheme(
  code: string,
  language: string,
  highlightedLines?: string,
) {
  const [lightHtml, darkHtml] = await Promise.all([
    highlightCodeWithShiki(code, language, "github-light", highlightedLines),
    highlightCodeWithShiki(code, language, "github-dark", highlightedLines),
  ]);

  return { lightHtml, darkHtml };
}
