// src/lib/automations/tasks.ts
import type { EnrichedLead } from "./enrichment";
import type { QualificationResult } from "./qualification";

export interface Task {
  title: string;
  description?: string;
  dueInDays?: number;
  owner?: string;
}

/**
 * بر اساس lead و qualification، لیست task هایی که باید داخل CRM ساخته بشن رو می‌سازه.
 */
export function buildTasks(
  lead: EnrichedLead,
  qualification: QualificationResult,
): Task[] {
  const tasks: Task[] = [];

  if (qualification.isQualified) {
    tasks.push({
      title: "Follow up with qualified lead",
      description: `Reach out to ${lead.fullName ?? lead.email ?? "the lead"} – tier ${
        qualification.tier
      }, score ${qualification.score}.`,
      dueInDays: 1,
    });

    tasks.push({
      title: "Log qualification notes",
      description: qualification.reason,
      dueInDays: 2,
    });
  } else {
    tasks.push({
      title: "Auto-close or nurture unqualified lead",
      description: qualification.reason,
      dueInDays: 3,
    });
  }

  return tasks;
}
