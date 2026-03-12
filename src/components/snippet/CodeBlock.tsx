import { highlightCodeWithShikiAutoTheme } from "@/lib/shiki";
import { CopyCodeButton } from "@/components/snippet/CopyCodeButton";

interface CodeBlockProps {
  code: string;
  language: string;
  showHeader?: boolean;
  highlightLines?: string;
}

export async function CodeBlock({
  code,
  language,
  showHeader = true,
  highlightLines,
}: CodeBlockProps) {
  const { lightHtml, darkHtml } = await highlightCodeWithShikiAutoTheme(
    code,
    language,
    highlightLines,
  );

  return (
    <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {language}
          </span>
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
