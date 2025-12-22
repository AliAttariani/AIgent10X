"use server";

import { z } from "zod";
import {
  getLeadFlowSettings,
  saveLeadFlowSettings,
  serializeLeadFlowSettings,
  type LeadFlowSettingsDTO,
} from "@/lib/automations/leadFlowSettings";

const leadFlowSettingsInputSchema = z.object({
  agentSlug: z.string().min(1, "Agent slug is required."),
  isEnabled: z.boolean(),
  qualificationScoreThreshold: z
    .number()
    .min(0, "Score must be at least 0.")
    .max(100, "Score cannot exceed 100."),
  autoCloseBelowThreshold: z.boolean(),
  defaultOwner: z
    .string()
    .nullish()
    .transform((value) => (value && value.trim().length > 0 ? value.trim() : null)),
  followUpDueInDays: z
    .number()
    .min(1, "Follow-up must be at least 1 day out.")
    .max(30, "Follow-up cannot be more than 30 days out."),
});

export type LeadFlowSettingsFormInput = z.infer<typeof leadFlowSettingsInputSchema>;

export async function saveLeadFlowSettingsAction(
  input: LeadFlowSettingsFormInput,
): Promise<LeadFlowSettingsDTO> {
  const parsed = leadFlowSettingsInputSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new Error(first?.message ?? "Please review the highlighted fields.");
  }

  try {
    const updated = await saveLeadFlowSettings(parsed.data.agentSlug, {
      isEnabled: parsed.data.isEnabled,
      qualificationScoreThreshold: parsed.data.qualificationScoreThreshold,
      autoCloseBelowThreshold: parsed.data.autoCloseBelowThreshold,
      defaultOwner: parsed.data.defaultOwner ?? null,
      followUpDueInDays: parsed.data.followUpDueInDays,
    });

    return serializeLeadFlowSettings(updated);
  } catch {
    throw new Error("Unable to save settings right now. Please try again.");
  }
}

const agentSlugSchema = z.string().min(1, "Agent slug is required.");

export async function fetchLeadFlowSettingsAction(agentSlug: string): Promise<LeadFlowSettingsDTO> {
  const parsedSlug = agentSlugSchema.safeParse(agentSlug);
  if (!parsedSlug.success) {
    throw new Error(parsedSlug.error.issues[0]?.message ?? "Invalid agent identifier.");
  }

  try {
    const settings = await getLeadFlowSettings(parsedSlug.data);
    return serializeLeadFlowSettings(settings);
  } catch {
    throw new Error("Unable to load settings. Please try again.");
  }
}
