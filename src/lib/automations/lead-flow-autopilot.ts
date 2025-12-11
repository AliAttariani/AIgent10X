import { processIncomingLead, ProcessResult } from "./processIncomingLead";
import type { RawLead, EnrichedLead } from "./enrichment";
import type { QualificationResult } from "./qualification";
import type { Task } from "./tasks";
import type { Deal } from "./deals";
import { createHubSpotClient, type HubSpotClient } from "../crm/hubspot";
import type { Lead as CRMLead } from "../crm/types";

export const LEAD_FLOW_AUTOPILOT_SLUG = "lead-flow-autopilot";

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
function buildSummary<T extends { qualification: QualificationResult }>(runs: T[]): LeadFlowSummary {
  const inboundLeadsProcessed = runs.length;
  const qualifiedLeads = runs.filter((r) => r.qualification.isQualified).length;

  // فعلاً خیلی ساده: هر lead با qualification مثبت، یک meeting
  const meetingsBooked = qualifiedLeads;

  // تخمین زمان ذخیره شده – می‌تونی بعداً فرمولش رو دقیق‌تر کنی
  const hoursSaved = Number((qualifiedLeads * 0.15).toFixed(1)); // 0.15h = 9 دقیقه

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
export async function demoLeadFlowAutopilot(): Promise<LeadFlowDemoResult> {
  const runs: ProcessResult[] = [];

  for (const lead of DEMO_LEADS) {
    // این همون engine مرکزیه
    const result = await processIncomingLead(lead);
    runs.push(result);
  }

  const summary = buildSummary(runs);

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
): Promise<LeadFlowRunResult> {
  const leads = normalizeRunLeads(payload);
  const hubspot = createHubSpotClient();

  const runs: LeadFlowRunDetail[] = [];
  let contactsSynced = 0;
  let tasksCreated = 0;
  let dealsCreated = 0;

  for (const rawLead of leads) {
    const baseResult = await processIncomingLead(rawLead);
    const detail = createRunDetail(baseResult);
    runs.push(detail);

    const { counts, errors } = await syncLeadWithHubSpot(hubspot, detail);
    contactsSynced += counts.contacts;
    tasksCreated += counts.tasks;
    dealsCreated += counts.deals;
    if (errors.length) {
      detail.errors = errors;
    }
  }

  const summary = buildSummary(runs);

  return {
    type: "run",
    slug: LEAD_FLOW_AUTOPILOT_SLUG,
    summary,
    runs,
    crmSync: {
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
        pipelineStage: mapDealStage(detail.deal, detail.qualification),
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
    return `${task.title} — ${task.description}`;
  }
  const target = lead.fullName ?? lead.email ?? "the lead";
  return `${task.title} — Follow up with ${target}`;
}

function mapDealStage(
  deal: LeadFlowDealResult,
  qualification: QualificationResult,
): string | undefined {
  if (deal.stage) {
    return deal.stage;
  }
  return qualification.isQualified ? "appointmentscheduled" : "closedlost";
}

function formatLeadError(context: string, error: unknown): string {
  const base = error instanceof Error ? error.message : String(error);
  return `[${context}] ${base}`;
}
