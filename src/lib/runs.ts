import { randomUUID } from "crypto";

export type AutomationRunStatus = "pending" | "running" | "succeeded" | "failed";

export interface AutomationRun {
  id: string;
  automationSlug: string;
  input: unknown;
  status: AutomationRunStatus;
  result?: unknown;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const runs = new Map<string, AutomationRun>();

export function createRun(automationSlug: string, input: unknown): AutomationRun {
  const now = new Date();
  const run: AutomationRun = {
    id: randomUUID(),
    automationSlug,
    input,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  runs.set(run.id, run);
  return run;
}

export function updateRun(id: string, patch: Partial<AutomationRun>): AutomationRun | undefined {
  const existing = runs.get(id);
  if (!existing) {
    return undefined;
  }

  const updated: AutomationRun = {
    ...existing,
    ...patch,
    createdAt: existing.createdAt,
    updatedAt: new Date(),
  };

  runs.set(id, updated);
  return updated;
}

export function getRun(id: string): AutomationRun | undefined {
  return runs.get(id);
}
