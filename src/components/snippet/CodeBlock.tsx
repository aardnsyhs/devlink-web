import { highlightCodeWithShikiAutoTheme } from "@/lib/shiki";
import { CopyCodeButton } from "@/components/snippet/CopyCodeButton";
import { CodeBlockEnhancer } from "@/components/snippet/CodeBlockEnhancer";
import { CodeBlockViewport } from "@/components/snippet/CodeBlockViewport";

interface CodeBlockProps {
  code: string;
  language: string;
  showHeader?: boolean;
  highlightLines?: string;
  showLineNumbers?: boolean;
}

function countCodeLines(code: string) {
  if (!code) return 0;

  return code.split("\n").length;
}

export async function CodeBlock({
  code,
  language,
  showHeader = true,
  highlightLines,
  showLineNumbers = true,
}: CodeBlockProps) {
  const blockId = `code-block-${crypto.randomUUID()}`;
  const { lightHtml, darkHtml, normalizedLanguage, stats } =
    await highlightCodeWithShikiAutoTheme(
      code,
      language,
      highlightLines,
      showLineNumbers,
    );
  const lineCount = stats.lineCount || countCodeLines(code);

  return (
    <div
      id={blockId}
      className="snippet-code-block relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
    >
      <CodeBlockEnhancer blockId={blockId} />
      {showHeader && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="min-w-0 flex items-center gap-3">
            <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-mono text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              {normalizedLanguage}
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {lineCount} lines
            </span>
            {stats.hasDiff ? (
              <>
                <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 dark:text-emerald-300">
                  diff view
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  +{stats.addedCount} / -{stats.removedCount}
                </span>
              </>
            ) : null}
            {stats.wordHighlightCount > 0 ? (
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {stats.wordHighlightCount} word focus
              </span>
            ) : null}
            {highlightLines ? (
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                focus: {highlightLines}
              </span>
            ) : null}
          </div>
          <CopyCodeButton code={code} />
        </div>
      )}
      <CodeBlockViewport lineCount={lineCount}>
        <div
          className="overflow-x-auto bg-[#f6f7fb] dark:hidden [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-5! [&_pre]:text-sm [&_pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: lightHtml }}
        />
        <div
          className="hidden overflow-x-auto bg-[#1e2430] dark:block [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-5! [&_pre]:text-sm [&_pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: darkHtml }}
        />
      </CodeBlockViewport>
    </div>
  );
}
