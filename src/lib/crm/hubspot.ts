import type { Lead } from "./types";

export const HUBSPOT_BASE_URL = process.env.HUBSPOT_BASE_URL ?? "https://api.hubapi.com";
const HUBSPOT_PRIVATE_ACCESS_TOKEN = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN;

export type HubSpotRunContext = Record<string, unknown>;

type HubSpotIdResponse = { id: string };

type ContactSearchResponse = {
  results?: Array<{
    id: string;
    properties?: {
      email?: string;
    };
  }>;
};

export interface HubSpotClient {
  upsertContact(lead: Lead, context?: HubSpotRunContext): Promise<{ id: string }>;
  createOrUpdateDeal(input: {
    contactId: string;
    amount?: number;
    pipelineStage?: string;
    context?: HubSpotRunContext;
  }): Promise<{ id: string }>;
  createFollowUpTask(input: {
    contactId: string;
    summary: string;
    dueInDays?: number;
    context?: HubSpotRunContext;
  }): Promise<{ id: string }>;
}

export function createHubSpotClient(): HubSpotClient {
  if (!HUBSPOT_PRIVATE_ACCESS_TOKEN) {
    throw new Error("HubSpot private access token is not configured.");
  }

  const token = HUBSPOT_PRIVATE_ACCESS_TOKEN;

  return {
    async upsertContact(lead, context) {
      validateLead(lead);
      const existingId = await findContactIdByEmail(token, lead.email, context);
      if (existingId) {
        await updateContact(token, existingId, lead, context);
        return { id: existingId };
      }
      const created = await createContact(token, lead, context);
      return { id: created };
    },

    async createOrUpdateDeal(input) {
      const dealId = await createDeal(token, input, input.context);
      return { id: dealId };
    },

    async createFollowUpTask(input) {
      const taskId = await createTask(token, input, input.context);
      return { id: taskId };
    },
  } satisfies HubSpotClient;
}

function validateLead(lead: Lead): void {
  if (!lead.email) {
    throw new Error("Lead email is required for HubSpot contact operations.");
  }
}

async function findContactIdByEmail(token: string, email: string, _context?: HubSpotRunContext): Promise<string | null> {
  const payload = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email",
            operator: "EQ",
            value: email,
          },
        ],
      },
    ],
    properties: ["email"],
  } satisfies Record<string, unknown>;

  const response = await hubspotRequest<ContactSearchResponse>(token, "/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify(payload),
  }, _context);

  return response.results?.[0]?.id ?? null;
}

async function createContact(token: string, lead: Lead, _context?: HubSpotRunContext): Promise<string> {
  const response = await hubspotRequest<HubSpotIdResponse>(token, "/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({
      properties: buildContactProperties(lead),
    }),
  }, _context);

  return response.id;
}

async function updateContact(token: string, contactId: string, lead: Lead, _context?: HubSpotRunContext): Promise<void> {
  await hubspotRequest(token, `/crm/v3/objects/contacts/${contactId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties: buildContactProperties(lead) }),
  }, _context);
}

async function createDeal(
  token: string,
  input: { contactId: string; amount?: number; pipelineStage?: string },
  context?: HubSpotRunContext,
): Promise<string> {
  const payload = {
    properties: {
      amount: input.amount,
      dealstage: input.pipelineStage ?? "appointmentscheduled",
      pipeline: "default",
      closedate: new Date().toISOString(),
    },
    associations: [
      {
        to: { id: input.contactId },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 3,
          },
        ],
      },
    ],
  } satisfies Record<string, unknown>;

  const response = await hubspotRequest<HubSpotIdResponse>(token, "/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify(payload),
  }, context);

  return response.id;
}

async function createTask(
  token: string,
  input: { contactId: string; summary: string; dueInDays?: number },
  context?: HubSpotRunContext,
): Promise<string> {
  const dueDate = new Date(Date.now() + (input.dueInDays ?? 2) * 24 * 60 * 60 * 1000).toISOString();
  const payload = {
    properties: {
      hs_task_subject: input.summary,
      hs_task_body: input.summary,
      hs_task_status: "NOT_STARTED",
      hs_task_priority: "MEDIUM",
      hs_timestamp: dueDate,
    },
    associations: [
      {
        to: { id: input.contactId },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 204,
          },
        ],
      },
    ],
  } satisfies Record<string, unknown>;

  const response = await hubspotRequest<HubSpotIdResponse>(token, "/crm/v3/objects/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  }, context);

  return response.id;
}

function buildContactProperties(lead: Lead): Record<string, string | undefined> {
  return {
    email: lead.email,
    firstname: lead.firstName,
    lastname: lead.lastName,
    company: lead.company,
    lifecyclestage: lead.status ?? "lead",
  };
}

async function hubspotRequest<T>(
  token: string,
  path: string,
  init: RequestInit,
  _context?: HubSpotRunContext,
): Promise<T> {
  void _context;
  const url = new URL(path, HUBSPOT_BASE_URL);
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...init.headers,
  };

  const response = await fetch(url, { ...init, headers });

  if (!response.ok) {
    const bodySnippet = await response.text().then((text) => text.slice(0, 256)).catch(() => "");
    const baseMessage = `HubSpot request failed (${response.status})`;
    const contextMessage = bodySnippet ? `${baseMessage}: ${bodySnippet}` : baseMessage;
    throw new Error(contextMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}
