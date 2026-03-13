import { cache } from "react";
import { codeToHtml } from "shiki";

type ShikiTheme = "github-dark" | "github-light";
type LineAnnotationKind = "highlight" | "focus" | "add" | "remove";

type CodeAnnotations = {
  cleanedCode: string;
  annotations: Record<LineAnnotationKind, Set<number>>;
};

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

const COMMENT_PREFIX = String.raw`(?:(?:\/\/|#|\/\*+|\*|<!--)\s*)?`;
const COMMENT_SUFFIX = String.raw`(?:\*\/|-->)?`;
const STANDALONE_NOTATION_PATTERN = new RegExp(
  String.raw`^\s*${COMMENT_PREFIX}\[!code\s+(highlight|focus|\+\+|--)(?::(\d+))?\]\s*${COMMENT_SUFFIX}\s*$`,
);
const INLINE_NOTATION_PATTERN = new RegExp(
  String.raw`\s+${COMMENT_PREFIX}\[!code\s+(highlight|focus|\+\+|--)\]\s*${COMMENT_SUFFIX}\s*$`,
);

function createEmptyAnnotations() {
  return {
    add: new Set<number>(),
    focus: new Set<number>(),
    highlight: new Set<number>(),
    remove: new Set<number>(),
  };
}

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

function mapNotationKind(value: string): LineAnnotationKind {
  if (value === "++") return "add";
  if (value === "--") return "remove";
  return value as LineAnnotationKind;
}

function preprocessCodeAnnotations(code: string): CodeAnnotations {
  const annotations = createEmptyAnnotations();
  const lines = code.split("\n");
  const cleanedLines: string[] = [];
  const pending: Array<{ kind: LineAnnotationKind; remaining: number }> = [];

  for (const rawLine of lines) {
    const standaloneMatch = rawLine.match(STANDALONE_NOTATION_PATTERN);

    if (standaloneMatch) {
      pending.push({
        kind: mapNotationKind(standaloneMatch[1]),
        remaining: Math.max(1, Number(standaloneMatch[2] ?? 1) || 1),
      });
      continue;
    }

    const lineNumber = cleanedLines.length + 1;
    const inlineMatch = rawLine.match(INLINE_NOTATION_PATTERN);
    const cleanedLine = inlineMatch
      ? rawLine.replace(INLINE_NOTATION_PATTERN, "")
      : rawLine;

    cleanedLines.push(cleanedLine);

    if (inlineMatch) {
      annotations[mapNotationKind(inlineMatch[1])].add(lineNumber);
    }

    for (const directive of pending) {
      annotations[directive.kind].add(lineNumber);
      directive.remaining -= 1;
    }

    for (let index = pending.length - 1; index >= 0; index -= 1) {
      if (pending[index].remaining <= 0) {
        pending.splice(index, 1);
      }
    }
  }

  return {
    annotations,
    cleanedCode: cleanedLines.join("\n"),
  };
}

function withLineMetadata(
  html: string,
  highlightedLines?: string,
  showLineNumbers = true,
  annotations = createEmptyAnnotations(),
) {
  const queryHighlights = parseHighlightedLines(highlightedLines);
  const highlighted = new Set<number>([
    ...annotations.highlight,
    ...queryHighlights,
  ]);
  const focused = new Set<number>([...annotations.focus, ...queryHighlights]);
  const hasFocusedLines = focused.size > 0;
  let lineNumber = 0;

  return html.replace(/<span class="line">/g, () => {
    lineNumber += 1;
    const classes = [
      "line",
      highlighted.has(lineNumber) ? "is-highlighted" : "",
      focused.has(lineNumber) ? "is-focused" : "",
      annotations.add.has(lineNumber) ? "is-added" : "",
      annotations.remove.has(lineNumber) ? "is-removed" : "",
      hasFocusedLines && !focused.has(lineNumber) ? "is-dimmed" : "",
      showLineNumbers ? "has-line-number" : "without-line-number",
    ]
      .filter(Boolean)
      .join(" ");

    return `<span id="L${lineNumber}" class="${classes}" data-line="${lineNumber}"><a class="line-anchor" href="#L${lineNumber}" aria-label="Go to line ${lineNumber}"></a>`;
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
    const { annotations, cleanedCode } = preprocessCodeAnnotations(code);

    try {
      const html = await codeToHtml(cleanedCode, {
        lang: normalizedLanguage,
        theme,
      });

      return withLineMetadata(
        html,
        highlightedLines,
        showLineNumbers,
        annotations,
      );
    } catch {
      const html = await codeToHtml(cleanedCode, {
        lang: "text",
        theme,
      });

      return withLineMetadata(
        html,
        highlightedLines,
        showLineNumbers,
        annotations,
      );
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
