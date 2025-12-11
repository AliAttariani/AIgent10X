"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ManagedAutomation } from "@/data/automations";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AutomationDemoResult } from "@/lib/demo/types";
import type {
  LeadFlowDemoResult,
  LeadFlowRunResult,
  LeadFlowSummary,
} from "@/lib/automations/lead-flow-autopilot";

type AutomationWithGallery = ManagedAutomation & { gallery?: string[] };
type DetailContent = {
  heroTagline: string;
  heroSummary: string;
  whoItsFor?: string[];
  outcomes?: string[];
  workflows?: string[];
  integrations?: string[];
  metrics?: string[];
  launchPlan?: string[];
  guaranteeLabel?: string;
};

interface AgentDetailClientProps {
  automation: AutomationWithGallery;
  detailContent: DetailContent;
  showBackLink?: boolean;
}

const staticReviews = [
  {
    name: "Sarah Lin",
    title: "Head of Growth, Atlas.io",
    rating: 5,
    quote:
      "We replaced a patchwork of dashboards with this automation. It surfaces actionable GTM plays every morning—our team loves it.",
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

const FALLBACK_THUMBNAIL = "/images/agents/placeholder.jpg";

type LeadInput = {
  id: string;
  email: string;
  name?: string;
  source?: string;
  score?: number;
  createdAt?: string;
};

type AutomationRunRequest = {
  simulate?: boolean;
  leads: LeadInput[];
};

type RunCardData = {
  variant: "live" | "demo";
  title: string;
  summary: string;
  metrics: Array<{ label: string; value: string }>;
  actions: string[];
  raw?: unknown;
};

type DemoResult = AutomationDemoResult | LeadFlowDemoResult;

const formatNumber = (value: number) => value.toLocaleString("en-US");

const buildSampleRunPayload = (): AutomationRunRequest => {
  return {
    simulate: false,
    leads: [
      {
        id: "lead-1",
        email: "demo1@example.com",
        name: "Demo Lead 1",
        source: "form",
        score: 80,
      },
      {
        id: "lead-2",
        email: "demo2@example.com",
        name: "Demo Lead 2",
        source: "chat",
        score: 65,
      },
      {
        id: "lead-3",
        email: "demo3@example.com",
        name: "Demo Lead 3",
        source: "partner",
        score: 92,
      },
    ],
  } satisfies AutomationRunRequest;
};

const mapSummaryToMetricsList = (summary: LeadFlowSummary) => [
  {
    label: "Inbound leads processed",
    value: formatNumber(summary.inboundLeadsProcessed),
  },
  {
    label: "Qualified leads",
    value: formatNumber(summary.qualifiedLeads),
  },
  {
    label: "Meetings booked",
    value: formatNumber(summary.meetingsBooked),
  },
  {
    label: "Hours saved",
    value: `${summary.hoursSaved.toFixed(1)}h`,
  },
];

const buildLeadFlowSummaryText = (summary: LeadFlowSummary) =>
  `Processed ${formatNumber(summary.inboundLeadsProcessed)} inbound leads, qualified ${formatNumber(summary.qualifiedLeads)}, booked ${formatNumber(summary.meetingsBooked)} meetings, and saved ${summary.hoursSaved.toFixed(1)} hours of manual work.`;

const buildLeadFlowRunCard = (
  variant: RunCardData["variant"],
  title: string,
  summary: LeadFlowSummary,
  raw: unknown,
): RunCardData => ({
  variant,
  title,
  summary: buildLeadFlowSummaryText(summary),
  metrics: mapSummaryToMetricsList(summary),
  actions: summary.actions,
  raw,
});

const isLeadFlowDemoResult = (result: unknown): result is LeadFlowDemoResult => {
  return Boolean(
    result &&
      typeof result === "object" &&
      "type" in result &&
      (result as { type?: unknown }).type === "demo" &&
      typeof (result as { summary?: unknown }).summary === "object",
  );
};

const isLegacyAutomationDemoResult = (result: unknown): result is AutomationDemoResult => {
  return Boolean(
    result &&
      typeof result === "object" &&
      "ok" in result &&
      typeof (result as { ok?: unknown }).ok === "boolean" &&
      typeof (result as { summary?: unknown }).summary === "string" &&
      Array.isArray((result as { metrics?: unknown }).metrics),
  );
};

const isLeadFlowRunResult = (result: unknown): result is LeadFlowRunResult => {
  return Boolean(
    result &&
      typeof result === "object" &&
      (result as { type?: unknown }).type === "run" &&
      typeof (result as { summary?: unknown }).summary === "object",
  );
};

export function AgentDetailClient({ automation, detailContent, showBackLink }: AgentDetailClientProps) {
  const galleryImages = automation.gallery?.length
    ? automation.gallery
    : [automation.thumbnail ?? FALLBACK_THUMBNAIL];
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null);
  const [liveDemoError, setLiveDemoError] = useState<string | null>(null);
  const [isRunningLive, setIsRunningLive] = useState(false);
  const [liveRunResult, setLiveRunResult] = useState<LeadFlowRunResult | null>(null);
  const isLeadFlowAutopilot = automation.slug === "lead-flow-autopilot";
  const {
    heroTagline,
    heroSummary,
    whoItsFor = [],
    outcomes = [],
    workflows = [],
    integrations = [],
    metrics = [],
    launchPlan = [],
    guaranteeLabel,
  } = detailContent;

  const sections = useMemo(
    () => {
      const list = [
        {
          id: "overview",
          label: "What this automation delivers",
          content: (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p className="text-base font-semibold text-foreground">{heroTagline}</p>
              <p>{heroSummary}</p>
              <p>{automation.summary}</p>
            </div>
          ),
        },
      ];

      if (whoItsFor.length) {
        list.push({
          id: "who-its-for",
          label: "Who it’s for",
          content: (
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {whoItsFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
        });
      }

      if (outcomes.length) {
        list.push({
          id: "measurable-outcomes",
          label: "Measurable outcomes",
          content: (
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
        });
      }

      if (workflows.length) {
        list.push({
          id: "included-workflows",
          label: "Included workflows",
          content: (
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {workflows.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
        });
      }

      if (integrations.length) {
        list.push({
          id: "integrations",
          label: "Integrations",
          content: (
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {integrations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
        });
      }

      if (metrics.length) {
        list.push({
          id: "metrics",
          label: "Metrics & KPIs",
          content: (
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {metrics.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
        });
      }

      if (launchPlan.length) {
        list.push({
          id: "launch-plan",
          label: "Launch plan (first 2 weeks)",
          content: (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {launchPlan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          ),
        });
      }

      list.push(
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
      );

      return list;
    },
    [automation.summary, heroSummary, heroTagline, integrations, launchPlan, metrics, outcomes, whoItsFor, workflows],
  );

  const activeTabDefault = sections[0].id;
  const [activeTab, setActiveTab] = useState(activeTabDefault);

  const priceLabel = automation.price ?? "Contact for pricing";
  const purchaseLabel =
    automation.planType === "managed"
      ? "Subscribe"
      : automation.planType === "demo"
        ? "Launch demo"
        : "Buy";

  const handleScrollToDemo = () => {
    const el = document.getElementById("demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLeadFlowRun = async () => {
    if (!isLeadFlowAutopilot || isDemoLoading) {
      return;
    }

    setIsDemoLoading(true);
    setLiveDemoError(null);

    try {
      const response = await fetch(`/api/automations/${automation.slug}/demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ simulate: true }),
      });

      if (!response.ok) {
        let message: string;
        try {
          const errorPayload = (await response.json()) as { error?: string };
          message =
            typeof errorPayload?.error === "string"
              ? errorPayload.error
              : `Demo request failed with status ${response.status}`;
        } catch {
          message = `Demo request failed with status ${response.status}`;
        }
        setLiveDemoError(message);
        return;
      }

      const payload = (await response.json()) as unknown;

      if (isLeadFlowDemoResult(payload) || isLegacyAutomationDemoResult(payload)) {
        setDemoResult(payload);
        setLiveDemoError(null);
        return;
      }

      setLiveDemoError("Demo request returned an unexpected payload.");
      return;
      setLiveDemoError(null);
    } catch (error) {
      console.error("Lead Flow demo error", error);
      setLiveDemoError(error instanceof Error ? error.message : "Unable to run the live demo right now.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const goToPrevious = () => {
    setActiveSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToNext = () => {
    setActiveSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const handleLiveRun = async () => {
    if (!isLeadFlowAutopilot || isRunningLive) {
      return;
    }

    setIsRunningLive(true);
    setLiveDemoError(null);

    try {
      const payload = buildSampleRunPayload();
      const response = await fetch(`/api/automations/${automation.slug}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message: string;
        try {
          const errorPayload = (await response.json()) as { error?: string };
          message =
            typeof errorPayload?.error === "string"
              ? errorPayload.error
              : `Run request failed with status ${response.status}`;
        } catch {
          message = `Run request failed with status ${response.status}`;
        }
        setLiveDemoError(message);
        return;
      }

      const data = (await response.json()) as unknown;
      if (!isLeadFlowRunResult(data)) {
        setLiveDemoError("Run request returned an unexpected payload.");
        return;
      }

      setLiveRunResult(data);
      setLiveDemoError(null);
    } catch (error) {
      console.error("Lead Flow live run error", error);
      setLiveDemoError(error instanceof Error ? error.message : "Unable to run the automation right now.");
    } finally {
      setIsRunningLive(false);
    }
  };

  const demoButtonLabel = isLeadFlowAutopilot && isDemoLoading ? "Running demo…" : "Try Live Demo";
  const handleDemoButtonClick = () => {
    if (isLeadFlowAutopilot) {
      void handleLeadFlowRun();
      return;
    }

    handleScrollToDemo();
  };

  const liveRunCard = liveRunResult
    ? buildLeadFlowRunCard("live", `${automation.name} run`, liveRunResult.summary, liveRunResult)
    : null;

  const demoCard = demoResult
    ? isLeadFlowDemoResult(demoResult)
      ? buildLeadFlowRunCard("demo", `${automation.name} demo preview`, demoResult.summary, demoResult)
        : {
          variant: "demo" as const,
          title: demoResult.title,
          summary: demoResult.summary,
          metrics: demoResult.metrics ?? [],
          actions: demoResult.actions ?? [],
          raw: demoResult.debug,
        }
    : null;

  const activeRunCard: RunCardData | null = liveRunCard ?? demoCard;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-10 md:px-6 md:pb-12">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-10">
          <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="relative h-[320px] w-full bg-muted sm:h-[420px]">
              <Image
                key={galleryImages[activeSlide]}
                src={galleryImages[activeSlide]}
                alt={`${automation.name} screenshot ${activeSlide + 1}`}
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
                {isLeadFlowAutopilot ? (
                  <button
                    type="button"
                    onClick={() => {
                      void handleLiveRun();
                    }}
                    className={buttonVariants({ variant: "outline" })}
                    disabled={isRunningLive}
                  >
                    {isRunningLive ? "Running…" : "Run now"}
                  </button>
                ) : null}
                <Link
                  href={`/docs/${automation.slug}`}
                  className={buttonVariants({ variant: "ghost" })}
                >
                  View setup guide
                </Link>
              </div>
              {isLeadFlowAutopilot ? (
                <div className="mt-4 space-y-4">
                  {isDemoLoading ? (
                    <p className="text-sm text-muted-foreground">Running demo…</p>
                  ) : null}
                  {isRunningLive ? (
                    <p className="text-sm text-muted-foreground">Running live automation…</p>
                  ) : null}
                  {liveDemoError ? (
                    <p className="text-sm text-destructive">{liveDemoError}</p>
                  ) : null}
                  {activeRunCard ? (
                    <div
                      className={
                        activeRunCard.variant === "live"
                          ? "space-y-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/5 p-4"
                          : "space-y-4 rounded-2xl border border-primary/30 bg-card/80 p-4"
                      }
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p
                            className={
                              activeRunCard.variant === "live"
                                ? "text-xs font-semibold uppercase tracking-wide text-emerald-600"
                                : "text-xs font-semibold uppercase tracking-wide text-primary"
                            }
                          >
                            {activeRunCard.variant === "live" ? "Last live run" : "Demo preview"}
                          </p>
                          <h4 className="mt-1 text-base font-semibold text-foreground">{activeRunCard.title}</h4>
                        </div>
                        <Badge
                          className={
                            activeRunCard.variant === "live"
                              ? "bg-emerald-600 text-[10px] font-semibold uppercase tracking-wide text-white"
                              : "bg-primary/80 text-[10px] font-semibold uppercase tracking-wide text-white"
                          }
                        >
                          {activeRunCard.variant === "live" ? "LIVE" : "DEMO"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activeRunCard.summary}</p>
                      {activeRunCard.metrics.length ? (
                        <dl className="grid gap-3 sm:grid-cols-2">
                          {activeRunCard.metrics.map((metric) => (
                            <div
                              key={`${metric.label}-${metric.value}`}
                              className="flex items-baseline justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2"
                            >
                              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {metric.label}
                              </dt>
                              <dd className="text-sm font-semibold text-foreground">{metric.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                      {activeRunCard.actions.length ? (
                        <div className="space-y-2 rounded-xl border border-border/60 bg-background/60 px-3 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Actions executed
                          </p>
                          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                            {activeRunCard.actions.map((action) => (
                              <li key={action}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {activeRunCard.raw ? (
                        <details className="rounded-xl border border-dashed border-border/60 bg-background/60 px-3 py-2 text-sm">
                          <summary className="cursor-pointer font-semibold text-foreground">View raw output</summary>
                          <pre className="mt-2 overflow-auto rounded-lg bg-black/80 px-3 py-2 text-xs text-white">
                            {JSON.stringify(activeRunCard.raw, null, 2)}
                          </pre>
                        </details>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          </section>
        </div>

        <aside className="relative lg:pl-4">
          <div className="sticky top-24 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm max-w-lg">
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
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{automation.name}</h1>
              <p className="text-sm font-semibold text-foreground">{heroTagline}</p>
              <p className="text-sm text-muted-foreground">{heroSummary}</p>
            </div>
            <div className="space-y-2 max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {priceLabel}
              </p>
              <div className="mt-2 w-full max-w-full">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide">
                  {automation.verified ? (
                    <Badge className="bg-emerald-600 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Verified
                    </Badge>
                  ) : null}
                  {automation.rating ? (
                    <Badge variant="outline" className="flex items-center gap-1 text-[10px] uppercase tracking-wide">
                      <span aria-hidden>⭐</span>
                      <span>{automation.rating.toFixed(1)}</span>
                    </Badge>
                  ) : null}
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                    {automation.primaryOutcomeLabel}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                    {automation.planType}
                  </Badge>
                  {automation.runByPantherIQ ? (
                    <Badge className="bg-black text-[10px] uppercase tracking-wide text-white">
                      Run by PantherIQ
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDemoButtonClick}
                disabled={isLeadFlowAutopilot && isDemoLoading}
                className={buttonVariants({ size: "lg", className: isLeadFlowAutopilot && isDemoLoading ? "opacity-80" : undefined })}
              >
                {demoButtonLabel}
              </button>
              <Link
                href={`/checkout/${automation.slug}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {purchaseLabel}
              </Link>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Deployment scheduled within 1 business day with PantherIQ operators.</p>
              <p>{guaranteeLabel ?? "Includes a 7-day performance guarantee tied to your outcome targets."}</p>
              <p>Managed service fees are billed through your PantherIQ subscription.</p>
              <p>Run by PantherIQ end-to-end—no marketplace creator fees.</p>
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
              onClick={handleDemoButtonClick}
              disabled={isLeadFlowAutopilot && isDemoLoading}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: `px-3 ${isLeadFlowAutopilot && isDemoLoading ? "opacity-80" : ""}`,
              })}
            >
              {demoButtonLabel}
            </button>
            <Link
              href={`/checkout/${automation.slug}`}
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
