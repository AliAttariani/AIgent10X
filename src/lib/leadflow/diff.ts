export type LeadFlowSettingsSnapshot = {
  qualificationScoreThreshold: number;
  autoCloseLowScoreLeads: boolean;
  defaultOwner?: string | null;
  followUpDueInDays?: number | null;
  isEnabled?: boolean;
};

export type LeadFlowSettingsDiffLine = {
  key: "threshold" | "autoClose" | "owner" | "followUpDays" | "enabled";
  label: string;
  from: string;
  to: string;
};

const OWNER_FALLBACK = "none";
const FOLLOW_UP_FALLBACK = "not set";

const formatThreshold = (value: number): string => `${value}`;
const formatAutoClose = (value: boolean): string => (value ? "On" : "Off");
const formatOwner = (value?: string | null): string => {
  if (!value) {
    return OWNER_FALLBACK;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : OWNER_FALLBACK;
};
const formatFollowUp = (value?: number | null): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return FOLLOW_UP_FALLBACK;
  }
  return `${value}`;
};
const formatEnabled = (value: boolean): string => (value ? "Enabled" : "Disabled");

export function diffLeadFlowSettings(
  prev: LeadFlowSettingsSnapshot,
  next: LeadFlowSettingsSnapshot,
): LeadFlowSettingsDiffLine[] {
  const lines: LeadFlowSettingsDiffLine[] = [];

  if (prev.qualificationScoreThreshold !== next.qualificationScoreThreshold) {
    lines.push({
      key: "threshold",
      label: "Qualification threshold",
      from: formatThreshold(prev.qualificationScoreThreshold),
      to: formatThreshold(next.qualificationScoreThreshold),
    });
  }

  if (prev.autoCloseLowScoreLeads !== next.autoCloseLowScoreLeads) {
    lines.push({
      key: "autoClose",
      label: "Auto-close low score leads",
      from: formatAutoClose(prev.autoCloseLowScoreLeads),
      to: formatAutoClose(next.autoCloseLowScoreLeads),
    });
  }

  if (formatOwner(prev.defaultOwner) !== formatOwner(next.defaultOwner)) {
    lines.push({
      key: "owner",
      label: "Default owner",
      from: formatOwner(prev.defaultOwner),
      to: formatOwner(next.defaultOwner),
    });
  }

  if (formatFollowUp(prev.followUpDueInDays) !== formatFollowUp(next.followUpDueInDays)) {
    lines.push({
      key: "followUpDays",
      label: "Follow-up days",
      from: formatFollowUp(prev.followUpDueInDays),
      to: formatFollowUp(next.followUpDueInDays),
    });
  }

  if (typeof prev.isEnabled === "boolean" && typeof next.isEnabled === "boolean") {
    if (prev.isEnabled !== next.isEnabled) {
      lines.push({
        key: "enabled",
        label: "Automation status",
        from: formatEnabled(prev.isEnabled),
        to: formatEnabled(next.isEnabled),
      });
    }
  }

  return lines;
}
