import { cache } from "react";
import { codeToHtml } from "shiki";

type ShikiTheme = "github-dark" | "github-light";

const LANGUAGE_ALIASES: Record<string, string> = {
  csharp: "csharp",
  "c#": "csharp",
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  rb: "ruby",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
  mysql: "sql",
  postgres: "sql",
  plaintext: "text",
};

function normalizeLanguage(language?: string) {
  const normalized = language?.toLowerCase().trim() || "text";

  return LANGUAGE_ALIASES[normalized] ?? normalized;
}

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

function withLineMetadata(
  html: string,
  highlightedLines?: string,
  showLineNumbers = true,
) {
  const highlighted = parseHighlightedLines(highlightedLines);
  const hasHighlightedLines = highlighted.size > 0;
  let lineNumber = 0;

  return html.replace(/<span class="line">/g, () => {
    lineNumber += 1;
    const classes = [
      "line",
      highlighted.has(lineNumber) ? "is-highlighted" : "",
      hasHighlightedLines && !highlighted.has(lineNumber) ? "is-dimmed" : "",
      showLineNumbers ? "has-line-number" : "without-line-number",
    ]
      .filter(Boolean)
      .join(" ");

    return `<span id="L${lineNumber}" class="${classes}" data-line="${lineNumber}">`;
  });
}

const highlightCodeCached = cache(
  async (
    code: string,
    language: string,
    theme: ShikiTheme,
    highlightedLines?: string,
    showLineNumbers = true,
  ) => {
    const normalizedLanguage = normalizeLanguage(language);

    try {
      const html = await codeToHtml(code, {
        lang: normalizedLanguage,
        theme,
      });

      return withLineMetadata(html, highlightedLines, showLineNumbers);
    } catch {
      const html = await codeToHtml(code, {
        lang: "text",
        theme,
      });

      return withLineMetadata(html, highlightedLines, showLineNumbers);
    }
  },
);

export async function highlightCodeWithShiki(
  code: string,
  language: string,
  theme: ShikiTheme,
  highlightedLines?: string,
  showLineNumbers = true,
) {
  return highlightCodeCached(
    code,
    language,
    theme,
    highlightedLines,
    showLineNumbers,
  );
}

export async function highlightCodeWithShikiAutoTheme(
  code: string,
  language: string,
  highlightedLines?: string,
  showLineNumbers = true,
) {
  const [lightHtml, darkHtml] = await Promise.all([
    highlightCodeWithShiki(
      code,
      language,
      "github-light",
      highlightedLines,
      showLineNumbers,
    ),
    highlightCodeWithShiki(
      code,
      language,
      "github-dark",
      highlightedLines,
      showLineNumbers,
    ),
  ]);

  return {
    darkHtml,
    lightHtml,
    normalizedLanguage: normalizeLanguage(language),
  };
}
