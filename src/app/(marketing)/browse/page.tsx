"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AgentCard, type AgentCardProps, type AgentPricingType } from "@/components/agent-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  managedAutomations,
  type AutomationCategory,
  type ManagedAutomation,
} from "@/data/automations";

const CATEGORY_FILTERS: { value: AutomationCategory; label: string }[] = [
  { value: "lead-generation", label: "Lead generation" },
  { value: "content-automation", label: "Content automation" },
  { value: "sales-follow-up", label: "Sales follow-up" },
  { value: "customer-support", label: "Customer support" },
  { value: "workflow-automation", label: "Workflow automation" },
  { value: "research-analysis", label: "Research & analysis" },
];

type ManagedPlanType = ManagedAutomation["planType"];

const PRICING_FILTERS: { value: ManagedPlanType; label: string; helper: string }[] = [
  { value: "managed", label: "Managed plan", helper: "Subscription" },
];

const pricingTierLabels: Record<ManagedPlanType, string> = {
  managed: "Managed plan",
};

const pricingTierToCardType: Record<ManagedPlanType, AgentPricingType> = {
  managed: "subscription",
};

const DEFAULT_THUMBNAIL = "/images/agents/placeholder.jpg";

function decorateAutomation(automation: ManagedAutomation): AgentCardProps {
  return {
    id: automation.slug,
    slug: automation.slug,
    title: automation.name,
    tagline: automation.outcomeSummary || automation.summary,
    price: automation.price || pricingTierLabels[automation.planType],
    rating: automation.rating,
    verified: automation.verified ?? true,
    thumbnail: automation.thumbnail ?? DEFAULT_THUMBNAIL,
    category: automation.primaryOutcomeLabel,
    pricingType: pricingTierToCardType[automation.planType],
    creatorPlan: automation.runByPantherIQ ? "pro" : undefined,
    isFeatured: Boolean(automation.isFeatured),
  };
}

const orderedAutomations = [...managedAutomations].sort(
  (a, b) => (a.launchOrder ?? Number.MAX_SAFE_INTEGER) - (b.launchOrder ?? Number.MAX_SAFE_INTEGER),
);
const FEATURED_AUTOMATION = orderedAutomations.find((automation) => automation.isFeatured) ?? orderedAutomations[0];
const FEATURED_AUTOMATION_CARD = FEATURED_AUTOMATION ? decorateAutomation(FEATURED_AUTOMATION) : null;

export default function BrowsePage() {
  const [selectedCategories, setSelectedCategories] = useState<AutomationCategory[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<ManagedPlanType[]>([]);

  const filteredAutomations = useMemo(() => {
    return managedAutomations.filter((automation) => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(automation.category);
      const matchesPricing =
        selectedPricing.length === 0 || selectedPricing.includes(automation.planType);

      return matchesCategory && matchesPricing;
    });
  }, [selectedCategories, selectedPricing]);

  const gridAutomations = useMemo(() => {
    const decorated = filteredAutomations.map((automation) => decorateAutomation(automation));
    const heroSlug = FEATURED_AUTOMATION?.slug;
    const heroIndex = heroSlug ? decorated.findIndex((automation) => automation.slug === heroSlug) : -1;
    if (heroIndex <= 0) {
      return decorated;
    }
    const [hero] = decorated.splice(heroIndex, 1);
    return [hero, ...decorated];
  }, [filteredAutomations]);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedPricing([]);
  };

  const toggleCategory = (category: AutomationCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const togglePricing = (tier: ManagedPlanType) => {
    setSelectedPricing((prev) =>
      prev.includes(tier) ? prev.filter((item) => item !== tier) : [...prev, tier],
    );
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-6 pb-16 pt-12 lg:flex-row lg:gap-10">
      <aside className="w-full max-w-xs shrink-0 space-y-8 lg:sticky lg:top-24">
        <div className="rounded-3xl border border-border bg-muted/30 p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Filter automations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Narrow your search by outcome area or managed pricing tier.
          </p>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Categories
              </h3>
              <div className="mt-3 grid gap-2">
                {CATEGORY_FILTERS.map((category) => (
                  <label
                    key={category.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm transition hover:border-border hover:bg-background"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.value)}
                      onChange={() => toggleCategory(category.value)}
                      className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span>{category.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Pricing
              </h3>
              <div className="mt-3 grid gap-2">
                {PRICING_FILTERS.map((tier) => (
                  <label
                    key={tier.value}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm transition hover:border-border hover:bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPricing.includes(tier.value)}
                        onChange={() => togglePricing(tier.value)}
                        className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                      />
                      <span>{tier.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {tier.helper}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col gap-12">
        {filteredAutomations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              We couldn&apos;t find what you&apos;re looking for.
            </h2>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or jump back to the full catalog.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className={buttonVariants({ variant: "default" })}
              >
                Clear filters
              </button>
              <Link
                href="/browse"
                className={buttonVariants({ variant: "outline" })}
              >
                Back to Browse
              </Link>
            </div>
          </div>
        ) : (
          <>
            {FEATURED_AUTOMATION && FEATURED_AUTOMATION_CARD ? (
              <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background shadow-xl">
                <div className="grid gap-10 p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                  <div className="space-y-6">
                    <Badge variant="outline" className="bg-background/60">
                      Featured automation • {FEATURED_AUTOMATION.name}
                    </Badge>
                    <div className="space-y-4">
                      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {FEATURED_AUTOMATION.name}
                      </h1>
                      <p className="text-base font-semibold text-foreground sm:text-xl">
                        {FEATURED_AUTOMATION.heroTagline}
                      </p>
                      <p className="text-base text-muted-foreground sm:text-lg">
                        {FEATURED_AUTOMATION.outcomeSummary}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="rounded-full border border-border bg-background px-4 py-1 font-semibold">
                        {FEATURED_AUTOMATION_CARD.price}
                      </span>
                      {typeof FEATURED_AUTOMATION_CARD.rating === "number" ? (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          ⭐ {FEATURED_AUTOMATION_CARD.rating.toFixed(1)}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {FEATURED_AUTOMATION.primaryOutcomeLabel}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {pricingTierLabels[FEATURED_AUTOMATION.planType]}
                      </Badge>
                      {FEATURED_AUTOMATION.runByPantherIQ ? (
                        <Badge className="bg-black text-white">Run by PantherIQ</Badge>
                      ) : null}
                      {FEATURED_AUTOMATION_CARD.verified ? (
                        <Badge className="bg-emerald-600 text-white">
                          Verified automation
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/agent/${FEATURED_AUTOMATION.slug}`}
                        className={buttonVariants({ size: "lg" })}
                      >
                        View automation
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
                      src={FEATURED_AUTOMATION_CARD.thumbnail}
                      alt={FEATURED_AUTOMATION_CARD.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                  </div>
                </div>
              </section>
            ) : null}

            <section className="space-y-6" id="latest-launches">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Latest launches
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Discover automations organized by their launch date.
                  </p>
                </div>
                <Link
                  href="/agents/submit"
                  className={buttonVariants({ variant: "outline" })}
                  aria-label="Get Started"
                  title="Get Started"
                >
                  Get Started
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {gridAutomations.map((automation) => (
                  <AgentCard key={automation.id} {...automation} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
