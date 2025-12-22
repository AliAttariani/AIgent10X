// src/lib/automations/enrichment.ts

import { scoreLead } from "./scoring";
import type { LeadFlowConfig } from "./leadFlowConfig";

export interface RawLead { 
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  // اجازه بده بقیه فیلدها هم باشن، بدون any
  [key: string]: unknown;
}

export interface EnrichedLead extends RawLead {
  fullName?: string;
  normalizedEmail?: string;
  score: number;
}

/**
 * Enrichment خیلی ساده برای الان.
 * هر وقت خواستی می‌تونی اینجا firmographic / intent و غیره اضافه کنی.
 */
export function enrichLead(input: RawLead, config: LeadFlowConfig): EnrichedLead {
  const fullName =
    [input.firstName, input.lastName].filter(Boolean).join(" ") || undefined;

  const email = typeof input.email === "string" ? input.email.trim() : undefined;
  const normalizedEmail = email?.toLowerCase();

  // فعلاً یک scoring ساده

  const score = scoreLead(
    {
      email: normalizedEmail ?? email ?? "",
      firstName: input.firstName,
      lastName: input.lastName,
      company: input.company,
      jobTitle: input.jobTitle,
      source: input.source,
    },
    config,
  );

  return {
    ...input,
    fullName,
    normalizedEmail,
    score,
  };
}
