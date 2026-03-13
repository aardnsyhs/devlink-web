"use client";

import { useEffect, useMemo, useState } from "react";
import { CodeBlockEnhancer } from "@/components/snippet/CodeBlockEnhancer";
import { CodeBlockViewport } from "@/components/snippet/CodeBlockViewport";
import { CopyCodeButton } from "@/components/snippet/CopyCodeButton";
import type { CodeStats } from "@/lib/shiki";

type PreviewResponse = {
  darkHtml: string;
  lightHtml: string;
  normalizedLanguage: string;
  stats: CodeStats;
};

type SnippetLivePreviewProps = {
  code: string;
  language: string;
};

export function SnippetLivePreview({
  code,
  language,
}: SnippetLivePreviewProps) {
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blockId = useMemo(
    () => `code-preview-${Math.random().toString(36).slice(2, 10)}`,
    [],
  );

  useEffect(() => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setPreview(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/code-preview", {
          body: JSON.stringify({
            code: trimmedCode,
            language: language || "text",
            showLineNumbers: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Preview request failed");
        }

        const data = (await response.json()) as PreviewResponse;
        setPreview(data);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        console.error(requestError);
        setError("Gagal membuat preview code");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [code, language]);

  if (!code.trim()) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Preview code akan muncul di sini saat kamu mulai menulis snippet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Live Preview
        </p>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {isLoading ? "Updating preview..." : "Renderer final output"}
        </span>
      </div>
      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {preview ? (
        <div
          id={blockId}
          className="snippet-code-block relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
        >
          <CodeBlockEnhancer blockId={blockId} />
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-100 px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="min-w-0 flex items-center gap-3">
              <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-mono text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                {preview.normalizedLanguage}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {preview.stats.lineCount} lines
              </span>
              {preview.stats.hasDiff ? (
                <>
                  <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 dark:text-emerald-300">
                    diff view
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    +{preview.stats.addedCount} / -{preview.stats.removedCount}
                  </span>
                </>
              ) : null}
              {preview.stats.wordHighlightCount > 0 ? (
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {preview.stats.wordHighlightCount} word focus
                </span>
              ) : null}
            </div>
            <CopyCodeButton code={code} />
          </div>
          <CodeBlockViewport lineCount={preview.stats.lineCount}>
            <div
              className="overflow-x-auto bg-[#f6f7fb] dark:hidden [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-5! [&_pre]:text-sm [&_pre]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: preview.lightHtml }}
            />
            <div
              className="hidden overflow-x-auto bg-[#1e2430] dark:block [&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-5! [&_pre]:text-sm [&_pre]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: preview.darkHtml }}
            />
          </CodeBlockViewport>
        </div>
      ) : null}
    </div>
  );
}
