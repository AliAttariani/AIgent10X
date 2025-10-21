"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadDraft } from "@/lib/creator-drafts";

const MOCK_USER_ID = "mock-user-123";

type DraftRecord = {
  updatedAt: number;
  data: Record<string, unknown> | null;
};

export default function CreatorDraftsPage() {
  const [draft, setDraft] = useState<DraftRecord | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await loadDraft(MOCK_USER_ID);
      if (cancelled) return;

      if (stored) {
        setDraft({
          updatedAt: stored.updatedAt,
          data: (stored.data as Record<string, unknown>) ?? null,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const basics = (draft?.data?.basics as { name?: string; tagline?: string } | undefined) ?? {};
  const title = basics.name?.trim() ? basics.name : "Untitled agent";
  const description = basics.tagline?.trim() ? basics.tagline : undefined;
  const lastUpdated = draft ? new Date(draft.updatedAt).toLocaleString() : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-12 md:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Saved drafts</h1>
        <p className="text-sm text-muted-foreground">Resume an in-progress submission when you are ready.</p>
      </header>

      <section className="rounded-2xl border border-border bg-muted/40 p-6">
        {draft ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
              {lastUpdated ? (
                <p className="text-xs text-muted-foreground">Last updated {lastUpdated}</p>
              ) : null}
            </div>
            <Link
              href="/creator/agents/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
            >
              Resume
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No drafts saved yet. Start a new agent submission to create a draft.
          </p>
        )}
      </section>
    </main>
  );
}
