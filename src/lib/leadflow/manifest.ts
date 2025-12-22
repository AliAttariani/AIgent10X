export type LeadFlowRunManifest = {
  runKind: "live";
  agentId: string;
  source: "hubspot" | "csv";
  settingsSnapshotId: string;
  idempotencyKey?: string;
  idempotencyReplayed?: boolean;
  timestamps: {
    startedAtISO: string;
    finishedAtISO?: string;
  };
  guarantees: {
    noLeadsDeleted: true;
    noCrmFieldsOverwritten: true;
    canDisableAnytime: true;
    deterministicGivenSnapshot: true;
  };
  inputs: {
    threshold: number;
    autoCloseLowScoreLeads: boolean;
    owner?: string;
    followUpDays?: number;
  };
  outputs: {
    totalLeadsProcessed: number;
    qualifiedLeads: number;
    meetingsBooked?: number;
    estimatedCostUnits?: number;
  };
  notes?: string[];
};
