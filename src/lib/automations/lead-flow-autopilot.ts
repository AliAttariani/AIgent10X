import { processIncomingLead, ProcessResult } from "./processIncomingLead";
import { getCRMProvider } from "../crm";

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
  runs: ProcessResult[];
  crmSync?: {
    provider: string;
    contactsSynced: number;
    tasksCreated: number;
    dealsCreated: number;
  };
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
function buildSummary(runs: ProcessResult[]): LeadFlowSummary {
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
export interface LeadFlowRunInput {
  leads: unknown[];
}

/**
 * تابع اصلی run که route `/api/automations/[slug]/run` ازش استفاده می‌کنه.
 */
export async function runLeadFlowAutopilot(
  payload: LeadFlowRunInput,
): Promise<LeadFlowRunResult> {
  const leads = Array.isArray(payload?.leads) ? payload.leads : [];

  const runs: ProcessResult[] = [];
  const crm = getCRMProvider(); // مثل HubSpot، اما abstraction-ش تو ../crm هست

  let contactsSynced = 0;
  let tasksCreated = 0;
  let dealsCreated = 0;

  for (const rawLead of leads) {
    // 1) همهٔ منطق داخل engine
    const run = await processIncomingLead(rawLead);
    runs.push(run);

    // 2) اتصال به CRM – اگر provider تعریف شده بود
    if (crm) {
      try {
        // این قسمت رو با شکل دقیق متدهای CRM خودت تطبیق بده.
        // ما از type-guard ساده استفاده می‌کنیم تا TS / ESLint اذیت نشن.
        const contactPayload = run.enrichedLead;

        if ("upsertContact" in crm && typeof crm.upsertContact === "function") {
          const contactResult = await crm.upsertContact(contactPayload);
          if (contactResult) {
            contactsSynced += 1;
          }
        }

        if (run.tasks.length > 0) {
          if ("createTasks" in crm && typeof crm.createTasks === "function") {
            await crm.createTasks(run.tasks);
            tasksCreated += run.tasks.length;
          }
        }

        if (run.deal) {
          if ("createDeal" in crm && typeof crm.createDeal === "function") {
            await crm.createDeal(run.deal);
            dealsCreated += 1;
          }
        }
      } catch (error) {
        // اینجا فقط swallow می‌کنیم تا یک lead خراب کل run رو ندازه
        // تو مرحلهٔ بعد می‌تونیم logging متمرکز اضافه کنیم.
        console.error("[LeadFlowAutopilot] CRM sync failed for lead:", error);
      }
    }
  }

  const summary = buildSummary(runs);

  const result: LeadFlowRunResult = {
    type: "run",
    slug: LEAD_FLOW_AUTOPILOT_SLUG,
    summary,
    runs,
  };

  if (crm) {
    const providerName = (crm as { name?: string }).name ?? "crm";
    result.crmSync = {
      provider: providerName,
      contactsSynced,
      tasksCreated,
      dealsCreated,
    };
  }

  return result;
}
