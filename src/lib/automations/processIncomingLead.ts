// src/lib/automations/processIncomingLead.ts
import { enrichLead, type RawLead, type EnrichedLead } from "./enrichment";
import { qualifyLead, type QualificationResult } from "./qualification";
import { buildTasks, type Task } from "./tasks";
import { buildDeal, type Deal } from "./deals";

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
): Promise<ProcessResult> {
  const enrichedLead = enrichLead(rawLead);
  const qualification = qualifyLead(enrichedLead);
  const tasks = buildTasks(enrichedLead, qualification);
  const deal = buildDeal(enrichedLead, qualification);

  return {
    rawLead,
    enrichedLead,
    qualification,
    tasks,
    deal,
  };
}
