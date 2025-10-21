import type { Metadata } from "next";
import Link from "next/link";
import { AgreementBody } from "@/components/legal/agreement-body";

export const metadata: Metadata = {
  title: "Creator Agreement – AIgent10X",
};

export default function CreatorAgreementPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <Link
        href="/creator/agents/new"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <span aria-hidden>←</span>
        Back to form
      </Link>
      <h1>Creator Agreement</h1>
      <AgreementBody />
    </div>
  );
}
