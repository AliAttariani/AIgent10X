import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leadFlowSettingsTable, type LeadFlowSettingsRow } from "@/lib/db/schema";
import { LEAD_FLOW_AUTOPILOT_SLUG } from "./lead-flow-autopilot";

export type LeadFlowSettings = {
  agentSlug: string;
  isEnabled: boolean;
  qualificationScoreThreshold: number;
  autoCloseBelowThreshold: boolean;
  defaultOwner?: string | null;
  followUpDueInDays: number;
  updatedAt: Date;
};

export type LeadFlowSettingsDTO = Omit<LeadFlowSettings, "updatedAt"> & { updatedAt: string };

const DEFAULT_SETTINGS: Omit<LeadFlowSettings, "agentSlug" | "updatedAt"> = {
  isEnabled: true,
  qualificationScoreThreshold: 70,
  autoCloseBelowThreshold: true,
  defaultOwner: null,
  followUpDueInDays: 2,
};

function buildDefaultSettings(agentSlug: string): LeadFlowSettings {
  return {
    agentSlug,
    ...DEFAULT_SETTINGS,
    updatedAt: new Date(),
  };
}

export async function getLeadFlowSettings(agentSlug: string): Promise<LeadFlowSettings> {
  const key = normalizeAgentSlug(agentSlug);
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(leadFlowSettingsTable)
      .where(eq(leadFlowSettingsTable.agentId, key))
      .limit(1);

    if (!rows.length) {
      return buildDefaultSettings(key);
    }

    return mapRowToSettings(rows[0]);
  } catch (error) {
    console.error("[leadFlowSettings] Falling back to defaults:", error);
    return buildDefaultSettings(key);
  }
}

export async function saveLeadFlowSettings(
  agentSlug: string,
  input: Partial<LeadFlowSettings>,
): Promise<LeadFlowSettings> {
  const key = normalizeAgentSlug(agentSlug);
  const current = await getLeadFlowSettings(key);

  const next: LeadFlowSettings = {
    ...current,
    ...input,
    agentSlug: key,
    updatedAt: new Date(),
  };

  const db = getDb();
  await db
    .insert(leadFlowSettingsTable)
    .values({
      agentId: key,
      enabled: next.isEnabled,
      qualificationScoreThreshold: next.qualificationScoreThreshold,
      autoCloseLowScoreLeads: next.autoCloseBelowThreshold,
      followUpDueInDays: next.followUpDueInDays,
      defaultOwnerEmail: next.defaultOwner ?? null,
      updatedAt: next.updatedAt,
    })
    .onDuplicateKeyUpdate({
      set: {
        enabled: next.isEnabled,
        qualificationScoreThreshold: next.qualificationScoreThreshold,
        autoCloseLowScoreLeads: next.autoCloseBelowThreshold,
        followUpDueInDays: next.followUpDueInDays,
        defaultOwnerEmail: next.defaultOwner ?? null,
        updatedAt: next.updatedAt,
      },
    });

  return next;
}

export function serializeLeadFlowSettings(settings: LeadFlowSettings): LeadFlowSettingsDTO {
  return {
    ...settings,
    updatedAt: settings.updatedAt.toISOString(),
  };
}

function normalizeAgentSlug(slug: string): string {
  return slug?.trim() || LEAD_FLOW_AUTOPILOT_SLUG;
}

function mapRowToSettings(row: LeadFlowSettingsRow): LeadFlowSettings {
  return {
    agentSlug: row.agentId,
    isEnabled: row.enabled,
    qualificationScoreThreshold: row.qualificationScoreThreshold,
    autoCloseBelowThreshold: row.autoCloseLowScoreLeads,
    defaultOwner: row.defaultOwnerEmail,
    followUpDueInDays: row.followUpDueInDays,
    updatedAt: row.updatedAt ?? new Date(),
  };
}
