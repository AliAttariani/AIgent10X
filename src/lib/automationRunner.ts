import { getManagedAutomationBySlug } from "@/data/automations";
import type { AutomationRunInput, Lead } from "@/agents/types";
import { runLeadFlowAutopilot as runLeadFlowAutopilotAgent } from "@/agents/lead-flow-autopilot";

export type AutomationRunMode = "demo" | "live";

export interface AutomationRunOptions {
  slug: string;
  tenantId?: string | null;
  mode: AutomationRunMode;
  input?: unknown;
}

export interface AutomationRunResult {
  automationSlug: string;
  mode: AutomationRunMode;
  summary: string;
  metrics: {
    inboundLeadsProcessed: number;
    qualifiedLeads: number;
    meetingsBooked: number;
    hoursSaved: number;
  };
  actionsExecuted: string[];
  raw?: unknown;
}

export async function runAutomation(options: AutomationRunOptions): Promise<AutomationRunResult> {
  const { slug } = options;

  const automation = getManagedAutomationBySlug(slug);

  if (!automation) {
    throw new Error(`Automation not found for slug "${slug}"`);
  }

  const executor = getAutomationExecutor(slug);
  if (!executor) {
    throw new Error(`Automation "${slug}" does not expose a supported run/demo function.`);
  }

  return executor(options);
}

type AutomationExecutor = (options: AutomationRunOptions) => Promise<AutomationRunResult>;

function getAutomationExecutor(slug: string): AutomationExecutor | undefined {
  switch (slug) {
    case "lead-flow-autopilot":
      return runLeadFlowAutopilot;
    default:
      return undefined;
  }
}

async function runLeadFlowAutopilot(options: AutomationRunOptions): Promise<AutomationRunResult> {
  const input = normalizeLeadFlowInput(options);
  const agentResult = await runLeadFlowAutopilotAgent(input);

  const actions = agentResult.actions?.length
    ? agentResult.actions
    : agentResult.logs.map((log) => log.message);

  return {
    automationSlug: agentResult.slug,
    mode: options.mode,
    summary: agentResult.summary,
    metrics: agentResult.metrics,
    actionsExecuted: actions,
    raw: agentResult,
  } satisfies AutomationRunResult;
}

function normalizeLeadFlowInput(options: AutomationRunOptions): AutomationRunInput {
  const payload = isRecord(options.input) ? options.input : {};
  const rawContextCandidate = payload["context"];
  const rawContext = isRecord(rawContextCandidate) ? rawContextCandidate : undefined;

  const leads = parseLeads(payload["leads"]);
  const simulate = resolveSimulateFlag(payload["simulate"], options.mode);

  const context: Record<string, unknown> = {};
  if (rawContext) {
    Object.assign(context, rawContext);
  }
  if (options.tenantId) {
    context.tenantId = options.tenantId;
  }

  return {
    slug: options.slug,
    simulate,
    leads,
    context: Object.keys(context).length ? context : undefined,
  } satisfies AutomationRunInput;
}

function resolveSimulateFlag(value: unknown, mode: AutomationRunMode): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return mode === "demo";
}

function parseLeads(value: unknown): Lead[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const leads: Lead[] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const { id, name, email, source } = item;
    if (typeof id !== "string" || typeof name !== "string" || typeof email !== "string" || typeof source !== "string") {
      continue;
    }

    const lead: Lead = {
      id,
      name,
      email,
      source,
    };

    if (typeof item.company === "string") {
      lead.company = item.company;
    }

    if (Number.isFinite(item.score)) {
      lead.score = Number(item.score);
    }

    if (typeof item.notes === "string") {
      lead.notes = item.notes;
    }

    leads.push(lead);
  }

  return leads.length ? leads : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
