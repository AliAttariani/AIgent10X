export type LeadFlowRunInput = {
  agentId: string;
  source: "hubspot" | "csv";
  settingsSnapshotId: string;
};

export type LeadFlowRunErrorCode =
  | "INVALID_INPUT"
  | "MISSING_INTEGRATION"
  | "RATE_LIMITED"
  | "IN_PROGRESS"
  | "IDEMPOTENCY_REPLAY"
  | "ENGINE_FAILURE"
  | "UNKNOWN";

export type LeadFlowRunError = {
  code: LeadFlowRunErrorCode;
  message: string;
  retryable: boolean;
};

export type LeadFlowRunSuccess = {
  ok: true;
  data: unknown;
};

export type LeadFlowRunFailure = {
  ok: false;
  error: LeadFlowRunError;
};
