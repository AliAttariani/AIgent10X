import type { ComponentType } from "react";
import Link from "next/link";

type FeaturedAgent = {
  id: string;
  name: string;
  description?: string;
  href?: string;
  tags?: string[];
};

async function loadSiteHeader() {
  try {
    // @ts-ignore - optional module may not exist in every deployment.
    const mod = await import("@/components/site-header");
    return (mod.default ?? mod.SiteHeader) as ComponentType | undefined;
  } catch (error) {
    console.warn("[home] SiteHeader not found", error);
    return undefined;
  }
}

async function loadSiteFooter() {
  try {
    // @ts-ignore - optional module may not exist in every deployment.
    const mod = await import("@/components/site-footer");
    return (mod.default ?? mod.SiteFooter) as ComponentType | undefined;
  } catch (error) {
    console.warn("[home] SiteFooter not found", error);
    return undefined;
  }
}

async function loadFeaturedAgents(): Promise<FeaturedAgent[] | undefined> {
  try {
    // @ts-ignore - optional data module may not exist in every deployment.
    const mod = await import("@/data/featured-agents");
    const agents = (mod.default ?? mod.featuredAgents) as FeaturedAgent[];
    if (Array.isArray(agents) && agents.length > 0) {
      return agents;
    }
    return undefined;
  } catch (error) {
    console.warn("[home] featuredAgents data not found", error);
    return undefined;
  }
}

export default async function HomePage() {
  const [SiteHeader, SiteFooter, agents] = await Promise.all([
    loadSiteHeader(),
    loadSiteFooter(),
    loadFeaturedAgents(),
  ]);

  const fallbackAgents: FeaturedAgent[] = Array.from({ length: 3 }).map(
    (_, index) => ({
      id: `placeholder-${index + 1}`,
      name: "Coming soon",
      description: "An AI agent will appear here soon.",
    }),
  );

  const cards = agents ?? fallbackAgents;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {SiteHeader ? <SiteHeader /> : null}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-12 md:px-8">
        <section className="text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <p className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Trusted marketplace for AI builders
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              The App Store for AI Agents.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Discover, deploy, and monetize autonomous AI agents in minutes. Built for founders, teams, and creators who move fast.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/browse"
                className="w-full rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 sm:w-auto"
              >
                Explore Agents
              </Link>
              <Link
                href="/creator/agents/new"
                className="w-full rounded-md border border-primary px-6 py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground sm:w-auto"
              >
                List your Agent
              </Link>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 rounded-lg border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm sm:flex-row sm:justify-center">
          <span>Verified Agents</span>
          <span className="hidden sm:block">•</span>
          <span>Stripe Secure</span>
          <span className="hidden sm:block">•</span>
          <span>7-day refunds</span>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Featured Agents</h2>
              <p className="text-sm text-muted-foreground">
                Curated picks from the community this week.
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
            {cards.map((agent) => (
              <article
                key={agent.id}
                className="flex flex-col justify-between rounded-lg border bg-card p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  {agent.description ? (
                    <p className="text-sm text-muted-foreground">
                      {agent.description}
                    </p>
                  ) : null}
                  {agent.tags && agent.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {agent.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {agent.href ? (
                  <Link
                    href={agent.href}
                    className="mt-6 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View details
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
      {SiteFooter ? <SiteFooter /> : null}
    </div>
  );
}
