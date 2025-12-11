/** Represents a single inbound lead entering an automation. */
export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  company?: string;
  score?: number;
  notes?: string;
}

/** Generic payload for invoking a managed automation run. */
export interface AutomationRunInput {
  slug: string;
  simulate?: boolean;
  leads?: Lead[];
  context?: Record<string, unknown>;
}

/** KPI metrics surfaced after an automation run completes. */
export interface AutomationRunMetrics {
  inboundLeadsProcessed: number;
  qualifiedLeads: number;
  meetingsBooked: number;
  hoursSaved: number;
}

/** Human-readable log entry emitted during an automation run. */
export interface AutomationRunLogEntry {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  details?: Record<string, unknown>;
}

/** Canonical result schema returned by a managed automation run. */
export interface AutomationRunResult {
  slug: string;
  title: string;
  summary: string;
  metrics: AutomationRunMetrics;
  logs: AutomationRunLogEntry[];
  crmSummary?: {
    leadsSynced: number;
    meetingsCreated: number;
    timelineEvents: number;
  };
  actions?: string[];
}
