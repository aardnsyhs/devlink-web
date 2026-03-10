import Link from "next/link";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <div className="h-6 w-6 rounded-md bg-slate-900 dark:bg-white flex items-center justify-center">
            <Code2 className="h-3.5 w-3.5 text-white dark:text-slate-900" />
          </div>
          DevLink
        </Link>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} DevLink. Built with Laravel + Next.js.
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link
            href="/articles"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Articles
          </Link>
          <Link
            href="/snippets"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Snippets
          </Link>
          <a
            href="https://api.ardiansyahsulistyo.me/api/documentation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            API Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
