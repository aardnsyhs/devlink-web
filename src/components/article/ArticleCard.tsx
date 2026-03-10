import Link from "next/link";
import { Article } from "@/types/article";
import { TagBadge } from "@/components/shared/TagBadge";
import { Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}
      <Link href={`/articles/${article.slug}`}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2 mb-2">
          {article.title}
        </h2>
      </Link>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {article.author?.name}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(article.created_at), {
              addSuffix: true,
              locale: id,
            })}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {article.views.toLocaleString()}
        </span>
      </div>
    </article>
  );
}
