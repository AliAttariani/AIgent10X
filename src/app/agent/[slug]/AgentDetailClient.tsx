"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import type {
  LeadFlowRunFailure,
  LeadFlowRunInput as LeadFlowContractInput,
  LeadFlowRunSuccess,
} from "@/lib/leadflow/contracts";
import type { LeadFlowSettingsDTO } from "@/lib/automations/leadFlowSettings";
import {
  FREE_PLAN_MONTHLY_LIMIT,
  type LeadFlowUsageSummary,
} from "@/lib/automations/runUsage.shared";
import { estimateLeadFlowRunCostUnits } from "@/lib/leadflow/costEstimate";
import type { LeadFlowRunManifest as LeadFlowRunManifestData } from "@/lib/leadflow/manifest";
import {
  diffLeadFlowSettings,
  type LeadFlowSettingsDiffLine,
  type LeadFlowSettingsSnapshot,
} from "../../../lib/leadflow/diff";
import { createLeadFlowSettingsSnapshotAction } from "./actions/leadFlowSnapshotActions";
import { LeadFlowSettingsPanel } from "./LeadFlowSettingsPanel";
import { LeadFlowDryRunPreview } from "./LeadFlowDryRunPreview";
import { LeadFlowAuditLog, type LeadFlowAuditEvent } from "./LeadFlowAuditLog";
import { LeadFlowRunManifestCard } from "./LeadFlowRunManifest";

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
  initialSettings?: LeadFlowSettingsDTO | null;
  runUsage?: LeadFlowUsageSummary | null;
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

const LIVE_RUN_SOURCE: LeadFlowContractInput["source"] = "csv";

type AutomationRunRequest = LeadFlowContractInput & {
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
  auditEvents?: LeadFlowAuditEvent[];
  idempotencyBadge?: "replayed";
  costUnits?: number;
  snapshotId?: string;
  manifest?: LeadFlowRunManifestData;
};

type DemoResult = AutomationDemoResult | LeadFlowDemoResult | LeadFlowRunResult;

type SnapshotHistoryEntry = {
  id: string;
  snapshotId: string;
  summary: string;
  startedAtISO: string;
  settingsSnapshot: LeadFlowSettingsSnapshot;
};

const SNAPSHOT_HISTORY_LIMIT = 5;

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const RELATIVE_TIME_STEPS: Array<{ unit: Intl.RelativeTimeFormatUnit; limit: number; divisor: number }> = [
  { unit: "second", limit: 60_000, divisor: 1_000 },
  { unit: "minute", limit: 3_600_000, divisor: 60_000 },
  { unit: "hour", limit: 86_400_000, divisor: 3_600_000 },
  { unit: "day", limit: 604_800_000, divisor: 86_400_000 },
  { unit: "week", limit: 2_592_000_000, divisor: 604_800_000 },
  { unit: "month", limit: 31_536_000_000, divisor: 2_592_000_000 },
];

const formatRelativeTimeFromNow = (iso: string): string => {
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) {
    return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  }

  const diffMs = timestamp - Date.now();
  const diffAbs = Math.abs(diffMs);

  for (const step of RELATIVE_TIME_STEPS) {
    if (diffAbs < step.limit) {
      return relativeTimeFormatter.format(Math.round(diffMs / step.divisor), step.unit);
    }
  }

  return new Date(timestamp).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
};

const formatSnapshotIdDisplay = (snapshotId: string): string => {
  if (!snapshotId) {
    return "UNKNOWN";
  }
  return snapshotId.slice(0, 8).toUpperCase();
};

const mapSettingsDtoToHistorySnapshot = (
  settings: LeadFlowSettingsDTO | null,
): LeadFlowSettingsSnapshot | null => {
  if (!settings) {
    return null;
  }

  const ownerValue = typeof settings.defaultOwner === "string" ? settings.defaultOwner.trim() : "";
  const followUpValue =
    typeof settings.followUpDueInDays === "number" && Number.isFinite(settings.followUpDueInDays)
      ? settings.followUpDueInDays
      : null;

  return {
    qualificationScoreThreshold: resolveQualificationThreshold(settings),
    autoCloseLowScoreLeads: isAutoCloseEnabled(settings),
    defaultOwner: ownerValue.length ? ownerValue : null,
    followUpDueInDays: followUpValue,
    isEnabled: typeof settings.isEnabled === "boolean" ? settings.isEnabled : undefined,
  } satisfies LeadFlowSettingsSnapshot;
};

export type DryRunPreview = {
  totalLeads: number;
  expectedQualified: number;
  threshold: number;
  autoCloseLowScoreLeads: boolean;
  owner?: string;
  followUpDays?: number;
  plan: "free" | "pro";
  limit: number | null;
  used: number;
  remaining: number | null;
};

type LiveRunInvocationOptions = {
  snapshotId: string;
  snapshotSettings: LeadFlowSettingsDTO;
  source: LeadFlowContractInput["source"];
  startedAtISO: string;
  idempotencyKey?: string;
  onSuccess?: () => void;
  onLimit?: () => void;
  onError?: () => void;
};

const DEFAULT_QUALIFICATION_THRESHOLD = 70;
const SUGGESTED_THRESHOLD_RANGE = "20–35";
const DEFAULT_PREVIEW_TOTAL_LEADS = 20;
const DEFAULT_PREVIEW_QUALIFIED_LEADS = 0;

const cloneSettings = (settings: LeadFlowSettingsDTO | null | undefined): LeadFlowSettingsDTO | null =>
  settings ? { ...settings } : null;

const formatNumber = (value: number) => value.toLocaleString("en-US");

const buildSampleRunPayload = ({
  agentId,
  settingsSnapshotId,
  source = "csv",
  simulate = false,
}: {
  agentId: string;
  settingsSnapshotId: string;
  source?: LeadFlowContractInput["source"];
  simulate?: boolean;
}): AutomationRunRequest => {
  return {
    agentId,
    source,
    settingsSnapshotId,
    simulate,
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

const formatLeadFlowOutcomeSummary = (summary: LeadFlowSummary, settings: LeadFlowSettingsDTO | null) => {
  const threshold = resolveQualificationThreshold(settings);
  const autoCloseEnabled = isAutoCloseEnabled(settings);
  const inbound = formatNumber(summary.inboundLeadsProcessed);
  const qualified = summary.qualifiedLeads;
  const meetings = summary.meetingsBooked;
  const hoursSaved = summary.hoursSaved > 0 ? summary.hoursSaved.toFixed(1) : null;
  const sentences: string[] = [];

  sentences.push(`Processed ${inbound} inbound leads with a ${threshold}-point qualification threshold.`);
  sentences.push(
    autoCloseEnabled
      ? "Low-score leads were auto-closed so sellers only see high-intent contacts."
      : "Low-score leads stayed open for manual review because auto-close is disabled.",
  );

  if (qualified === 0) {
    sentences.push(
      `No leads qualified, which usually means the bar is too high for this data set. Drop the threshold into the ${SUGGESTED_THRESHOLD_RANGE} range and rerun with a fresh batch.`,
    );
    sentences.push("Next step: adjust the score threshold, resend a small test file, and confirm conversion lifts.");
  } else {
    const qualifiedLabel = `${formatNumber(qualified)} lead${qualified === 1 ? "" : "s"}`;
    sentences.push(`${qualifiedLabel} cleared the bar, so the routing rules are working as configured.`);
    if (meetings > 0) {
      sentences.push(
        `Follow up on the ${formatNumber(meetings)} meeting${meetings === 1 ? "" : "s"} booked from this run to keep momentum high.`,
      );
    } else {
      sentences.push("Next step: push these qualified leads into outreach or task queues for fast follow-up.");
    }
  }

  if (hoursSaved) {
    sentences.push(`Automation saved about ${hoursSaved} hours of manual triage this pass.`);
  }

  return sentences.join(" ");
};

const buildLeadFlowAuditLog = ({
  summary,
  settingsSnapshot,
}: {
  summary: LeadFlowSummary;
  settingsSnapshot: LeadFlowSettingsDTO | null;
}): LeadFlowAuditEvent[] => {
  const events: LeadFlowAuditEvent[] = [];
  const threshold = resolveQualificationThreshold(settingsSnapshot);
  const totalLeadsLabel = formatNumber(summary.inboundLeadsProcessed);
  const qualifiedLabel = formatNumber(summary.qualifiedLeads);
  const followUpDays =
    typeof settingsSnapshot?.followUpDueInDays === "number" && Number.isFinite(settingsSnapshot.followUpDueInDays)
      ? settingsSnapshot.followUpDueInDays
      : null;

  events.push({ id: "leads-scored", label: `${totalLeadsLabel} leads scored` });
  events.push({ id: "qualified", label: `${qualifiedLabel} leads qualified (threshold ${threshold})` });

  if (summary.qualifiedLeads > 0) {
    const ownerValue = settingsSnapshot?.defaultOwner?.trim();
    events.push({
      id: "routing",
      label: `${qualifiedLabel} routed to ${ownerValue && ownerValue.length ? ownerValue : "assignment rules"}`,
    });
  } else {
    events.push({
      id: "no-qualified",
      label: `No leads qualified — consider lowering threshold (suggest ${SUGGESTED_THRESHOLD_RANGE})`,
    });
  }

  events.push({
    id: "low-score-handling",
    label: isAutoCloseEnabled(settingsSnapshot)
      ? "Low-score leads auto-closed"
      : "Low-score leads left open for manual review",
  });

  if (summary.meetingsBooked > 0) {
    events.push({
      id: "meetings",
      label: `${formatNumber(summary.meetingsBooked)} meetings booked`,
    });
  }

  if (followUpDays && followUpDays > 0) {
    events.push({ id: "follow-ups", label: `Follow-up tasks due in ${followUpDays} days` });
  }

  return events;
};

const resolveQualificationThreshold = (settings: LeadFlowSettingsDTO | null) => {
  const value = settings?.qualificationScoreThreshold;
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(100, Math.max(0, Math.round(value)));
  }
  return DEFAULT_QUALIFICATION_THRESHOLD;
};

const isAutoCloseEnabled = (settings: LeadFlowSettingsDTO | null) => {
  return typeof settings?.autoCloseBelowThreshold === "boolean"
    ? settings.autoCloseBelowThreshold
    : true;
};

function buildLiveRunManifest(input: {
  agentId: string;
  source: LeadFlowContractInput["source"];
  snapshotId: string;
  snapshotSettings: LeadFlowSettingsDTO | null;
  summary: LeadFlowSummary;
  idempotencyKey?: string;
  idempotencyReplayed?: boolean;
  startedAtISO: string;
  finishedAtISO: string;
  costUnits?: number;
}): LeadFlowRunManifestData {
  const ownerValue = input.snapshotSettings?.defaultOwner?.trim();
  const owner = ownerValue && ownerValue.length ? ownerValue : undefined;
  const followUpDays =
    typeof input.snapshotSettings?.followUpDueInDays === "number" &&
    Number.isFinite(input.snapshotSettings.followUpDueInDays)
      ? input.snapshotSettings.followUpDueInDays
      : undefined;

  const notes: string[] = [];
  if (input.idempotencyReplayed) {
    notes.push("Duplicate run prevented — previous result returned.");
  }

  return {
    runKind: "live",
    agentId: input.agentId,
    source: input.source,
    settingsSnapshotId: input.snapshotId,
    idempotencyKey: input.idempotencyKey,
    idempotencyReplayed: input.idempotencyReplayed,
    timestamps: {
      startedAtISO: input.startedAtISO,
      finishedAtISO: input.finishedAtISO,
    },
    guarantees: {
      noLeadsDeleted: true,
      noCrmFieldsOverwritten: true,
      canDisableAnytime: true,
      deterministicGivenSnapshot: true,
    },
    inputs: {
      threshold: resolveQualificationThreshold(input.snapshotSettings),
      autoCloseLowScoreLeads: isAutoCloseEnabled(input.snapshotSettings),
      owner,
      followUpDays,
    },
    outputs: {
      totalLeadsProcessed: input.summary.inboundLeadsProcessed,
      qualifiedLeads: input.summary.qualifiedLeads,
      meetingsBooked: input.summary.meetingsBooked,
      estimatedCostUnits: input.costUnits,
    },
    notes: notes.length ? notes : undefined,
  } satisfies LeadFlowRunManifestData;
}

const buildLeadFlowRunCard = (
  variant: RunCardData["variant"],
  title: string,
  summary: LeadFlowSummary,
  raw: unknown,
  summaryTextOverride?: string,
  auditEvents?: LeadFlowAuditEvent[],
  idempotencyBadge?: RunCardData["idempotencyBadge"],
  costUnits?: number,
  snapshotId?: string,
  manifest?: LeadFlowRunManifestData,
): RunCardData => ({
  variant,
  title,
  summary: summaryTextOverride ?? buildLeadFlowSummaryText(summary),
  metrics: mapSummaryToMetricsList(summary),
  actions: summary.actions,
  raw,
  auditEvents,
  idempotencyBadge,
  costUnits,
  snapshotId,
  manifest,
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

const isLeadFlowRunSuccessPayload = (payload: unknown): payload is LeadFlowRunSuccess => {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      "ok" in payload &&
      (payload as { ok?: unknown }).ok === true,
  );
};

const isLeadFlowRunFailurePayload = (payload: unknown): payload is LeadFlowRunFailure => {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      "ok" in payload &&
      (payload as { ok?: unknown }).ok === false &&
      typeof (payload as { error?: unknown }).error === "object",
  );
};

export function AgentDetailClient({
  automation,
  detailContent,
  showBackLink,
  initialSettings,
  runUsage,
}: AgentDetailClientProps) {
  const galleryImages = automation.gallery?.length
    ? automation.gallery
    : [automation.thumbnail ?? FALLBACK_THUMBNAIL];
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null);
  const [liveDemoError, setLiveDemoError] = useState<string | null>(null);
  const [liveRunNotice, setLiveRunNotice] = useState<string | null>(null);
  const [isRunningLive, setIsRunningLive] = useState(false);
  const [liveRunResult, setLiveRunResult] = useState<LeadFlowRunResult | null>(null);
  const [pendingRunSettingsSnapshot, setPendingRunSettingsSnapshot] = useState<LeadFlowSettingsDTO | null>(null);
  const [isPreparingRunSnapshot, setIsPreparingRunSnapshot] = useState(false);
  const [liveRunSnapshotId, setLiveRunSnapshotId] = useState<string | null>(null);
  const [liveRunManifest, setLiveRunManifest] = useState<LeadFlowRunManifestData | null>(null);
  const [snapshotHistory, setSnapshotHistory] = useState<SnapshotHistoryEntry[]>([]);
  const [selectedSnapshotHistoryId, setSelectedSnapshotHistoryId] = useState<string | null>(null);
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

  const [settingsState, setSettingsState] = useState<LeadFlowSettingsDTO | null>(initialSettings ?? null);
  const [demoSettingsSnapshot, setDemoSettingsSnapshot] = useState<LeadFlowSettingsDTO | null>(
    cloneSettings(initialSettings ?? null),
  );
  const [liveRunSettingsSnapshot, setLiveRunSettingsSnapshot] = useState<LeadFlowSettingsDTO | null>(
    cloneSettings(initialSettings ?? null),
  );
  const [usageState, setUsageState] = useState<LeadFlowUsageSummary | null>(runUsage ?? null);
  const [showDryRunPreview, setShowDryRunPreview] = useState(false);
  const [dryRunPreview, setDryRunPreview] = useState<DryRunPreview | null>(null);
  const [realRunAcknowledged, setRealRunAcknowledged] = useState(false);
  const [runIdempotencyKey, setRunIdempotencyKey] = useState<string | null>(null);
  const [highlightAutomationSettings, setHighlightAutomationSettings] = useState(false);
  const automationSettingsSectionRef = useRef<HTMLDivElement | null>(null);
  const statusRowRef = useRef<HTMLDivElement | null>(null);
  const statusToggleRef = useRef<HTMLButtonElement | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const normalizedInitial = cloneSettings(initialSettings ?? null);
    setSettingsState(normalizedInitial);
    setDemoSettingsSnapshot(normalizedInitial);
    setLiveRunSettingsSnapshot(normalizedInitial);
  }, [initialSettings]);

  useEffect(() => {
    setUsageState(runUsage ?? null);
  }, [runUsage]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const runsUsed = usageState?.usedThisMonth ?? 0;
  const monthlyLimit = usageState?.monthlyLimit ?? null;
  const isFreePlanLimitReached = Boolean(monthlyLimit !== null && runsUsed >= monthlyLimit);
  const runsRemaining = monthlyLimit === null ? null : Math.max(monthlyLimit - runsUsed, 0);
  const planBadgeLabel =
    usageState?.plan === "pro"
      ? "Pro plan"
      : usageState?.plan === "free"
        ? "Free plan"
        : "Current plan";
  const usageSummaryText =
    monthlyLimit !== null
      ? `${runsUsed}/${monthlyLimit} live runs used this month${runsRemaining !== null ? ` · ${runsRemaining} left` : ""}`
      : `${runsUsed} live runs this month`;

  const resolveNarrativeSettings = useCallback(
    (snapshot: LeadFlowSettingsDTO | null) => snapshot ?? settingsState ?? initialSettings ?? null,
    [initialSettings, settingsState],
  );

  const buildDryRunPreview = useCallback((): DryRunPreview => {
    const settingsSnapshot = cloneSettings(settingsState ?? initialSettings ?? null);
    const threshold = resolveQualificationThreshold(settingsSnapshot);
    const autoCloseLowScoreLeads = isAutoCloseEnabled(settingsSnapshot);
    const owner = settingsSnapshot?.defaultOwner ?? undefined;
    const followUpValue = settingsSnapshot?.followUpDueInDays;
    const followUpDays = typeof followUpValue === "number" && Number.isFinite(followUpValue)
      ? followUpValue
      : undefined;

    const summaryCandidate = (() => {
      if (demoResult && (isLeadFlowRunResult(demoResult) || isLeadFlowDemoResult(demoResult))) {
        return demoResult.summary;
      }
      if (liveRunResult) {
        return liveRunResult.summary;
      }
      return null;
    })();

    const totalLeads = summaryCandidate?.inboundLeadsProcessed ?? DEFAULT_PREVIEW_TOTAL_LEADS;
    const expectedQualified = summaryCandidate?.qualifiedLeads ?? DEFAULT_PREVIEW_QUALIFIED_LEADS;

    const plan: "free" | "pro" = usageState?.plan === "pro" ? "pro" : "free";
    const inferredLimit =
      plan === "free"
        ? typeof usageState?.monthlyLimit === "number"
          ? usageState.monthlyLimit
          : FREE_PLAN_MONTHLY_LIMIT
        : null;
    const used = usageState?.usedThisMonth ?? 0;
    const remaining =
      plan === "free" && typeof inferredLimit === "number"
        ? Math.max(inferredLimit - used, 0)
        : null;

    return {
      totalLeads,
      expectedQualified,
      threshold,
      autoCloseLowScoreLeads,
      owner,
      followUpDays,
      plan,
      limit: plan === "free" ? inferredLimit : null,
      used,
      remaining,
    } satisfies DryRunPreview;
  }, [demoResult, initialSettings, liveRunResult, settingsState, usageState]);

  const handleSettingsChange = useCallback((next: LeadFlowSettingsDTO | null) => {
    setSettingsState((previous) => {
      const wasEnabled = previous?.isEnabled ?? false;
      const nextEnabled = next?.isEnabled ?? false;

      if (!wasEnabled && nextEnabled) {
        console.info("automation_enabled");
      }

      return next;
    });
  }, []);

  const serializedSettings = useMemo(() => {
    if (!settingsState) {
      return null;
    }

    return {
      agentSlug: settingsState.agentSlug,
      isEnabled: settingsState.isEnabled,
      qualificationScoreThreshold: settingsState.qualificationScoreThreshold,
      autoCloseBelowThreshold: settingsState.autoCloseBelowThreshold,
      followUpDueInDays: settingsState.followUpDueInDays,
      defaultOwner: settingsState.defaultOwner ?? null,
      defaultOwnerEmail: settingsState.defaultOwner ?? null,
      updatedAt: settingsState.updatedAt,
    };
  }, [settingsState]);

  const resolveSettingsSnapshotId = useCallback(() => {
    if (serializedSettings?.updatedAt) {
      return serializedSettings.updatedAt;
    }
    return new Date().toISOString();
  }, [serializedSettings]);

  const baseSections = useMemo(
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

  const tabSections = useMemo(() => {
    const sharedTabs = baseSections.map((section) => ({ id: section.id, label: section.label }));
    if (!isLeadFlowAutopilot) {
      return sharedTabs;
    }

    return [
      ...sharedTabs,
      {
        id: "settings",
        label: "Automation settings",
      },
    ];
  }, [baseSections, isLeadFlowAutopilot]);

  const activeTabDefault = tabSections[0]?.id ?? "overview";
  const [activeTab, setActiveTab] = useState(activeTabDefault);

  useEffect(() => {
    setActiveTab((prev) => (prev === activeTabDefault ? prev : activeTabDefault));
  }, [activeTabDefault]);

  const baseSectionPanels = useMemo(
    () =>
      baseSections.map((section) => (
        <div key={section.id} hidden={section.id !== activeTab}>
          {section.content}
        </div>
      )),
    [activeTab, baseSections],
  );

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

  const scrollToAutomationSettings = useCallback(
    (
      { highlight = false, focusToggle = false }: { highlight?: boolean; focusToggle?: boolean } = {},
    ) => {
      if (!isLeadFlowAutopilot) {
        return;
      }

      setActiveTab("settings");
      let hasLoggedScroll = false;

      const focusToggleElement = (attempt = 0) => {
        if (!focusToggle) {
          return;
        }

        if (statusToggleRef.current) {
          statusToggleRef.current.focus();
          return;
        }

        if (attempt < 6) {
          window.setTimeout(() => focusToggleElement(attempt + 1), 80);
        }
      };

      const triggerEffects = (attempt = 0) => {
        const sectionEl = statusRowRef.current ?? automationSettingsSectionRef.current;
        if (!sectionEl) {
          if (attempt < 6) {
            window.setTimeout(() => triggerEffects(attempt + 1), 80);
          }
          return;
        }

        sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });

        if (!hasLoggedScroll) {
          console.info("scrolled_to_settings");
          hasLoggedScroll = true;
        }

        if (highlight) {
          setHighlightAutomationSettings(true);
          if (highlightTimeoutRef.current) {
            window.clearTimeout(highlightTimeoutRef.current);
          }
          highlightTimeoutRef.current = window.setTimeout(() => {
            setHighlightAutomationSettings(false);
          }, 1200);
        }

        focusToggleElement();
      };

      triggerEffects();
    },
    [isLeadFlowAutopilot, setActiveTab],
  );

  const handleEnableCtaPrimary = useCallback(() => {
    console.info("cta_apply_clicked");
    scrollToAutomationSettings({ highlight: true, focusToggle: true });
  }, [scrollToAutomationSettings]);

  const handleEnableCtaSecondary = useCallback(() => {
    scrollToAutomationSettings({ highlight: false, focusToggle: false });
  }, [scrollToAutomationSettings]);

  const handleLeadFlowRun = async () => {
    if (!isLeadFlowAutopilot || isDemoLoading) {
      return;
    }

    setIsDemoLoading(true);
    setLiveDemoError(null);
    const settingsSnapshot = cloneSettings(settingsState ?? initialSettings ?? null);

    try {
      const payload = buildSampleRunPayload({
        agentId: automation.slug,
        source: LIVE_RUN_SOURCE,
        settingsSnapshotId: resolveSettingsSnapshotId(),
        simulate: true,
      });
      const response = await fetch(`/api/automations/${automation.slug}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          settings: serializedSettings ?? undefined,
        }),
      });

      const contractPayload = (await response.json().catch(() => null)) as unknown;

      if (isLeadFlowRunFailurePayload(contractPayload)) {
        setLiveDemoError(contractPayload.error.message);
        return;
      }

      if (!isLeadFlowRunSuccessPayload(contractPayload)) {
        setLiveDemoError("Run request returned an unexpected payload.");
        return;
      }

      const payloadResult = contractPayload.data;

      if (isLeadFlowRunResult(payloadResult)) {
        setDemoSettingsSnapshot(settingsSnapshot);
        setDemoResult(payloadResult);
        setLiveDemoError(null);
        return;
      }

      if (isLeadFlowDemoResult(payloadResult) || isLegacyAutomationDemoResult(payloadResult)) {
        setDemoSettingsSnapshot(settingsSnapshot);
        setDemoResult(payloadResult);
        setLiveDemoError(null);
        return;
      }

      setLiveDemoError("Run request returned an unexpected payload.");
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

  const presentLiveRunFailure = useCallback(
    (
      failure: LeadFlowRunFailure,
      options?: Pick<LiveRunInvocationOptions, "onLimit" | "onError">,
    ) => {
      const { error } = failure;

      if (error.code === "RATE_LIMITED") {
        setUsageState((current) => {
          if (!current) {
            return current;
          }

          const inferredLimit =
            typeof current.monthlyLimit === "number"
              ? current.monthlyLimit
              : current.plan === "free"
                ? FREE_PLAN_MONTHLY_LIMIT
                : null;

          if (typeof inferredLimit !== "number") {
            return current;
          }

          return {
            ...current,
            usedThisMonth: inferredLimit,
            monthlyLimit: inferredLimit,
          } satisfies LeadFlowUsageSummary;
        });
        options?.onLimit?.();
      } else if (error.code !== "IN_PROGRESS" && error.code !== "IDEMPOTENCY_REPLAY") {
        options?.onError?.();
      }

      if (error.retryable) {
        const includesRetryPhrase = error.message.toLowerCase().includes("try again");
        setLiveRunNotice(includesRetryPhrase ? error.message : `${error.message} Try again.`);
      } else {
        setLiveRunNotice(error.message);
      }
      setLiveDemoError(null);

      if (error.code === "IDEMPOTENCY_REPLAY") {
        setRunIdempotencyKey(null);
      }
    },
    [setLiveDemoError, setLiveRunNotice, setRunIdempotencyKey, setUsageState],
  );

  const handleLiveRun = useCallback(
    async (options: LiveRunInvocationOptions) => {
      if (!isLeadFlowAutopilot || isRunningLive || isFreePlanLimitReached) {
        return;
      }

      setIsRunningLive(true);
      setLiveDemoError(null);
      setLiveRunNotice(null);

      try {
        const payload = buildSampleRunPayload({
          agentId: automation.slug,
          source: options.source,
          settingsSnapshotId: options.snapshotId,
          simulate: false,
        });
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (options.idempotencyKey) {
          headers["Idempotency-Key"] = options.idempotencyKey;
        }

        const response = await fetch(`/api/automations/${automation.slug}/run`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        const contractPayload = (await response.json().catch(() => null)) as unknown;

        if (isLeadFlowRunFailurePayload(contractPayload)) {
          presentLiveRunFailure(contractPayload, options);
          return;
        }

        if (!isLeadFlowRunSuccessPayload(contractPayload)) {
          setLiveDemoError("Run request returned an unexpected payload.");
          options.onError?.();
          return;
        }

        const data = contractPayload.data;
        if (!isLeadFlowRunResult(data)) {
          setLiveDemoError("Run request returned an unexpected payload.");
          options.onError?.();
          return;
        }

        const finishedAtISO = new Date().toISOString();
        const costUnits = estimateLeadFlowRunCostUnits({
          totalLeads: data.summary.inboundLeadsProcessed,
          qualifiedLeads: data.summary.qualifiedLeads,
          meetingsBooked: data.summary.meetingsBooked,
          autoCloseLowScoreLeads: isAutoCloseEnabled(options.snapshotSettings),
        });

        const manifest = buildLiveRunManifest({
          agentId: automation.slug,
          source: options.source,
          snapshotId: options.snapshotId,
          snapshotSettings: options.snapshotSettings,
          summary: data.summary,
          idempotencyKey: options.idempotencyKey,
          idempotencyReplayed: Boolean(data.idempotencyReplayed),
          startedAtISO: options.startedAtISO,
          finishedAtISO,
          costUnits,
        });

        setLiveRunManifest(manifest);
        setLiveRunResult(data);
        setLiveRunNotice(null);
        options.onSuccess?.();
        setLiveRunSettingsSnapshot(options.snapshotSettings);
        setLiveRunSnapshotId(options.snapshotId);
        setLiveDemoError(null);
        setUsageState((current) => (current ? { ...current, usedThisMonth: current.usedThisMonth + 1 } : current));
      } catch (error) {
        console.error("Lead Flow live run error", error);
        setLiveRunNotice(null);
        setLiveDemoError(error instanceof Error ? error.message : "Unable to run the automation right now.");
        options.onError?.();
      } finally {
        setIsRunningLive(false);
      }
    },
    [
      automation.slug,
      isFreePlanLimitReached,
      isLeadFlowAutopilot,
      isRunningLive,
      presentLiveRunFailure,
      setLiveRunSnapshotId,
      setLiveRunSettingsSnapshot,
      setUsageState,
    ],
  );

  const demoButtonLabel = isLeadFlowAutopilot && isDemoLoading ? "Running demo…" : "Try Live Demo";
  const runButtonLabel = isFreePlanLimitReached
    ? "Limit reached"
    : isRunningLive
      ? "Running…"
      : "Run now";
  const isRunButtonDisabled = isRunningLive || isFreePlanLimitReached;
  const handleDemoButtonClick = () => {
    if (isLeadFlowAutopilot) {
      void handleLeadFlowRun();
      return;
    }

    handleScrollToDemo();
  };

  const handleOpenDryRunPreview = useCallback(() => {
    if (!isLeadFlowAutopilot || isRunButtonDisabled || showDryRunPreview) {
      return;
    }

    const preview = buildDryRunPreview();
    const snapshotSettings = cloneSettings(settingsState ?? initialSettings ?? null);
    setDryRunPreview(preview);
    setShowDryRunPreview(true);
    setPendingRunSettingsSnapshot(snapshotSettings);
    setRunIdempotencyKey(crypto.randomUUID());
  }, [
    buildDryRunPreview,
    initialSettings,
    isLeadFlowAutopilot,
    isRunButtonDisabled,
    settingsState,
    showDryRunPreview,
  ]);

  const handleCloseDryRunPreview = useCallback(() => {
    setShowDryRunPreview(false);
    setDryRunPreview(null);
    setRunIdempotencyKey(null);
    setPendingRunSettingsSnapshot(null);
    setIsPreparingRunSnapshot(false);
  }, []);

  const handleConfirmDryRun = useCallback(() => {
    if (!isLeadFlowAutopilot || !dryRunPreview || !realRunAcknowledged) {
      return;
    }

    const snapshotSettings =
      pendingRunSettingsSnapshot ?? cloneSettings(settingsState ?? initialSettings ?? null);

    if (!snapshotSettings) {
      setLiveDemoError("Unable to capture settings for this run.");
      return;
    }

    const key = runIdempotencyKey ?? crypto.randomUUID();
    if (!runIdempotencyKey) {
      setRunIdempotencyKey(key);
    }

    const startedAtISO = new Date().toISOString();

    const execute = async () => {
      setIsPreparingRunSnapshot(true);
      try {
        const { snapshotId } = await createLeadFlowSettingsSnapshotAction({
          agentId: automation.slug,
          settings: snapshotSettings,
        });

        const runPromise = handleLiveRun({
          snapshotId,
          snapshotSettings,
          source: LIVE_RUN_SOURCE,
          startedAtISO,
          idempotencyKey: key,
          onSuccess: handleCloseDryRunPreview,
          onLimit: handleCloseDryRunPreview,
          onError: handleCloseDryRunPreview,
        });

        await runPromise;
      } catch (error) {
        console.error("Lead Flow snapshot action error", error);
        setLiveDemoError("Unable to prepare settings snapshot for this run.");
      } finally {
        setIsPreparingRunSnapshot(false);
      }
    };

    void execute();
  }, [
    automation.slug,
    dryRunPreview,
    handleCloseDryRunPreview,
    handleLiveRun,
    initialSettings,
    isLeadFlowAutopilot,
    pendingRunSettingsSnapshot,
    realRunAcknowledged,
    runIdempotencyKey,
    settingsState,
  ]);

  useEffect(() => {
    if (!isLeadFlowAutopilot || !liveRunResult || !liveRunManifest) {
      return;
    }

    if (liveRunManifest.runKind !== "live") {
      return;
    }

    const snapshotId = liveRunManifest.settingsSnapshotId ?? liveRunSnapshotId;
    const startedAtISO = liveRunManifest.timestamps.startedAtISO;

    if (!snapshotId || !startedAtISO) {
      return;
    }

    const snapshotSettings = resolveNarrativeSettings(liveRunSettingsSnapshot);
    const summaryOverride = formatLeadFlowOutcomeSummary(liveRunResult.summary, snapshotSettings);
    const summaryText = summaryOverride || buildLeadFlowSummaryText(liveRunResult.summary);
    const historyEntryId = `${snapshotId}-${startedAtISO}`;
    const historySettingsSnapshot = mapSettingsDtoToHistorySnapshot(snapshotSettings);

    if (!historySettingsSnapshot) {
      return;
    }

    setSnapshotHistory((current) => {
      const baseEntry = {
        id: historyEntryId,
        snapshotId,
        summary: summaryText,
        startedAtISO,
        settingsSnapshot: historySettingsSnapshot,
      } satisfies SnapshotHistoryEntry;

      const existingIndex = current.findIndex((entry) => entry.id === historyEntryId);
      if (existingIndex >= 0) {
        const nextEntries = [...current];
        nextEntries[existingIndex] = baseEntry;
        return nextEntries;
      }

      return [baseEntry, ...current].slice(0, SNAPSHOT_HISTORY_LIMIT);
    });
  }, [
    isLeadFlowAutopilot,
    liveRunManifest,
    liveRunResult,
    liveRunSettingsSnapshot,
    liveRunSnapshotId,
    resolveNarrativeSettings,
  ]);

  const liveRunSummaryOverride = useMemo(() => {
    if (!isLeadFlowAutopilot || !liveRunResult) {
      return null;
    }
    return formatLeadFlowOutcomeSummary(
      liveRunResult.summary,
      resolveNarrativeSettings(liveRunSettingsSnapshot),
    );
  }, [isLeadFlowAutopilot, liveRunResult, liveRunSettingsSnapshot, resolveNarrativeSettings]);

  const demoSummaryOverride = useMemo(() => {
    if (!isLeadFlowAutopilot || !demoResult) {
      return null;
    }

    if (isLeadFlowRunResult(demoResult) || isLeadFlowDemoResult(demoResult)) {
      return formatLeadFlowOutcomeSummary(
        demoResult.summary,
        resolveNarrativeSettings(demoSettingsSnapshot),
      );
    }

    return null;
  }, [demoResult, demoSettingsSnapshot, isLeadFlowAutopilot, resolveNarrativeSettings]);

  const orderedSnapshotHistory = useMemo(() => {
    if (!snapshotHistory.length) {
      return [] as SnapshotHistoryEntry[];
    }

    return [...snapshotHistory].sort((a, b) => {
      const timeA = Date.parse(a.startedAtISO);
      const timeB = Date.parse(b.startedAtISO);
      const safeA = Number.isNaN(timeA) ? 0 : timeA;
      const safeB = Number.isNaN(timeB) ? 0 : timeB;
      return safeB - safeA;
    });
  }, [snapshotHistory]);

  useEffect(() => {
    if (!orderedSnapshotHistory.length) {
      setSelectedSnapshotHistoryId(null);
      return;
    }

    setSelectedSnapshotHistoryId((current) => {
      if (current && orderedSnapshotHistory.some((entry) => entry.id === current)) {
        return current;
      }
      return orderedSnapshotHistory[0]?.id ?? null;
    });
  }, [orderedSnapshotHistory]);

  const selectedSnapshotHistoryEntry = useMemo(() => {
    if (!orderedSnapshotHistory.length) {
      return null;
    }

    if (!selectedSnapshotHistoryId) {
      return orderedSnapshotHistory[0] ?? null;
    }

    return (
      orderedSnapshotHistory.find((entry) => entry.id === selectedSnapshotHistoryId) ??
      orderedSnapshotHistory[0] ??
      null
    );
  }, [orderedSnapshotHistory, selectedSnapshotHistoryId]);

  const baselineSnapshotHistoryEntry = useMemo(() => {
    if (!selectedSnapshotHistoryEntry) {
      return null;
    }

    const selectedIndex = orderedSnapshotHistory.findIndex(
      (entry) => entry.id === selectedSnapshotHistoryEntry.id,
    );

    if (selectedIndex < 0) {
      return null;
    }

    return orderedSnapshotHistory[selectedIndex + 1] ?? null;
  }, [orderedSnapshotHistory, selectedSnapshotHistoryEntry]);

  const snapshotDiffLines = useMemo<LeadFlowSettingsDiffLine[]>(() => {
    if (!selectedSnapshotHistoryEntry || !baselineSnapshotHistoryEntry) {
      return [];
    }

    return diffLeadFlowSettings(
      baselineSnapshotHistoryEntry.settingsSnapshot,
      selectedSnapshotHistoryEntry.settingsSnapshot,
    );
  }, [baselineSnapshotHistoryEntry, selectedSnapshotHistoryEntry]);

  const liveRunCard = liveRunResult
    ? (() => {
        const narrativeSettings = resolveNarrativeSettings(liveRunSettingsSnapshot);
        const auditEvents = buildLeadFlowAuditLog({
          summary: liveRunResult.summary,
          settingsSnapshot: narrativeSettings,
        });

        const manifestForLiveRun =
          liveRunManifest && liveRunSnapshotId && liveRunManifest.settingsSnapshotId === liveRunSnapshotId
            ? liveRunManifest
            : null;

        const costUnits =
          manifestForLiveRun?.outputs.estimatedCostUnits ??
          estimateLeadFlowRunCostUnits({
            totalLeads: liveRunResult.summary.inboundLeadsProcessed,
            qualifiedLeads: liveRunResult.summary.qualifiedLeads,
            meetingsBooked: liveRunResult.summary.meetingsBooked,
            autoCloseLowScoreLeads: isAutoCloseEnabled(narrativeSettings),
          });

        if (liveRunResult.idempotencyReplayed) {
          auditEvents.unshift({
            id: "duplicate-run-detected",
            label: "Duplicate run detected — previous result returned.",
          });
        }

        return buildLeadFlowRunCard(
          "live",
          `${automation.name} run`,
          liveRunResult.summary,
          liveRunResult,
          liveRunSummaryOverride ?? undefined,
          auditEvents,
          liveRunResult.idempotencyReplayed ? "replayed" : undefined,
          costUnits,
          liveRunSnapshotId ?? undefined,
          manifestForLiveRun ?? undefined,
        );
      })()
    : null;

  const demoCard = demoResult
    ? isLeadFlowRunResult(demoResult)
      ? buildLeadFlowRunCard(
          "demo",
          `${automation.name} demo preview`,
          demoResult.summary,
          demoResult,
          demoSummaryOverride ?? undefined,
          buildLeadFlowAuditLog({
            summary: demoResult.summary,
            settingsSnapshot: resolveNarrativeSettings(demoSettingsSnapshot),
          }),
          undefined,
          undefined,
          undefined,
          undefined,
        )
      : isLeadFlowDemoResult(demoResult)
        ? buildLeadFlowRunCard(
            "demo",
            `${automation.name} demo preview`,
            demoResult.summary,
            demoResult,
            demoSummaryOverride ?? undefined,
            buildLeadFlowAuditLog({
              summary: demoResult.summary,
              settingsSnapshot: resolveNarrativeSettings(demoSettingsSnapshot),
            }),
            undefined,
            undefined,
            undefined,
            undefined,
          )
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
  const automationIsEnabled = settingsState?.isEnabled ?? initialSettings?.isEnabled ?? false;
  const showAutomationEnableCta = Boolean(liveRunResult && !automationIsEnabled);

  return (
    <>
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
            <div>
              <nav className="flex flex-wrap gap-2 rounded-2xl border border-border bg-muted/40 p-2">
                {tabSections.map((section) => (
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
                {isLeadFlowAutopilot ? (
                  <>
                    <div
                      id="automation-settings"
                      ref={automationSettingsSectionRef}
                      hidden={activeTab !== "settings"}
                    >
                      {activeTab === "settings" ? (
                        <LeadFlowSettingsPanel
                          agentSlug={automation.slug}
                          initialSettings={initialSettings ?? null}
                          onSettingsChange={handleSettingsChange}
                          statusSectionRef={statusRowRef}
                          statusSwitchRef={statusToggleRef}
                          highlightStatus={highlightAutomationSettings}
                        />
                      ) : null}
                    </div>
                    {baseSectionPanels}
                  </>
                ) : (
                  baseSectionPanels
                )}
              </div>
            </div>
            {showDryRunPreview && dryRunPreview ? (
              <LeadFlowDryRunPreview
                preview={dryRunPreview}
                onCancel={handleCloseDryRunPreview}
                onConfirm={handleConfirmDryRun}
                acknowledged={realRunAcknowledged}
                onAcknowledgeChange={setRealRunAcknowledged}
                isRunning={isPreparingRunSnapshot || isRunningLive}
              />
            ) : null}

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
                    onClick={handleOpenDryRunPreview}
                    className={buttonVariants({ variant: "outline" })}
                    disabled={isRunButtonDisabled}
                  >
                    {runButtonLabel}
                  </button>
                ) : null}
                <Link
                  href={`/docs/${automation.slug}`}
                  className={buttonVariants({ variant: "ghost" })}
                >
                  View setup guide
                </Link>
              </div>
              {isLeadFlowAutopilot && liveRunNotice ? (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  {liveRunNotice}
                </div>
              ) : null}
              {isLeadFlowAutopilot ? (
                <div className="mt-4 space-y-4">
                  {usageState ? (
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-3",
                        isFreePlanLimitReached
                          ? "border-amber-400/70 bg-amber-50"
                          : "border-border/60 bg-background/60",
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {planBadgeLabel}
                          </p>
                          <p className="text-sm font-semibold text-foreground">{usageSummaryText}</p>
                        </div>
                        <Link
                          href="/pricing"
                          className={buttonVariants({
                            size: "sm",
                            variant: isFreePlanLimitReached ? "default" : "outline",
                            className: "rounded-full",
                          })}
                        >
                          {isFreePlanLimitReached ? "Upgrade plan" : "View plans"}
                        </Link>
                      </div>
                      <p
                        className={cn(
                          "mt-2 text-xs",
                          isFreePlanLimitReached ? "text-amber-900" : "text-muted-foreground",
                        )}
                      >
                        {isFreePlanLimitReached
                          ? "Free plan limit reached. Upgrade to unlock unlimited on-demand runs."
                          : usageState.plan === "free" && monthlyLimit !== null
                            ? `Free plan includes ${monthlyLimit} manual runs per month.`
                            : "Pro plan includes unlimited manual runs."}
                      </p>
                    </div>
                  ) : null}
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
                    <>
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
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              activeRunCard.variant === "live"
                                ? "bg-emerald-600 text-[10px] font-semibold uppercase tracking-wide text-white"
                                : "bg-primary/80 text-[10px] font-semibold uppercase tracking-wide text-white"
                            }
                          >
                            {activeRunCard.variant === "live" ? "LIVE" : "DEMO"}
                          </Badge>
                          {activeRunCard.idempotencyBadge === "replayed" ? (
                            <Badge variant="outline" className="border-emerald-200/70 bg-emerald-50 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                              Replayed result
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      {activeRunCard.snapshotId ? (
                        <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
                          Settings snapshot · {activeRunCard.snapshotId}
                        </p>
                      ) : null}
                      <p className="text-sm text-muted-foreground">{activeRunCard.summary}</p>
                      {activeRunCard.variant === "live" && typeof activeRunCard.costUnits === "number" ? (
                        <p className="text-xs text-muted-foreground">
                          Estimated run cost: ~{formatNumber(activeRunCard.costUnits)} units · Based on leads processed and actions taken.
                        </p>
                      ) : null}
                      {activeRunCard.variant === "demo" ? (
                        <p className="text-xs text-muted-foreground">Demo cost: n/a</p>
                      ) : null}
                      {activeRunCard.variant === "live" && showAutomationEnableCta ? (
                        <div className="mt-4 space-y-3 rounded-2xl border border-emerald-200 bg-white/90 p-4 text-sm shadow-sm">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Ready to apply this to real leads?</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              This run used sample data. Turn on Lead Flow Autopilot to apply the same logic to your real inbound HubSpot leads.
                            </p>
                          </div>
                          <p className="text-xs font-medium text-emerald-700">Safe to enable — you can disable anytime.</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={handleEnableCtaPrimary}
                              className={buttonVariants({ variant: "default", className: "rounded-full" })}
                            >
                              Apply to real HubSpot leads
                            </button>
                            <button
                              type="button"
                              onClick={handleEnableCtaSecondary}
                              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                            >
                              Review settings first
                            </button>
                          </div>
                        </div>
                      ) : null}
                      {activeRunCard.auditEvents?.length ? (
                        <div className="mt-4">
                          <LeadFlowAuditLog events={activeRunCard.auditEvents} />
                        </div>
                      ) : null}
                      {activeRunCard.variant === "live" && activeRunCard.manifest ? (
                        <div className="mt-4">
                          <LeadFlowRunManifestCard manifest={activeRunCard.manifest} />
                        </div>
                      ) : null}
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
                      {activeRunCard.variant === "live" && orderedSnapshotHistory.length ? (
                        <div className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-foreground">Snapshot history</p>
                            <p className="text-xs text-muted-foreground">Each run uses an immutable snapshot of your settings.</p>
                          </div>
                          <ul className="space-y-2">
                            {orderedSnapshotHistory.map((entry) => {
                              const isSelected = selectedSnapshotHistoryEntry?.id === entry.id;
                              const isBaseline = baselineSnapshotHistoryEntry?.id === entry.id;

                              return (
                                <li key={entry.id}>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSnapshotHistoryId(entry.id)}
                                    aria-pressed={isSelected}
                                    className={cn(
                                      "w-full rounded-xl border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                      isSelected
                                        ? "border-foreground bg-card text-foreground"
                                        : "border-border/50 bg-card/80 text-foreground hover:border-border",
                                      isBaseline && !isSelected ? "border-dashed" : undefined,
                                    )}
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                                      <span className="font-semibold text-foreground">
                                        {formatRelativeTimeFromNow(entry.startedAtISO)}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {isSelected ? (
                                          <Badge className="bg-emerald-600 text-[10px] font-semibold uppercase tracking-wide text-white">
                                            Current
                                          </Badge>
                                        ) : null}
                                        {isBaseline ? (
                                          <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wide">
                                            Baseline
                                          </Badge>
                                        ) : null}
                                        <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                                          Snapshot {formatSnapshotIdDisplay(entry.snapshotId)}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-muted-foreground" title={entry.summary}>
                                      {entry.summary}
                                    </p>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                          {selectedSnapshotHistoryEntry && baselineSnapshotHistoryEntry ? (
                            <div className="rounded-2xl border border-border/80 bg-card/80 p-4">
                              <p className="text-sm font-semibold text-foreground">What changed?</p>
                              <p className="text-xs text-muted-foreground">Comparing to previous run</p>
                              {snapshotDiffLines.length ? (
                                <ul className="mt-3 space-y-2">
                                  {snapshotDiffLines.map((line) => (
                                    <li key={line.key} className="text-sm text-muted-foreground">
                                      <span className="font-medium text-foreground">{line.label}:</span>{" "}
                                      <span>
                                        {line.from} {"->"} {line.to}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-3 text-sm text-muted-foreground">
                                  No settings changed since the previous run.
                                </p>
                              )}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </>
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
    </>
  );
}
