// src/lib/automations/deals.ts
import type { EnrichedLead } from "./enrichment";
import type { QualificationResult } from "./qualification";

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
): Deal | null {
  if (!qualification.isQualified) {
    return null;
  }

  const baseAmount = 5000;
  const multiplier =
    qualification.tier === "A" ? 2 : qualification.tier === "B" ? 1 : 0.5;
  const amount = baseAmount * multiplier;

  const name =
    lead.company && lead.fullName
      ? `${lead.company} – ${lead.fullName}`
      : lead.company ?? lead.fullName ?? lead.email ?? "New opportunity";

  return {
    name,
    amount,
    stage: "qualification",
    pipeline: "default",
  };
}
