"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { loadDraft } from "@/lib/creator-drafts";
import { MOCK_USER } from "@/config/mock-user";

const CURRENT_USER_ID = MOCK_USER.id;

type DraftContent = {
  basics?: Record<string, unknown>;
  pricing?: Record<string, unknown>;
  tech?: Record<string, unknown>;
  termsAccepted?: boolean;
};

type DraftRecord = {
  updatedAt: number | null;
  data: DraftContent | null;
};

export default function CreatorDraftsPage() {
  const [draft, setDraft] = useState<DraftRecord | null>(null);
  const planVariant = MOCK_USER.plan === "free" ? "outline" : "default";
  const planLabel = MOCK_USER.plan === "free" ? "Explorer" : "Pro Creator";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await loadDraft(CURRENT_USER_ID);
      if (cancelled) {
        return;
      }

      const toRecord = (value: unknown): Record<string, unknown> | null =>
        typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

      const draftData = toRecord(stored);
      let updatedAt: number | null = null;

      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem(`draft:${CURRENT_USER_ID}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.ts === "number") {
              updatedAt = parsed.ts;
            }
          }
        } catch {
          // ignore malformed storage entries
        }
      }

      setDraft(draftData ? { data: draftData, updatedAt } : null);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const asRecord = (value: unknown): Record<string, unknown> | null =>
    typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

  const basics = asRecord(draft?.data?.basics) ?? {};
  const title = typeof basics.name === "string" && basics.name.trim() ? basics.name : "Untitled agent";
  const description =
    typeof basics.tagline === "string" && basics.tagline.trim() ? basics.tagline : undefined;
  const lastUpdated = draft?.updatedAt ? new Date(draft.updatedAt).toLocaleString() : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-12 md:px-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Saved drafts</h1>
          <p className="text-sm text-muted-foreground">Resume an in-progress submission when you are ready.</p>
        </div>
        <Badge variant={planVariant} className="self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          {planLabel}
        </Badge>
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
