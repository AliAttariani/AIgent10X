import Link from "next/link";
import type { AgentSummary } from "@/types/agents";

type HomeAgent = AgentSummary & {
  description?: string;
  href?: string;
  tags?: string[];
};

async function loadFeaturedAgents(): Promise<HomeAgent[] | undefined> {
  try {
    const mod = (await import("@/data/featured-agents")) as {
      default?: HomeAgent[];
      featuredAgents?: HomeAgent[];
    };
    const agents = mod.default ?? mod.featuredAgents;
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
  const agents = await loadFeaturedAgents();

  const fallbackAgents: HomeAgent[] = Array.from({ length: 3 }).map(
    (_, index) => ({
      id: `placeholder-${index + 1}`,
      slug: `coming-soon-${index + 1}`,
      title: "Coming soon",
      tagline: "An AI agent will appear here soon.",
      price: "TBD",
      thumbnail: "https://placehold.co/600x400/png",
    }),
  );

  const cards = agents ?? fallbackAgents;

  return (
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
          {cards.map((agent) => {
            const detailHref = agent.href ?? `/agents/${agent.slug}`;

            return (
              <article
                key={agent.id}
                className="flex flex-col justify-between rounded-lg border bg-card p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">{agent.title}</h3>
                  {agent.tagline ? (
                    <p className="text-sm text-muted-foreground">
                      {agent.tagline}
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
                {detailHref ? (
                  <Link
                    href={detailHref}
                    className="mt-6 inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View details
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
