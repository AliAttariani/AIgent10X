// src/lib/automations/deals.ts
import type { EnrichedLead } from "./enrichment";
import type { QualificationResult } from "./qualification";
import type { LeadFlowConfig } from "./leadFlowConfig";

export interface Deal {
  name: string;
  amount?: number;
  stage?: string;
  pipeline?: string;
}

/**
 * اگر lead به اندازه کافی خوب باشد، یک deal پیشنهادی برمی‌گرداند، وگرنه null.
 */
export function buildDeal(
  lead: EnrichedLead,
  qualification: QualificationResult,
  config: LeadFlowConfig,
): Deal | null {
  if (!config.deal.createWhenTierIn.includes(qualification.tier)) {
    return null;
  }

  const baseAmount = config.deal.baseAmount;
  const tierMultiplier = config.deal.tierMultipliers[qualification.tier] ?? 1;
  const amount = baseAmount * tierMultiplier;

  const name =
    lead.company && lead.fullName
      ? `${lead.company} - ${lead.fullName}`
      : lead.company ?? lead.fullName ?? lead.email ?? "New opportunity";

  return {
    name,
    amount,
    stage: config.deal.defaultPipelineStage,
    pipeline: config.deal.pipeline,
  };
}
