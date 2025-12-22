// src/lib/automations/tasks.ts
import type { EnrichedLead } from "./enrichment";
import type { QualificationResult } from "./qualification";
import type { LeadFlowConfig, TaskTemplateConfig } from "./leadFlowConfig";
import type { LeadFlowSettings } from "./leadFlowSettings";

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
  config: LeadFlowConfig,
  settings: LeadFlowSettings,
): Task[] {
  const tasks: Task[] = [];
  const owner = settings.defaultOwner ?? undefined;
  const resolvedDueInDays = resolveDueInDays(settings, config);

  const enqueueTask = (task: Task) => {
    task.dueInDays = resolvedDueInDays;
    if (owner) {
      task.owner = owner;
    }
    tasks.push(task);
  };

  if (qualification.isQualified) {
    const followUpTask = createTaskFromTemplate(
      config.tasks.followUp,
      lead,
      qualification,
    );
    enqueueTask(followUpTask);

    const qualificationNoteTask = createTaskFromTemplate(
      config.tasks.qualificationNote,
      lead,
      qualification,
    );
    enqueueTask(qualificationNoteTask);
  } else if (settings.autoCloseBelowThreshold) {
    const disqualifyTask = createTaskFromTemplate(
      config.tasks.disqualify,
      lead,
      qualification,
    );
    enqueueTask(disqualifyTask);
  }

  return tasks;
}

function resolveDueInDays(settings: LeadFlowSettings, config: LeadFlowConfig): number {
  const fromSettings = Number(settings.followUpDueInDays);
  if (Number.isFinite(fromSettings) && fromSettings > 0) {
    return fromSettings;
  }

  return config.tasks.followUp.defaultDueInDays;
}

function createTaskFromTemplate(
  template: TaskTemplateConfig,
  lead: EnrichedLead,
  qualification: QualificationResult,
): Task {
  return {
    title: renderTemplate(template.subjectTemplate, lead, qualification),
    description: renderTemplate(template.bodyTemplate, lead, qualification),
    dueInDays: template.defaultDueInDays,
  };
}

function renderTemplate(
  template: string,
  lead: EnrichedLead,
  qualification: QualificationResult,
): string {
  const leadName = lead.fullName ?? lead.email ?? "the lead";
  return template
    .replace(/{{leadName}}/g, leadName)
    .replace(/{{tier}}/g, qualification.tier)
    .replace(/{{score}}/g, String(qualification.score))
    .replace(/{{reason}}/g, qualification.reason);
}
