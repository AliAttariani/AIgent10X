"use server";

import type { LeadFlowSettings, LeadFlowSettingsDTO } from "@/lib/automations/leadFlowSettings";
import { createLeadFlowSettingsSnapshot } from "@/lib/leadflow/settingsSnapshots";

type CreateSnapshotInput = {
  agentId: string;
  settings: LeadFlowSettingsDTO;
};

export async function createLeadFlowSettingsSnapshotAction(
  input: CreateSnapshotInput,
): Promise<{ snapshotId: string }> {
  const normalizedAgentId = normalizeAgentId(input.agentId);
  const normalizedSettings = toServerSettings(normalizedAgentId, input.settings);

  const { id } = await createLeadFlowSettingsSnapshot({
    agentId: normalizedAgentId,
    settings: normalizedSettings,
  });

  return { snapshotId: id };
}

function toServerSettings(agentId: string, dto: LeadFlowSettingsDTO): LeadFlowSettings {
  return {
    agentSlug: agentId,
    isEnabled: Boolean(dto.isEnabled),
    qualificationScoreThreshold: toFiniteNumber(dto.qualificationScoreThreshold, 70),
    autoCloseBelowThreshold: Boolean(dto.autoCloseBelowThreshold ?? true),
    defaultOwner: dto.defaultOwner ?? null,
    followUpDueInDays: toFiniteNumber(dto.followUpDueInDays, 2),
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(),
  } satisfies LeadFlowSettings;
}

function normalizeAgentId(value: string): string {
  return value.trim().toLowerCase();
}

function toFiniteNumber(value: unknown, fallback: number): number {
  const candidate = Number(value);
  return Number.isFinite(candidate) ? candidate : fallback;
}
