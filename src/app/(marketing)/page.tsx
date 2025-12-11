import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  managedAutomations,
  type AutomationCategory,
  type ManagedAutomation,
} from "@/data/automations";

const CATEGORY_LABELS: Record<AutomationCategory, string> = {
  "lead-generation": "Lead generation",
  "content-automation": "Content automation",
  "sales-follow-up": "Sales follow-up",
  "customer-support": "Customer support",
  "workflow-automation": "Workflow automation",
  "research-analysis": "Research & analysis",
};

const PLAN_LABELS: Record<ManagedAutomation["planType"], string> = {
  managed: "Managed plan",
};

const FEATURED_AUTOMATIONS: ManagedAutomation[] = (() => {
  const ordered = [...managedAutomations].sort(
    (a, b) => (a.launchOrder ?? Number.MAX_SAFE_INTEGER) - (b.launchOrder ?? Number.MAX_SAFE_INTEGER),
  );
  const featured = ordered.filter((automation) => automation.isFeatured);
  const source = featured.length >= 3 ? featured : ordered;
  return source.slice(0, 3);
})();

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-12 md:px-8">
      <section className="text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <p className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            AI operations layer for fast-moving teams
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Automations that save time and grow your revenue.
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            PantherIQ designs, runs, and maintains AI automations so your team gets measurable wins without hiring, training, or building from scratch.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/browse"
              className="w-full rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 sm:w-auto"
            >
              Explore automations
            </Link>
            <Link
              href="/creator/agents/new"
              className="w-full rounded-md border border-primary px-6 py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground sm:w-auto"
              aria-label="Book a demo"
              title="Book a demo"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 rounded-lg border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm sm:flex-row sm:justify-center">
        <span>Verified automations operated by PantherIQ</span>
        <span className="hidden sm:block">•</span>
        <span>Stripe-secured contracts & billing</span>
        <span className="hidden sm:block">•</span>
        <span>7-day performance guarantee</span>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Featured Automations</h2>
            <p className="text-sm text-muted-foreground">
              Curated PantherIQ playbooks that deliver outcomes we can prove.
            </p>
          </div>
          <Link
            href="/browse"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_AUTOMATIONS.map((automation) => (
            <article
              key={automation.slug}
              className="flex flex-col justify-between rounded-lg border bg-card p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="uppercase tracking-wide">
                    {CATEGORY_LABELS[automation.category]}
                  </Badge>
                  <Badge variant="secondary" className="text-foreground">
                    {PLAN_LABELS[automation.planType]}
                  </Badge>
                  {automation.runByPantherIQ ? (
                    <Badge className="bg-black text-white">Run by PantherIQ</Badge>
                  ) : null}
                  {automation.verified ? (
                    <Badge className="bg-emerald-600 text-white">Verified automation</Badge>
                  ) : null}
                </div>
                <h3 className="text-lg font-semibold">{automation.name}</h3>
                <p className="text-sm font-semibold text-foreground">
                  {automation.heroTagline}
                </p>
                <p className="text-sm text-muted-foreground">
                  {automation.outcomeSummary}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm">
                {automation.rating ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span aria-hidden>⭐</span>
                    <span>{automation.rating.toFixed(1)}</span>
                  </span>
                ) : (
                  <span />
                )}
                <Link
                  href={`/agent/${automation.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  View automation
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
