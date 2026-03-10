import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, FileText, Tags, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Articles",
    description: "Tulis dan bagikan artikel teknikal dengan rich text editor.",
  },
  {
    icon: Code2,
    title: "Code Snippets",
    description: "Simpan dan bagikan snippet kode dengan syntax highlighting.",
  },
  {
    icon: Tags,
    title: "Tags",
    description: "Organisasi konten dengan sistem tagging yang fleksibel.",
  },
  {
    icon: Zap,
    title: "Fast API",
    description: "Ditenagai Laravel 11 dengan OpenAPI docs yang lengkap.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <Badge variant="secondary" className="mb-6">
          REST API + Next.js Frontend
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
          Developer Resource Hub
          <span className="block text-slate-500 dark:text-slate-400">
            untuk Developer
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Platform untuk berbagi artikel dan code snippet. Dibangun dengan
          Laravel 11 & Next.js 15.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Button asChild size="lg" className="gap-2">
            <Link href="/articles">
              Explore Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/snippets">Browse Snippets</Link>
          </Button>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
