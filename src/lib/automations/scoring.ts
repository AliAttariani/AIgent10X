export interface LeadData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  source?: string;
  engagementScore?: number;
}

export function scoreLead(lead: LeadData): number {
  let score = 0;

  // Email quality
  if (lead.email.includes("@company.com")) score += 20;
  if (lead.email.includes("+")) score -= 5;

  // Name present
  if (lead.firstName) score += 10;

  // Source scoring
  if (lead.source === "website_form") score += 15;
  if (lead.source === "manual") score += 5;

  // Engagement
  if (lead.engagementScore) score += lead.engagementScore;

  return score;
}
