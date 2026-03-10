import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";

export default function NotFoundPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <EmptyStateIllustration
          variant="generic"
          className="h-32 w-32 mx-auto"
        />
        <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
          ERROR 404
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          URL yang kamu buka tidak tersedia atau sudah dipindahkan. Coba kembali
          ke halaman utama atau jelajahi konten DevLink.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Button asChild>
            <Link href="/">Kembali ke Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/articles">Lihat Articles</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/snippets">Lihat Snippets</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
