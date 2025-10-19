import Image from "next/image";
import Link from "next/link";
import { AgentCard } from "@/components/agent-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { featuredAgents } from "@/data/featured-agents";

export default function BrowsePage() {
  const sortedAgents = [...featuredAgents].sort(
    (a, b) => b.launchOrder - a.launchOrder,
  );
  const heroAgent =
    sortedAgents.find((agent) => agent.slug === "growth-coach-pro") ??
    sortedAgents[0];
  const otherAgents = sortedAgents.filter((agent) => agent.id !== heroAgent.id);

  const categories = Array.from(
    new Set(featuredAgents.map((agent) => agent.category)),
  ).sort();

  const pricingTiers = ["free", "one-time", "subscription"] as const;

  const pricingLabels: Record<(typeof pricingTiers)[number], string> = {
    free: "Free access",
    "one-time": "One-time purchase",
    subscription: "Subscription",
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-6 pb-16 pt-12 lg:flex-row lg:gap-10">
      <aside className="w-full max-w-xs shrink-0 space-y-8 lg:sticky lg:top-24">
        <div className="rounded-3xl border border-border bg-muted/30 p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Filter agents</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Narrow your search by solution area or pricing model.
          </p>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Categories
              </h3>
              <div className="mt-3 grid gap-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm transition hover:border-border hover:bg-background"
                  >
                    <input
                      type="checkbox"
                      className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Pricing
              </h3>
              <div className="mt-3 grid gap-2">
                {pricingTiers.map((tier) => (
                  <label
                    key={tier}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm transition hover:border-border hover:bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                      />
                      <span className="capitalize">{tier.replace("-", " ")}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {pricingLabels[tier]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col gap-12">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background shadow-xl">
          <div className="grid gap-10 p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="bg-background/60">
                Newest launch
              </Badge>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {heroAgent.title}
                </h1>
                <p className="text-base text-muted-foreground sm:text-lg">
                  {heroAgent.tagline}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="rounded-full border border-border bg-background px-4 py-1 font-semibold">
                  {heroAgent.price}
                </span>
                {typeof heroAgent.rating === "number" ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    ⭐ {heroAgent.rating.toFixed(1)}
                  </span>
                ) : null}
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {heroAgent.category}
                </span>
                {heroAgent.pricingType ? (
                  <Badge variant="secondary" className="text-xs">
                    {pricingLabels[heroAgent.pricingType]}
                  </Badge>
                ) : null}
                {heroAgent.verified ? (
                  <Badge className="bg-emerald-600 text-white">
                    Verified
                  </Badge>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/agents/${heroAgent.slug}`}
                  className={buttonVariants({ size: "lg" })}
                >
                  Explore {heroAgent.title}
                </Link>
                <Link
                  href="#latest-launches"
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  Browse catalog
                </Link>
              </div>
            </div>
            <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-border bg-background shadow-inner">
              <Image
                src={heroAgent.thumbnail}
                alt={heroAgent.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </section>

        <section className="space-y-6" id="latest-launches">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Latest launches
              </h2>
              <p className="text-sm text-muted-foreground">
                Discover automation agents organized by their launch date.
              </p>
            </div>
            <Link
              href="/agents/submit"
              className={buttonVariants({ variant: "outline" })}
            >
              Submit your agent
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[heroAgent, ...otherAgents].map((agent) => (
              <AgentCard key={agent.id} {...agent} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
