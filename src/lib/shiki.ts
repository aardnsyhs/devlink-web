import { cache } from "react";
import { codeToHtml } from "shiki";

type ThemeKey = "dark" | "light";
type LineAnnotationKind = "highlight" | "focus" | "add" | "remove";

type CodeStats = {
  addedCount: number;
  hasDiff: boolean;
  lineCount: number;
  removedCount: number;
  wordHighlightCount: number;
};

type CodeAnnotations = {
  annotations: Record<LineAnnotationKind, Set<number>>;
  cleanedCode: string;
  stats: CodeStats;
  wordHighlights: Array<{
    placeholder: string;
    value: string;
  }>;
};

const DEVLINK_THEMES = {
  dark: {
    bg: "#1e2430",
    colors: {
      "editor.background": "#1e2430",
      "editor.foreground": "#e7ecf3",
    },
    name: "devlink-dark",
    tokenColors: [
      { scope: ["comment"], settings: { foreground: "#6b7280", fontStyle: "italic" } },
      { scope: ["keyword", "storage"], settings: { foreground: "#ff7a90" } },
      { scope: ["string"], settings: { foreground: "#98e4c6" } },
      { scope: ["constant.numeric"], settings: { foreground: "#f7c96f" } },
      { scope: ["entity.name.function", "support.function"], settings: { foreground: "#8cc8ff" } },
      { scope: ["entity.name.type", "support.type", "entity.name.class"], settings: { foreground: "#b7a6ff" } },
      { scope: ["variable", "meta.definition.variable"], settings: { foreground: "#f2f5f9" } },
      { scope: ["punctuation", "meta.brace"], settings: { foreground: "#94a3b8" } },
    ],
    type: "dark",
  },
  light: {
    bg: "#f6f7fb",
    colors: {
      "editor.background": "#f6f7fb",
      "editor.foreground": "#18212f",
    },
    name: "devlink-light",
    tokenColors: [
      { scope: ["comment"], settings: { foreground: "#7b8698", fontStyle: "italic" } },
      { scope: ["keyword", "storage"], settings: { foreground: "#d72660" } },
      { scope: ["string"], settings: { foreground: "#0f9d74" } },
      { scope: ["constant.numeric"], settings: { foreground: "#b7791f" } },
      { scope: ["entity.name.function", "support.function"], settings: { foreground: "#1565c0" } },
      { scope: ["entity.name.type", "support.type", "entity.name.class"], settings: { foreground: "#6d28d9" } },
      { scope: ["variable", "meta.definition.variable"], settings: { foreground: "#18212f" } },
      { scope: ["punctuation", "meta.brace"], settings: { foreground: "#52606d" } },
    ],
    type: "light",
  },
} as const;

const LANGUAGE_ALIASES: Record<string, string> = {
  "c#": "csharp",
  csharp: "csharp",
  js: "javascript",
  jsx: "jsx",
  md: "markdown",
  mysql: "sql",
  plaintext: "text",
  postgres: "sql",
  py: "python",
  rb: "ruby",
  sh: "bash",
  shell: "bash",
  ts: "typescript",
  tsx: "tsx",
  yml: "yaml",
  zsh: "bash",
};

const COMMENT_PREFIX = String.raw`(?:(?:\/\/|#|\/\*+|\*|<!--)\s*)?`;
const COMMENT_SUFFIX = String.raw`(?:\*\/|-->)?`;
const STANDALONE_NOTATION_PATTERN = new RegExp(
  String.raw`^\s*${COMMENT_PREFIX}\[!code\s+(highlight|focus|\+\+|--)(?::(\d+))?\]\s*${COMMENT_SUFFIX}\s*$`,
);
const INLINE_NOTATION_PATTERN = new RegExp(
  String.raw`\s+${COMMENT_PREFIX}\[!code\s+(highlight|focus|\+\+|--)\]\s*${COMMENT_SUFFIX}\s*$`,
);
const WORD_HIGHLIGHT_PATTERN = /\[\[(.+?)\]\]/g;

function createEmptyAnnotations() {
  return {
    add: new Set<number>(),
    focus: new Set<number>(),
    highlight: new Set<number>(),
    remove: new Set<number>(),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
  const wordHighlights: CodeAnnotations["wordHighlights"] = [];
  let wordHighlightIndex = 0;

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
    let cleanedLine = inlineMatch
      ? rawLine.replace(INLINE_NOTATION_PATTERN, "")
      : rawLine;

    cleanedLine = cleanedLine.replace(WORD_HIGHLIGHT_PATTERN, (_match, value) => {
      const placeholder = `DEVLINKWORDTOKEN${wordHighlightIndex}`;
      wordHighlightIndex += 1;
      wordHighlights.push({ placeholder, value });
      return placeholder;
    });

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
    stats: {
      addedCount: annotations.add.size,
      hasDiff: annotations.add.size > 0 || annotations.remove.size > 0,
      lineCount: cleanedLines.length,
      removedCount: annotations.remove.size,
      wordHighlightCount: wordHighlights.length,
    },
    wordHighlights,
  };
}

function applyWordHighlights(
  html: string,
  wordHighlights: CodeAnnotations["wordHighlights"],
) {
  return wordHighlights.reduce((output, { placeholder, value }) => {
    return output.replaceAll(
      placeholder,
      `<span class="highlighted-word">${escapeHtml(value)}</span>`,
    );
  }, html);
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

    const isAdded = annotations.add.has(lineNumber);
    const isRemoved = annotations.remove.has(lineNumber);
    const isAddedStart = isAdded && !annotations.add.has(lineNumber - 1);
    const isAddedEnd = isAdded && !annotations.add.has(lineNumber + 1);
    const isRemovedStart = isRemoved && !annotations.remove.has(lineNumber - 1);
    const isRemovedEnd = isRemoved && !annotations.remove.has(lineNumber + 1);

    const classes = [
      "line",
      highlighted.has(lineNumber) ? "is-highlighted" : "",
      focused.has(lineNumber) ? "is-focused" : "",
      isAdded ? "is-added" : "",
      isRemoved ? "is-removed" : "",
      isAddedStart ? "is-added-start" : "",
      isAddedEnd ? "is-added-end" : "",
      isRemovedStart ? "is-removed-start" : "",
      isRemovedEnd ? "is-removed-end" : "",
      hasFocusedLines && !focused.has(lineNumber) ? "is-dimmed" : "",
      showLineNumbers ? "has-line-number" : "without-line-number",
    ]
      .filter(Boolean)
      .join(" ");

    return `<span class="${classes}" data-line="${lineNumber}"><a class="line-anchor" href="#L${lineNumber}" data-line-link="L${lineNumber}" aria-label="Copy link to line ${lineNumber}"></a>`;
  });
}

const highlightCodeCached = cache(
  async (
    code: string,
    language: string,
    theme: ThemeKey,
    highlightedLines?: string,
    showLineNumbers = true,
  ) => {
    const normalizedLanguage = normalizeLanguage(language);
    const processed = preprocessCodeAnnotations(code);

    try {
      const html = await codeToHtml(processed.cleanedCode, {
        lang: normalizedLanguage,
        theme: DEVLINK_THEMES[theme],
      });

      return {
        html: applyWordHighlights(
          withLineMetadata(
            html,
            highlightedLines,
            showLineNumbers,
            processed.annotations,
          ),
          processed.wordHighlights,
        ),
        stats: processed.stats,
      };
    } catch {
      const html = await codeToHtml(processed.cleanedCode, {
        lang: "text",
        theme: DEVLINK_THEMES[theme],
      });

      return {
        html: applyWordHighlights(
          withLineMetadata(
            html,
            highlightedLines,
            showLineNumbers,
            processed.annotations,
          ),
          processed.wordHighlights,
        ),
        stats: processed.stats,
      };
    }
  },
);

export async function highlightCodeWithShiki(
  code: string,
  language: string,
  theme: ThemeKey,
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
  const [lightResult, darkResult] = await Promise.all([
    highlightCodeWithShiki(
      code,
      language,
      "light",
      highlightedLines,
      showLineNumbers,
    ),
    highlightCodeWithShiki(
      code,
      language,
      "dark",
      highlightedLines,
      showLineNumbers,
    ),
  ]);

  return {
    darkHtml: darkResult.html,
    lightHtml: lightResult.html,
    normalizedLanguage: normalizeLanguage(language),
    stats: darkResult.stats,
  };
}
