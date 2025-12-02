import Link from "next/link";
import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      <Link
        href="/browse"
        className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
      >
        <span aria-hidden>&larr;</span>
        Back to Browse
      </Link>
      {children}
    </div>
  );
}
