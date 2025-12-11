// src/lib/automations/enrichment.ts

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
export function enrichLead(input: RawLead): EnrichedLead {
  const fullName =
    [input.firstName, input.lastName].filter(Boolean).join(" ") || undefined;

  const email = typeof input.email === "string" ? input.email.trim() : undefined;
  const normalizedEmail = email?.toLowerCase();

  // فعلاً یک scoring ساده
  let score = 0;
  if (normalizedEmail) score += 30;
  if (input.company) score += 20;
  if (input.jobTitle) score += 20;
  if (input.source === "webinar" || input.source === "website-chat") {
    score += 20;
  }

  return {
    ...input,
    fullName,
    normalizedEmail,
    score,
  };
}
