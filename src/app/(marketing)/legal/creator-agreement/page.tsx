import type { Metadata } from "next";
import Link from "next/link";

import { AgreementBody } from "@/components/legal/agreement-body";
import { PrintButton } from "@/components/legal/print-button";

export const metadata: Metadata = {
  title: "Creator Agreement – AIgent10X",
};

function ActionBar() {
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 text-sm">
      <Link
        href="/creator/agents/new"
        className="inline-flex items-center rounded-md border border-border px-3 py-1.5 font-medium text-primary transition hover:border-primary hover:text-primary/90"
      >
        &larr; Back to form
      </Link>
      <div className="flex items-center gap-2">
        <a
          href="/legal/creator-agreement"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md border border-border px-3 py-1.5 font-medium text-primary transition hover:border-primary hover:text-primary/90"
        >
          Open in new tab
        </a>
        <PrintButton />
      </div>
    </div>
  );
}

export default function CreatorAgreementPage() {
  return (
    <main className="pb-12">
      <ActionBar />
      <div className="mx-auto max-w-3xl px-4 py-10 prose prose-neutral dark:prose-invert">
        <AgreementBody />
      </div>
      <ActionBar />
    </main>
  );
}
