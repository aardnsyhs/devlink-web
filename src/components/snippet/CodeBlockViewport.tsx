"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type CodeBlockViewportProps = {
  children: ReactNode;
  collapseLines?: number;
  lineCount: number;
};

export function CodeBlockViewport({
  children,
  collapseLines = 18,
  lineCount,
}: CodeBlockViewportProps) {
  const [expanded, setExpanded] = useState(false);
  const canToggle = lineCount > collapseLines;

  return (
    <div className="relative">
      <div
        className={
          canToggle && !expanded ? "max-h-136 overflow-hidden" : undefined
        }
      >
        {children}
      </div>
      {canToggle && !expanded ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-zinc-100 via-zinc-100/92 to-transparent dark:from-zinc-900 dark:via-zinc-900/88" />
      ) : null}
      {canToggle ? (
        <div className="relative z-10 flex justify-center border-t border-zinc-200 bg-zinc-100/95 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/95">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2 border border-zinc-300 bg-white text-zinc-950! shadow-sm hover:bg-zinc-50 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-50! dark:hover:bg-zinc-700 [&_svg]:text-inherit!"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Shrink
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expand
              </>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
