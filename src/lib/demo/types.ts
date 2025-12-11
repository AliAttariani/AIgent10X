export type AutomationDemoResult = {
  ok: boolean;
  title: string;
  summary: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  debug?: Record<string, unknown>;
  actions?: string[];
  crmSummary?: {
    leadsSynced: number;
    meetingsCreated: number;
    timelineEvents: number;
  };
};
