"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type CodeBlockEnhancerProps = {
  blockId: string;
};

function syncTargetedLine(container: HTMLElement) {
  const hash = window.location.hash.replace("#", "");
  const targetLine = hash.startsWith("L") ? hash.slice(1) : "";

  container.querySelectorAll<HTMLElement>(".line.is-targeted").forEach((line) => {
    line.classList.remove("is-targeted");
  });

  if (!targetLine) return;

  container
    .querySelectorAll<HTMLElement>(`.line[data-line="${targetLine}"]`)
    .forEach((line) => {
      line.classList.add("is-targeted");
    });
}

export function CodeBlockEnhancer({ blockId }: CodeBlockEnhancerProps) {
  useEffect(() => {
    const container = document.getElementById(blockId);
    if (!container) return;

    const handleClick = async (event: Event) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>(".line-anchor");

      if (!anchor) return;

      event.preventDefault();

      const hash = anchor.dataset.lineLink;
      if (!hash) return;

      const url = new URL(window.location.href);
      url.hash = hash;

      try {
        await navigator.clipboard.writeText(url.toString());
        toast.success(`Link ${hash} copied`);
      } catch {
        toast.error("Gagal menyalin link baris");
      }

      window.history.replaceState(null, "", url.toString());
      syncTargetedLine(container);
    };

    const handleHashChange = () => syncTargetedLine(container);

    container.addEventListener("click", handleClick);
    window.addEventListener("hashchange", handleHashChange);
    syncTargetedLine(container);

    return () => {
      container.removeEventListener("click", handleClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [blockId]);

  return null;
}
