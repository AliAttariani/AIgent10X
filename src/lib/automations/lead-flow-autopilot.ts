import { processIncomingLead, ProcessResult } from "./processIncomingLead";
import type { RawLead, EnrichedLead } from "./enrichment";
import type { QualificationResult } from "./qualification";
import type { Task } from "./tasks";
import type { Deal } from "./deals";
import { LEAD_FLOW_DEFAULT_CONFIG, type LeadFlowConfig } from "./leadFlowConfig";
import type { LeadFlowSettings } from "./leadFlowSettings";
import { createHubSpotClient, type HubSpotClient } from "../crm/hubspot";
import type { Lead as CRMLead } from "../crm/types";

export const LEAD_FLOW_AUTOPILOT_SLUG = "lead-flow-autopilot";

const FALLBACK_SETTINGS: LeadFlowSettings = {
  agentSlug: LEAD_FLOW_AUTOPILOT_SLUG,
  isEnabled: true,
  qualificationScoreThreshold: 70,
  autoCloseBelowThreshold: true,
  defaultOwner: null,
  followUpDueInDays: 2,
  updatedAt: new Date(0),
};

function normalizeSettings(settings?: LeadFlowSettings | null): LeadFlowSettings {
  if (!settings) {
    return {
      ...FALLBACK_SETTINGS,
      updatedAt: new Date(),
    };
  }

  const followUpDueInDays = Number.isFinite(settings.followUpDueInDays)
    ? Math.min(30, Math.max(1, Number(settings.followUpDueInDays)))
    : FALLBACK_SETTINGS.followUpDueInDays;

  const qualificationScoreThreshold = Number.isFinite(
    settings.qualificationScoreThreshold,
  )
    ? Math.min(100, Math.max(0, Number(settings.qualificationScoreThreshold)))
    : FALLBACK_SETTINGS.qualificationScoreThreshold;

  const defaultOwner =
    typeof settings.defaultOwner === "string" && settings.defaultOwner.trim().length > 0
      ? settings.defaultOwner.trim()
      : null;

  return {
    agentSlug: settings.agentSlug?.trim() || FALLBACK_SETTINGS.agentSlug,
    isEnabled:
      typeof settings.isEnabled === "boolean" ? settings.isEnabled : FALLBACK_SETTINGS.isEnabled,
    autoCloseBelowThreshold:
      typeof settings.autoCloseBelowThreshold === "boolean"
        ? settings.autoCloseBelowThreshold
        : FALLBACK_SETTINGS.autoCloseBelowThreshold,
    qualificationScoreThreshold,
    followUpDueInDays,
    defaultOwner,
    updatedAt:
      settings.updatedAt instanceof Date
        ? settings.updatedAt
        : new Date(settings.updatedAt ?? Date.now()),
  };
}

function buildRuntimeConfig(settings: LeadFlowSettings): LeadFlowConfig {
  return {
    ...LEAD_FLOW_DEFAULT_CONFIG,
    minQualifiedScore: settings.qualificationScoreThreshold ?? LEAD_FLOW_DEFAULT_CONFIG.minQualifiedScore,
    scoring: { ...LEAD_FLOW_DEFAULT_CONFIG.scoring },
    qualification: {
      ...LEAD_FLOW_DEFAULT_CONFIG.qualification,
      tierThresholds: { ...LEAD_FLOW_DEFAULT_CONFIG.qualification.tierThresholds },
    },
    deal: { ...LEAD_FLOW_DEFAULT_CONFIG.deal, tierMultipliers: { ...LEAD_FLOW_DEFAULT_CONFIG.deal.tierMultipliers } },
    tasks: {
      followUp: { ...LEAD_FLOW_DEFAULT_CONFIG.tasks.followUp },
      qualificationNote: { ...LEAD_FLOW_DEFAULT_CONFIG.tasks.qualificationNote },
      disqualify: { ...LEAD_FLOW_DEFAULT_CONFIG.tasks.disqualify },
    },
    summary: { ...LEAD_FLOW_DEFAULT_CONFIG.summary },
  };
}

/**
 * شکل خلاصه‌ای که هم Demo و هم Run برای UI برمی‌گردونن.
 */
export interface LeadFlowSummary {
  inboundLeadsProcessed: number;
  qualifiedLeads: number;
  meetingsBooked: number;
  hoursSaved: number;
  actions: string[];
}

/**
 * خروجی Demo – فقط شبیه‌سازی، بدون تماس واقعی با CRM.
 */
export interface LeadFlowDemoResult {
  type: "demo";
  slug: typeof LEAD_FLOW_AUTOPILOT_SLUG;
  summary: LeadFlowSummary;
  runs: ProcessResult[];
}

/**
 * خروجی Run – روی دادهٔ واقعی + اتصال به CRM.
 */
export interface LeadFlowRunResult {
  type: "run";
  slug: typeof LEAD_FLOW_AUTOPILOT_SLUG;
  summary: LeadFlowSummary;
  runs: LeadFlowRunDetail[];
  idempotencyReplayed?: boolean;
  crmSync?: {
    provider: string;
    contactsSynced: number;
    tasksCreated: number;
    dealsCreated: number;
  };
}

export interface LeadFlowTaskResult extends Task {
  hubspotTaskId?: string;
}

export interface LeadFlowDealResult extends Deal {
  hubspotDealId?: string;
}

export interface LeadFlowRunDetail extends ProcessResult {
  contactId?: string;
  tasks: LeadFlowTaskResult[];
  deal: LeadFlowDealResult | null;
  errors?: string[];
}

/**
 * چند lead نمونه برای Demo / Live demo.
 * (می‌تونی بعداً این لیست رو از فایل دیگه هم جدا کنی)
 */
const DEMO_LEADS = [
  {
    email: "demo1@example.com",
    firstName: "Alex",
    lastName: "Rivera",
    company: "Acme Data",
    jobTitle: "Head of Sales",
    source: "webinar",
  },
  {
    email: "demo2@example.com",
    firstName: "Taylor",
    lastName: "Nguyen",
    company: "GrowthForge",
    jobTitle: "Revenue Operations Manager",
    source: "ebook",
  },
  {
    email: "demo3@example.com",
    firstName: "Jordan",
    lastName: "Lee",
    company: "Pipeline Labs",
    jobTitle: "VP Marketing",
    source: "website-chat",
  },
];

/**
 * Helper: از مجموعه run-ها یک summary می‌سازد.
 */
function buildSummary<T extends { qualification: QualificationResult }>(
  runs: T[],
  config: LeadFlowConfig,
  settings: LeadFlowSettings,
): LeadFlowSummary {
  const inboundLeadsProcessed = runs.length;
  const qualifiedLeads = runs.filter((r) => r.qualification.isQualified).length;

  // فعلاً خیلی ساده: هر lead با qualification مثبت، یک meeting
  const meetingsBooked = qualifiedLeads;

  // تخمین زمان ذخیره شده – می‌تونی بعداً فرمولش رو دقیق‌تر کنی
  const hoursPerLead = config.summary.hoursSavedPerQualifiedLead;
  const hoursSaved = Number((qualifiedLeads * hoursPerLead).toFixed(1));

  const actions: string[] = [];

  actions.push(
    `Processed ${inboundLeadsProcessed} inbound leads through the PantherIQ engine.`,
  );
  actions.push(
    `Qualified ${qualifiedLeads} leads for follow-up and routing automatically.`,
  );
  actions.push(
    `Booked ${meetingsBooked} meetings/opportunities for sales (based on qualification rules).`,
  );
  actions.push(
    `Saved approximately ${hoursSaved} hours of manual triage and task creation.`,
  );
  actions.push(
    `Qualification threshold is set to ${settings.qualificationScoreThreshold}, and follow-up tasks are due within ${settings.followUpDueInDays} day(s).`,
  );
  actions.push(
    settings.autoCloseBelowThreshold
      ? "Low-score leads are automatically routed to a close/loss task for operators."
      : "Low-score leads remain open for manual review; auto-close is disabled.",
  );

  return {
    inboundLeadsProcessed,
    qualifiedLeads,
    meetingsBooked,
    hoursSaved,
    actions,
  };
}

/**
 * 🔍 DEMO – همونی که تو "Try Live Demo" می‌بینی.
 * هیچ چیز واقعی تو HubSpot / CRM ساخته نمی‌شه.
 */
export async function demoLeadFlowAutopilot(
  settingsOverride?: LeadFlowSettings,
): Promise<LeadFlowDemoResult> {
  const settings = normalizeSettings(settingsOverride);
  const config = buildRuntimeConfig(settings);
  const runs: ProcessResult[] = [];

  for (const lead of DEMO_LEADS) {
    const result = await processIncomingLead(lead, config, settings);
    runs.push(result);
  }

  const summary = buildSummary(runs, config, settings);

  return {
    type: "demo",
    slug: LEAD_FLOW_AUTOPILOT_SLUG,
    summary,
    runs,
  };
}

/**
 * 🟢 RUN – ورودی واقعی (مثلاً از HubSpot یا فرم سایت)
 * و اتصال به CRM برای ساخت contact / task / deal.
 *
 * شکل input رو خیلی باز می‌ذاریم تا از webhook / API راحت بتونی صدا بزنی:
 * {
 *   leads: LeadLike[]
 * }
 */
export interface LeadFlowRunRequest {
  leads: RawLead[];
  simulate?: boolean;
  /**
   * Legacy preview fields retained for compatibility with the OpenAI-powered demo endpoint.
   * The runtime ignores them but we keep them typed to avoid breaking older callers.
   */
  companyName?: string;
  productDescription?: string;
  region?: string;
}

/**
 * @deprecated Use LeadFlowRunRequest instead.
 */
export type LeadFlowRunInput = LeadFlowRunRequest;

/**
 * تابع اصلی run که route `/api/automations/[slug]/run` ازش استفاده می‌کنه.
 */
export async function runLeadFlowAutopilot(
  payload: LeadFlowRunRequest,
  settingsOverride?: LeadFlowSettings,
): Promise<LeadFlowRunResult> {
  const settings = normalizeSettings(settingsOverride);
  if (!settings.isEnabled) {
    throw new Error("Lead Flow Autopilot is disabled for this automation.");
  }

  const config = buildRuntimeConfig(settings);
  const leads = normalizeRunLeads(payload);
  const simulate = Boolean(payload?.simulate);
  const hubspot = simulate ? null : createHubSpotClient();

  const runs: LeadFlowRunDetail[] = [];
  let contactsSynced = 0;
  let tasksCreated = 0;
  let dealsCreated = 0;

  for (const rawLead of leads) {
    const baseResult = await processIncomingLead(rawLead, config, settings);
    const detail = createRunDetail(baseResult);
    runs.push(detail);

    if (!simulate && hubspot) {
      const { counts, errors } = await syncLeadWithHubSpot(hubspot, detail, config);
      contactsSynced += counts.contacts;
      tasksCreated += counts.tasks;
      dealsCreated += counts.deals;
      if (errors.length) {
        detail.errors = errors;
      }
    }
  }

  const summary = buildSummary(runs, config, settings);

  return {
    type: "run",
    slug: LEAD_FLOW_AUTOPILOT_SLUG,
    summary,
    runs,
    crmSync: simulate
      ? undefined
      : {
          provider: "hubspot",
          contactsSynced,
          tasksCreated,
          dealsCreated,
        },
  };
}

type SyncCounts = {
  contacts: number;
  tasks: number;
  deals: number;
};

function normalizeRunLeads(input: LeadFlowRunRequest | null | undefined): RawLead[] {
  if (!input || !Array.isArray(input.leads)) {
    return [];
  }
  return input.leads.filter((lead): lead is RawLead => typeof lead === "object" && lead !== null);
}

function createRunDetail(result: ProcessResult): LeadFlowRunDetail {
  return {
    ...result,
    tasks: result.tasks.map((task) => ({ ...task })),
    deal: result.deal ? { ...result.deal } : null,
  };
}

async function syncLeadWithHubSpot(
  client: HubSpotClient,
  detail: LeadFlowRunDetail,
  config: LeadFlowConfig,
): Promise<{ counts: SyncCounts; errors: string[] }> {
  const counts: SyncCounts = { contacts: 0, tasks: 0, deals: 0 };
  const errors: string[] = [];

  let crmLead: CRMLead;
  try {
    crmLead = buildCrmLead(detail);
  } catch (error) {
    errors.push(formatLeadError("prepare lead", error));
    return { counts, errors };
  }

  let contactId: string;
  try {
    const contact = await client.upsertContact(crmLead);
    contactId = contact.id;
    detail.contactId = contactId;
    counts.contacts = 1;
  } catch (error) {
    errors.push(formatLeadError("contact upsert", error));
    return { counts, errors };
  }

  for (const task of detail.tasks) {
    try {
      const summary = buildTaskSummary(task, detail.enrichedLead);
      const taskResult = await client.createFollowUpTask({
        contactId,
        summary,
        dueInDays: task.dueInDays,
      });
      task.hubspotTaskId = taskResult.id;
      counts.tasks += 1;
    } catch (error) {
      errors.push(formatLeadError(`task: ${task.title}`, error));
    }
  }

  if (detail.deal) {
    try {
      const dealResult = await client.createOrUpdateDeal({
        contactId,
        amount: detail.deal.amount,
        pipelineStage: mapDealStage(detail.deal, config),
      });
      detail.deal.hubspotDealId = dealResult.id;
      counts.deals = 1;
    } catch (error) {
      errors.push(formatLeadError("deal creation", error));
    }
  }

  return { counts, errors };
}

function buildCrmLead(detail: LeadFlowRunDetail): CRMLead {
  const email =
    (typeof detail.enrichedLead.normalizedEmail === "string" && detail.enrichedLead.normalizedEmail) ||
    (typeof detail.enrichedLead.email === "string" && detail.enrichedLead.email) ||
    (typeof detail.rawLead.email === "string" && detail.rawLead.email) ||
    null;

  if (!email) {
    throw new Error("Lead must include an email address to sync with HubSpot.");
  }

  return {
    email,
    firstName: typeof detail.enrichedLead.firstName === "string" ? detail.enrichedLead.firstName : undefined,
    lastName: typeof detail.enrichedLead.lastName === "string" ? detail.enrichedLead.lastName : undefined,
    company: typeof detail.enrichedLead.company === "string" ? detail.enrichedLead.company : undefined,
    source: typeof detail.enrichedLead.source === "string" ? detail.enrichedLead.source : undefined,
    status: detail.qualification.isQualified ? "qualified" : "disqualified",
    notes: detail.qualification.reason,
  };
}

function buildTaskSummary(task: Task, lead: EnrichedLead): string {
  if (task.description) {
    return `${task.title} - ${task.description}`;
  }
  const target = lead.fullName ?? lead.email ?? "the lead";
  return `${task.title} - Follow up with ${target}`;
}

function mapDealStage(
  deal: LeadFlowDealResult,
  config: LeadFlowConfig,
): string | undefined {
  if (deal.stage) {
    return deal.stage;
  }
  return config.deal.defaultPipelineStage;
}

function formatLeadError(context: string, error: unknown): string {
  const base = error instanceof Error ? error.message : String(error);
  return `[${context}] ${base}`;
}
