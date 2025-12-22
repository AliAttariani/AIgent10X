import "server-only";

import { and, count, eq, gte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leadFlowRunUsageTable } from "@/lib/db/schema";
import { resolveAgentPlan } from "./plan";
import {
  FREE_PLAN_MONTHLY_LIMIT,
  type LeadFlowUsageSummary,
} from "./runUsage.shared";

export async function recordLeadFlowRun(agentSlug: string): Promise<void> {
  try {
    const db = getDb();
    await db.insert(leadFlowRunUsageTable).values({
      agentId: normalizeAgentSlug(agentSlug),
      runAt: new Date(),
    });
  } catch (error) {
    console.error("[runUsage] Failed to record run:", error);
  }
}

export async function getLeadFlowRunCountThisMonth(agentSlug: string): Promise<number> {
  try {
    const db = getDb();
    const startOfMonth = getStartOfCurrentMonthUtc();
    const [result] = await db
      .select({ value: count() })
      .from(leadFlowRunUsageTable)
      .where(
        and(
          eq(leadFlowRunUsageTable.agentId, normalizeAgentSlug(agentSlug)),
          gte(leadFlowRunUsageTable.runAt, startOfMonth),
        ),
      );

    return result?.value ?? 0;
  } catch (error) {
    console.error("[runUsage] Failed to count runs:", error);
    return 0;
  }
}

export async function getLeadFlowUsageSummary(agentSlug: string): Promise<LeadFlowUsageSummary> {
  const plan = resolveAgentPlan(agentSlug);
  const monthlyLimit = plan === "free" ? FREE_PLAN_MONTHLY_LIMIT : null;
  const usedThisMonth = await getLeadFlowRunCountThisMonth(agentSlug);

  return {
    plan,
    usedThisMonth,
    monthlyLimit,
  } satisfies LeadFlowUsageSummary;
}

function getStartOfCurrentMonthUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function normalizeAgentSlug(slug: string): string {
  return slug.trim().toLowerCase();
}
