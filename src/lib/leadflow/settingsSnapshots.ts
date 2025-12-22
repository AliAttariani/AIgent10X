import "server-only";

import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import type { LeadFlowSettings } from "@/lib/automations/leadFlowSettings";
import { getDb } from "@/lib/db";
import { leadFlowSettingsSnapshotsTable } from "@/lib/db/schema";

type MysqlErrorLike = Error & {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
};

type SerializableLeadFlowSettings = Omit<LeadFlowSettings, "updatedAt"> & {
  updatedAt: string;
};

export async function createLeadFlowSettingsSnapshot(input: {
  agentId: string;
  settings: LeadFlowSettings;
}): Promise<{ id: string }> {
  const normalizedAgentId = normalizeAgentId(input.agentId);
  const normalizedSettings: LeadFlowSettings = {
    ...input.settings,
    agentSlug: normalizedAgentId,
    defaultOwner: input.settings.defaultOwner ?? null,
    updatedAt:
      input.settings.updatedAt instanceof Date
        ? input.settings.updatedAt
        : new Date(input.settings.updatedAt ?? Date.now()),
  };

  const serialized = serializeSettings(normalizedSettings);
  const snapshotId = randomUUID();

  try {
    const db = getDb();
    await db.insert(leadFlowSettingsSnapshotsTable).values({
      id: snapshotId,
      agentId: normalizedAgentId,
      settingsJson: JSON.stringify(serialized),
      createdAt: new Date(),
    });
  } catch (error) {
    const mysqlMeta =
      error && typeof error === "object"
        ? {
            message: (error as MysqlErrorLike).message,
            code: (error as MysqlErrorLike).code,
            errno: (error as MysqlErrorLike).errno,
            sqlState: (error as MysqlErrorLike).sqlState,
            sqlMessage: (error as MysqlErrorLike).sqlMessage,
          }
        : { message: String(error) };

    console.error("[leadflow][settingsSnapshots] Failed to create snapshot", mysqlMeta);
    throw error;
  }

  return { id: snapshotId };
}

export async function getLeadFlowSettingsSnapshot(
  agentId: string,
  snapshotId: string,
): Promise<LeadFlowSettings | null> {
  const normalizedAgentId = normalizeAgentId(agentId);
  const normalizedSnapshotId = snapshotId?.trim();

  if (!normalizedSnapshotId) {
    return null;
  }

  const db = getDb();
  const [row] = await db
    .select({ settingsJson: leadFlowSettingsSnapshotsTable.settingsJson })
    .from(leadFlowSettingsSnapshotsTable)
    .where(
      and(
        eq(leadFlowSettingsSnapshotsTable.id, normalizedSnapshotId),
        eq(leadFlowSettingsSnapshotsTable.agentId, normalizedAgentId),
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  return deserializeSettings(row.settingsJson, normalizedAgentId);
}

function serializeSettings(settings: LeadFlowSettings): SerializableLeadFlowSettings {
  return {
    agentSlug: settings.agentSlug,
    isEnabled: settings.isEnabled,
    qualificationScoreThreshold: settings.qualificationScoreThreshold,
    autoCloseBelowThreshold: settings.autoCloseBelowThreshold,
    defaultOwner: settings.defaultOwner ?? null,
    followUpDueInDays: settings.followUpDueInDays,
    updatedAt: settings.updatedAt.toISOString(),
  } satisfies SerializableLeadFlowSettings;
}

function deserializeSettings(value: string | null, agentId: string): LeadFlowSettings | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<SerializableLeadFlowSettings>;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const updatedAtIso = typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString();

    return {
      agentSlug: agentId,
      isEnabled: Boolean(parsed.isEnabled),
      qualificationScoreThreshold: toFiniteNumber(parsed.qualificationScoreThreshold, 70),
      autoCloseBelowThreshold: Boolean(parsed.autoCloseBelowThreshold ?? true),
      defaultOwner: parsed.defaultOwner ?? null,
      followUpDueInDays: toFiniteNumber(parsed.followUpDueInDays, 2),
      updatedAt: new Date(updatedAtIso),
    } satisfies LeadFlowSettings;
  } catch (error) {
    console.error("[leadflow][settingsSnapshots] Failed to parse snapshot", error);
    return null;
  }
}

function normalizeAgentId(agentId: string): string {
  return agentId.trim().toLowerCase();
}

function toFiniteNumber(value: unknown, fallback: number): number {
  const candidate = Number(value);
  return Number.isFinite(candidate) ? candidate : fallback;
}
