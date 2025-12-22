import type { LeadFlowPlan } from "./plan";

export const FREE_PLAN_MONTHLY_LIMIT = 3;

export type LeadFlowUsageSummary = {
  plan: LeadFlowPlan;
  usedThisMonth: number;
  monthlyLimit: number | null;
};
