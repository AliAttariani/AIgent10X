// src/lib/automations/qualification.ts
import type { EnrichedLead } from "./enrichment";
import type { LeadFlowConfig, LeadTier } from "./leadFlowConfig";
export type { LeadTier } from "./leadFlowConfig";

export interface QualificationResult {
  isQualified: boolean;
  reason: string;
  tier: LeadTier;
  score: number;
}

export function qualifyLead(lead: EnrichedLead, config: LeadFlowConfig): QualificationResult {
  const score = typeof lead.score === "number" ? lead.score : 0;

  let tier: LeadTier = "C";
  const { tierThresholds } = config.qualification;
  if (score >= tierThresholds.A) tier = "A";
  else if (score >= tierThresholds.B) tier = "B";

  const isQualified = score >= config.minQualifiedScore;
  const reason = isQualified
    ? `Lead meets ${tier}-tier threshold`
    : "Lead below qualification threshold";

  return {
    isQualified,
    reason,
    tier,
    score,
  };
}
