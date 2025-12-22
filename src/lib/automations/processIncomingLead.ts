// src/lib/automations/processIncomingLead.ts
import { enrichLead, type RawLead, type EnrichedLead } from "./enrichment";
import { qualifyLead, type QualificationResult } from "./qualification";
import { buildTasks, type Task } from "./tasks";
import { buildDeal, type Deal } from "./deals";
import type { LeadFlowConfig } from "./leadFlowConfig";
import type { LeadFlowSettings } from "./leadFlowSettings";

export interface ProcessResult {
  rawLead: RawLead;
  enrichedLead: EnrichedLead;
  qualification: QualificationResult;
  tasks: Task[];
  deal: Deal | null;
}

/**
 * Engine مرکزی: یک lead خام می‌گیرد و تمام مراحل enrichment/qualification/tasks/deal
 * را اجرا می‌کند و یک نتیجهٔ ساختاریافته می‌دهد.
 */
export async function processIncomingLead(
  rawLead: RawLead,
  config: LeadFlowConfig,
  settings: LeadFlowSettings,
): Promise<ProcessResult> {
  const enrichedLead = enrichLead(rawLead, config);
  const qualification = qualifyLead(enrichedLead, config);
  const tasks = buildTasks(enrichedLead, qualification, config, settings);
  const deal = buildDeal(enrichedLead, qualification, config);

  return {
    rawLead,
    enrichedLead,
    qualification,
    tasks,
    deal,
  };
}
