export type LeadFlowPlan = "free" | "pro";

const DEFAULT_PLAN: LeadFlowPlan = "free";

export function resolveAgentPlan(agentSlug: string): LeadFlowPlan {
  const normalizedSlug = agentSlug.trim().toLowerCase();
  const proAgents = parseListEnv(process.env.PANTHERIQ_PRO_AGENTS);
  if (proAgents.includes(normalizedSlug)) {
    return "pro";
  }

  const envPlan = (process.env.PANTHERIQ_PLAN ?? DEFAULT_PLAN).trim().toLowerCase();
  if (envPlan === "pro") {
    return "pro";
  }

  return DEFAULT_PLAN;
}

function parseListEnv(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 0);
}
