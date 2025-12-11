// src/lib/automations/qualification.ts
import type { EnrichedLead } from "./enrichment";

export type LeadTier = "A" | "B" | "C";

export interface QualificationResult {
  isQualified: boolean;
  reason: string;
  tier: LeadTier;
  score: number;
}

export function qualifyLead(lead: EnrichedLead): QualificationResult {
  const score = typeof lead.score === "number" ? lead.score : 0;

  let tier: LeadTier = "C";
  if (score >= 80) tier = "A";
  else if (score >= 60) tier = "B";

  const isQualified = tier === "A" || tier === "B";
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
