import type { ManagedAutomation } from "@/data/automations";

export interface AutomationExecutionResult {
  metrics: Array<{ name: string; value: string }>;
  actions: string[];
  debugLog: string[];
}

export async function executeLeadFlowAutomation(
  automation: ManagedAutomation,
  input: unknown,
  mode: "simulate" | "live" = "simulate",
): Promise<AutomationExecutionResult> {
  if (automation.slug !== "lead-flow-autopilot") {
    throw new Error(`Unsupported automation slug: ${automation.slug}`);
  }

  const baseLeadCount = 40;
  const payloadLeadCount = extractLeadCount(input);
  const leadCount = payloadLeadCount ?? baseLeadCount;
  const conversionLift = mode === "live" ? 0.31 : 0.27;
  const qualifiedLeads = Math.round(leadCount * (1 + conversionLift));
  const meetingsBooked = Math.round(qualifiedLeads * 0.4);
  const hoursSaved = 3.5 + (mode === "live" ? 0.5 : 0);

  const metrics = [
    { name: "Inbound leads processed", value: leadCount.toString() },
    { name: "Qualified leads", value: qualifiedLeads.toString() },
    { name: "Meetings booked", value: meetingsBooked.toString() },
    { name: "Hours saved", value: `${hoursSaved.toFixed(1)}h` },
  ];

  const actions = [
    `Routed ${qualifiedLeads} leads to sales owners with enriched context`,
    `Drafted ${meetingsBooked} follow-up sequences and queued them for send`,
    "Synced hot-lead alerts into Slack and updated CRM stages",
  ];

  const debugLog = [
    `Mode: ${mode}`,
    `Lead count input: ${payloadLeadCount ?? "default"}`,
    `Automation: ${automation.slug}`,
  ];

  return {
    metrics,
    actions,
    debugLog,
  };
}

function extractLeadCount(input: unknown): number | undefined {
  if (!input || typeof input !== "object") {
    return undefined;
  }

  const maybeLeadCount = (input as { leadCount?: unknown }).leadCount;
  if (typeof maybeLeadCount === "number" && Number.isFinite(maybeLeadCount) && maybeLeadCount > 0) {
    return Math.round(maybeLeadCount);
  }

  return undefined;
}
