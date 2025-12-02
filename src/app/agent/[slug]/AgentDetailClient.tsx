"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FeaturedAgent } from "@/data/featured-agents";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentDetailClientProps {
  agent: FeaturedAgent & { gallery?: string[] };
  showBackLink?: boolean;
}

const staticReviews = [
  {
    name: "Sarah Lin",
    title: "Head of Growth, Atlas.io",
    rating: 5,
    quote:
      "We replaced a patchwork of dashboards with this agent. It surfaces actionable GTM plays every morning—our team loves it.",
  },
  {
    name: "Miguel Rodriguez",
    title: "Customer Operations Lead, Hestia",
    rating: 4,
    quote:
      "Onboarding was painless and the automations are eerily good. Looking forward to deeper CRM connectors on the roadmap.",
  },
  {
    name: "Priya Desai",
    title: "Finance Manager, Lumen",
    rating: 5,
    quote:
      "The forecasting module helps us course-correct mid-quarter. It paid for itself in the first 30 days.",
  },
];

const staticChangelog = [
  {
    version: "v1.3",
    date: "2025-08-22",
    notes: [
      "Added collaborative brief builder for go-to-market launches.",
      "Improved LLM guardrails for financial projections.",
    ],
  },
  {
    version: "v1.2",
    date: "2025-05-18",
    notes: [
      "Launched live connector for HubSpot Sequences.",
      "New scenario simulator with exportable deck templates.",
    ],
  },
  {
    version: "v1.1",
    date: "2025-02-04",
    notes: [
      "Introduced playbook library with 20+ proven launch sequences.",
      "Performance dashboards now refresh every 30 minutes.",
    ],
  },
];

const defaultCapabilities = {
  strengths: [
    "Autonomously analyzes marketing, sales, and product analytics to surface next best actions.",
    "Generates tailored outreach assets and syncs them back to your CRM.",
    "Benchmarks your funnels against industry peers to highlight blind spots.",
  ],
  limitations: [
    "Requires API access to your analytics suite for full functionality.",
    "Best suited for English-language go-to-market assets today.",
    "Human approval recommended before launching net-new paid media campaigns.",
  ],
};

export function AgentDetailClient({ agent, showBackLink }: AgentDetailClientProps) {
  const galleryImages = agent.gallery?.length ? agent.gallery : [agent.thumbnail];
  const [activeSlide, setActiveSlide] = useState(0);

  const sections = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        content: (
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{agent.tagline}</p>
            <p>
              {agent.title} pairs trusted automation workflows with human-in-the-loop
              controls so your team can ship campaigns faster without sacrificing
              quality. Plug it into your existing stack, choose the outcomes you care
              about, and let the agent orchestrate the handoffs.
            </p>
            <p>
              You retain full transparency with an audit trail for every decision,
              plus granular permissions that keep sensitive workstreams compliant.
            </p>
          </div>
        ),
      },
      {
        id: "capabilities",
        label: "Capabilities & Limits",
        content: (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Capabilities</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {defaultCapabilities.strengths.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Limits</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {defaultCapabilities.limitations.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-destructive" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "reviews",
        label: "Reviews",
        content: (
          <div className="space-y-6">
            {staticReviews.map((review) => (
              <blockquote
                key={review.name}
                className="rounded-3xl border border-border bg-card/40 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="font-semibold text-foreground">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.title}</div>
                </div>
                <div className="mt-2 text-amber-500" aria-label={`${review.rating} star rating`}>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.quote}
                </p>
              </blockquote>
            ))}
          </div>
        ),
      },
      {
        id: "changelog",
        label: "Changelog",
        content: (
          <div className="space-y-5">
            {staticChangelog.map((entry) => (
              <div key={entry.version} className="rounded-3xl border border-border bg-muted/30 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-foreground">{entry.version}</span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {entry.date}
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {entry.notes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span className="mt-1 size-1 rounded-full bg-primary/60" aria-hidden />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ),
      },
    ],
    [agent.tagline, agent.title],
  );

  const activeTabDefault = sections[0].id;
  const [activeTab, setActiveTab] = useState(activeTabDefault);

  const priceLabel = agent.price ?? "Contact for pricing";
  const purchaseLabel = agent.pricingType === "subscription" ? "Subscribe" : "Buy";

  const handleScrollToDemo = () => {
    const el = document.getElementById("demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToPrevious = () => {
    setActiveSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToNext = () => {
    setActiveSlide((prev) => (prev + 1) % galleryImages.length);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-10 md:px-6 md:pb-12">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-10">
          <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="relative h-[320px] w-full bg-muted sm:h-[420px]">
              <Image
                key={galleryImages[activeSlide]}
                src={galleryImages[activeSlide]}
                alt={`${agent.title} screenshot ${activeSlide + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>
            {galleryImages.length > 1 ? (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/95 via-background/60 to-transparent px-4 pb-4 pt-12">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-background"
                >
                  Prev
                </button>
                <div className="flex items-center gap-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition",
                        activeSlide === index ? "bg-primary" : "bg-border",
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={goToNext}
                  className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-background"
                >
                  Next
                </button>
              </div>
            ) : null}
          </section>

          <section className="space-y-8">
            <div className="hidden md:block">
              <nav className="flex flex-wrap gap-2 rounded-2xl border border-border bg-muted/40 p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveTab(section.id)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      activeTab === section.id
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
              <div className="mt-6">
                {sections.map((section) => (
                  <div key={section.id} hidden={section.id !== activeTab}>
                    {section.content}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 md:hidden">
              {sections.map((section) => (
                <details key={section.id} className="overflow-hidden rounded-2xl border border-border bg-card/60">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-foreground">
                    {section.label}
                  </summary>
                  <div className="border-t border-border px-4 py-4 text-sm text-muted-foreground">
                    {section.content}
                  </div>
                </details>
              ))}
            </div>

            <section
              id="demo"
              className="rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-6"
            >
              <h3 className="text-lg font-semibold text-foreground">Live demo</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Launch a guided sandbox with sample data to explore the core flows before
                you connect your stack.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleScrollToDemo}
                  className={buttonVariants({ variant: "default" })}
                >
                  Relaunch demo
                </button>
                <Link
                  href={`/docs/${agent.slug}`}
                  className={buttonVariants({ variant: "ghost" })}
                >
                  View setup guide
                </Link>
              </div>
            </section>
          </section>
        </div>

        <aside className="relative lg:pl-4">
          <div className="sticky top-24 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-3">
              {showBackLink ? (
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <span aria-hidden>←</span>
                  Back to Browse
                </Link>
              ) : null}
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{agent.title}</h1>
              <p className="text-sm text-muted-foreground">{agent.tagline}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-2xl font-semibold text-foreground">{priceLabel}</span>
              {agent.verified ? (
                <Badge className="bg-emerald-600 text-xs font-semibold uppercase tracking-wide text-white">
                  Verified
                </Badge>
              ) : null}
              {agent.rating ? (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span aria-hidden>⭐</span>
                  <span>{agent.rating.toFixed(1)}</span>
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleScrollToDemo}
                className={buttonVariants({ size: "lg" })}
              >
                Try Live Demo
              </button>
              <Link
                href={`/checkout/${agent.slug}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {purchaseLabel}
              </Link>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Ships in under 5 minutes with guided setup.</p>
              <p>Includes 7-day satisfaction refund guarantee.</p>
              <p>Includes a 10% platform processing fee.</p>
              <p>Creators receive 90% of the sale. PantherIQ collects a 10% platform fee.</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Access</div>
            <div className="text-lg font-semibold text-foreground">{priceLabel}</div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleScrollToDemo}
              className={buttonVariants({ variant: "outline", size: "sm", className: "px-3" })}
            >
              Try Live Demo
            </button>
            <Link
              href={`/checkout/${agent.slug}`}
              className={buttonVariants({ size: "sm", className: "px-4" })}
            >
              {purchaseLabel}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
