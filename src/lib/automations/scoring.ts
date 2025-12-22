import type { LeadFlowConfig } from "./leadFlowConfig";

export interface LeadData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  source?: string;
  jobTitle?: string;
}

export function scoreLead(lead: LeadData, config: LeadFlowConfig): number {
  const { scoring } = config;
  let score = 0;

  if (lead.email) {
    score += scoring.emailPresentBonus;
  }

  if (lead.company) {
    score += scoring.companyPresenceBonus;
  }

  if (lead.jobTitle) {
    score += scoring.jobTitlePresenceBonus;
  }

  if (lead.source && scoring.highIntentSources.includes(lead.source)) {
    score += scoring.highIntentSourceBonus;
  }

  return score;
}
