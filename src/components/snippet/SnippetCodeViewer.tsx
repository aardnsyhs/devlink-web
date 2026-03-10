"use client";

import { useState } from "react";
import { WrapText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyCodeButton } from "@/components/snippet/CopyCodeButton";

type SnippetCodeViewerProps = {
  language: string;
  code: string;
  lightHtml: string;
  darkHtml: string;
};

export function SnippetCodeViewer({
  language,
  code,
  lightHtml,
  darkHtml,
}: SnippetCodeViewerProps) {
  const [wrapLines, setWrapLines] = useState(false);

  return (
    <div className="snippet-code-block relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {language}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            onClick={() => setWrapLines((prev) => !prev)}
          >
            <WrapText className="h-3.5 w-3.5" />
            <span className="text-xs">{wrapLines ? "Unwrap" : "Wrap"}</span>
          </Button>
          <CopyCodeButton code={code} />
        </div>
      </div>
      <div
        className={`overflow-x-auto dark:hidden [&_pre]:m-0! [&_pre]:p-5! [&_pre]:text-sm [&_pre]:leading-relaxed ${wrapLines ? "[&_pre]:whitespace-pre-wrap [&_pre]:wrap-break-word" : ""}`}
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
      <div
        className={`hidden overflow-x-auto dark:block [&_pre]:m-0! [&_pre]:p-5! [&_pre]:text-sm [&_pre]:leading-relaxed ${wrapLines ? "[&_pre]:whitespace-pre-wrap [&_pre]:wrap-break-word" : ""}`}
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />
    </div>
  );
}
