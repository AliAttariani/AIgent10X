import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center justify-center px-4 pb-24 pt-24 text-center md:px-6">
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16">
        <h1 className="text-2xl font-semibold text-foreground">
          We couldn&apos;t find what you&apos;re looking for.
        </h1>
        <p className="text-sm text-muted-foreground">
          The page may have moved. Browse our verified agents instead.
        </p>
        <Link href="/browse" className={buttonVariants({ size: "lg" })}>
          Back to Browse
        </Link>
      </div>
    </main>
  );
}
