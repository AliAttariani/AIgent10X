import type { Lead } from "./types";
import { createHubSpotClient, type HubSpotClient } from "./hubspot";

export type CRMRunContext = Record<string, unknown>;

export interface CRMProvider {
  upsertLeadContact(lead: Lead, context?: CRMRunContext): Promise<{ contactId: string }>;
  createOrUpdateOpportunity(input: {
    lead: Lead;
    contactId: string;
    amount?: number;
    pipelineStage?: string;
    context?: CRMRunContext;
  }): Promise<{ dealId: string }>;
  createFollowUpForLead(input: {
    lead: Lead;
    contactId: string;
    summary: string;
    context?: CRMRunContext;
  }): Promise<void>;
}

class HubSpotCRMProvider implements CRMProvider {
  constructor(private readonly client: HubSpotClient) {}

  async upsertLeadContact(lead: Lead, context?: CRMRunContext): Promise<{ contactId: string }> {
    const result = await this.client.upsertContact(lead, context);
    return { contactId: result.id };
  }

  async createOrUpdateOpportunity(input: {
    lead: Lead;
    contactId: string;
    amount?: number;
    pipelineStage?: string;
    context?: CRMRunContext;
  }): Promise<{ dealId: string }> {
    const result = await this.client.createOrUpdateDeal({
      contactId: input.contactId,
      amount: input.amount,
      pipelineStage: input.pipelineStage ?? inferPipelineStage(input.lead),
      context: input.context,
    });

    return { dealId: result.id };
  }

  async createFollowUpForLead(input: {
    lead: Lead;
    contactId: string;
    summary: string;
    context?: CRMRunContext;
  }): Promise<void> {
    await this.client.createFollowUpTask({
      contactId: input.contactId,
      summary: buildFollowUpSummary(input.lead, input.summary),
      context: input.context,
    });
  }
}

class MockCRMProvider implements CRMProvider {
  private idCounter = 0;

  async upsertLeadContact(lead: Lead): Promise<{ contactId: string }> {
    return { contactId: lead.id ?? `mock-contact-${++this.idCounter}` };
  }

  async createOrUpdateOpportunity(input: {
    lead: Lead;
    contactId: string;
    amount?: number;
    pipelineStage?: string;
    context?: CRMRunContext;
  }): Promise<{ dealId: string }> {
    const leadHint = input.lead.email.split("@")[0] ?? "lead";
    const stage = input.pipelineStage ?? inferPipelineStage(input.lead);
    return { dealId: `mock-deal-${stage}-${leadHint}-${++this.idCounter}` };
  }

  async createFollowUpForLead({ lead, contactId, summary, context }: {
    lead: Lead;
    contactId: string;
    summary: string;
    context?: CRMRunContext;
  }): Promise<void> {
    void lead;
    void contactId;
    void summary;
    void context;
    // Intentionally left blank for tests and demos.
  }
}

function createHubSpotProvider(): CRMProvider {
  const client = createHubSpotClient();
  return new HubSpotCRMProvider(client);
}

function createMockProvider(): CRMProvider {
  return new MockCRMProvider();
}

function inferPipelineStage(lead: Lead): string {
  if (lead.status === "qualified") {
    return "presentationscheduled";
  }
  if (lead.status === "disqualified") {
    return "closedlost";
  }
  return "appointmentscheduled";
}

function buildFollowUpSummary(lead: Lead, summary: string): string {
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ") || lead.email;
  return `${summary} — Lead: ${name}`;
}

let cachedProvider: CRMProvider | null = null;

export function getCRMProvider(): CRMProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const mode = process.env.CRM_PROVIDER_MODE ?? "hubspot";
  if (mode === "mock") {
    cachedProvider = createMockProvider();
    return cachedProvider;
  }

  try {
    cachedProvider = createHubSpotProvider();
    return cachedProvider;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[CRM] Falling back to mock provider", error);
    }
    cachedProvider = createMockProvider();
    return cachedProvider;
  }
}
