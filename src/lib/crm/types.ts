export type Lead = {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  source?: string;
  status?: "new" | "qualified" | "disqualified";
  notes?: string;
};

export type CRMActionLog = {
  type: "ingest" | "qualify" | "meeting-booked" | "note" | "error";
  timestamp: string;
  summary: string;
  meta?: CRMActionMetadata;
};

type CRMActionMetadataPrimitive = string | number | boolean | null;

export type CRMActionMetadataValue =
  | CRMActionMetadataPrimitive
  | CRMActionMetadataPrimitive[]
  | Record<string, CRMActionMetadataPrimitive>;

export type CRMActionMetadata = Record<string, CRMActionMetadataValue>;

export interface CRMProvider {
  ensureContact(lead: Lead): Promise<{ contactId: string; created: boolean }>;
  logNote(contactId: string, note: string): Promise<void>;
  createTaskForOwner?(args: {
    contactId: string;
    title: string;
    body?: string;
    dueDate?: string;
  }): Promise<void>;
  recordMeeting?(args: {
    contactId: string;
    startTime: string;
    subject: string;
    description?: string;
  }): Promise<void>;
  logAutomationAction(action: CRMActionLog): Promise<void>;
}
