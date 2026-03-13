import { highlightCodeWithShikiAutoTheme } from "@/lib/shiki";
import { CopyCodeButton } from "@/components/snippet/CopyCodeButton";

interface CodeBlockProps {
  code: string;
  language: string;
  showHeader?: boolean;
  highlightLines?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  language,
  showHeader = true,
  highlightLines,
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const { lightHtml, darkHtml, normalizedLanguage } =
    await highlightCodeWithShikiAutoTheme(
    code,
    language,
    highlightLines,
    showLineNumbers,
  );

  return (
    <div className="snippet-code-block relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      {showHeader && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="min-w-0 flex items-center gap-3">
            {filename ? (
              <span className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-200">
                {filename}
              </span>
            ) : null}
            <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-mono text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              {normalizedLanguage}
            </span>
          </div>
          <CopyCodeButton code={code} />
        </div>
      )}
      <div
        className="overflow-x-auto dark:hidden [&_pre]:m-0! [&_pre]:p-5! [&_pre]:text-sm [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
      <div
        className="hidden overflow-x-auto dark:block [&_pre]:m-0! [&_pre]:p-5! [&_pre]:text-sm [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />
    </div>
  );
}
