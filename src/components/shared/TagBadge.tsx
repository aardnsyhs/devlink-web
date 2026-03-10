import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/types/tag";

export function TagBadge({
  tag,
  linked = true,
}: {
  tag: Tag;
  linked?: boolean;
}) {
  if (!linked) return <Badge variant="secondary">{tag.name}</Badge>;
  return (
    <Link href={`/articles?tag=${tag.slug}`}>
      <Badge
        variant="secondary"
        className="hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
      >
        {tag.name}
      </Badge>
    </Link>
  );
}
