import type { Lead } from "./types";

export const HUBSPOT_BASE_URL =
  process.env.HUBSPOT_BASE_URL ?? "https://api.hubapi.com";

const HUBSPOT_PRIVATE_ACCESS_TOKEN = process.env.HUBSPOT_PRIVATE_ACCESS_TOKEN;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

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

// فیلدهایی که اجازه داریم روی Contact آپدیت/ست کنیم
type HubSpotContactUpdateProperties = {
  email?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  lifecyclestage?: string;
};

// لیست lifecycle stageهای مجاز در HubSpot
const LIFECYCLE_STAGE_WHITELIST = new Set<string>([
  "subscriber",
  "lead",
  "marketingqualifiedlead",
  "salesqualifiedlead",
  "opportunity",
  "customer",
  "evangelist",
  "other",
]);

export interface HubSpotClient {
  upsertContact(
    lead: Lead,
    context?: HubSpotRunContext,
  ): Promise<{ id: string }>;
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

      const existingId = await findContactIdByEmail(
        token,
        lead.email,
        context,
      );

      if (existingId) {
        // ⬇️ نسخه‌ی جدید و امن برای آپدیت Contact
        await updateContactForLead(token, existingId, lead, context);
        return { id: existingId };
      }

      const createdId = await createContact(token, lead, context);
      return { id: createdId };
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

// ----------------- Helpers -----------------

function validateLead(lead: Lead): void {
  if (!lead.email) {
    throw new Error("Lead email is required for HubSpot contact operations.");
  }
}

/**
 * اگر مقدار status در Lead با lifecycle stageهای HubSpot سازگار باشد، برمی‌گرداند.
 * در غیر این صورت یا undefined برمی‌گرداند، یا بعضی aliasها را map می‌کند.
 */
function mapLeadStatusToLifecycleStage(
  status?: string | null,
): string | undefined {
  if (!status) return undefined;
  const normalized = status.toLowerCase().trim();

  if (LIFECYCLE_STAGE_WHITELIST.has(normalized)) {
    return normalized;
  }

  // چند تا map رایج
  if (normalized === "mql") return "marketingqualifiedlead";
  if (normalized === "sql" || normalized === "qualified") {
    return "salesqualifiedlead";
  }

  // اگر معلوم نیست، دست نمی‌زنیم که ۴۰۰ نخوریم
  return undefined;
}

async function findContactIdByEmail(
  token: string,
  email: string,
  _context?: HubSpotRunContext,
): Promise<string | null> {
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

  const response = await hubspotRequest<ContactSearchResponse>(
    token,
    "/crm/v3/objects/contacts/search",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    _context,
  );

  return response.results?.[0]?.id ?? null;
}

// ----------------- Contact -----------------

// برای ایجاد کانتکت جدید
function buildContactCreateProperties(
  lead: Lead,
): HubSpotContactUpdateProperties {
  const props: HubSpotContactUpdateProperties = {
    email: lead.email,
    firstname: lead.firstName,
    lastname: lead.lastName,
    company: lead.company,
  };

  // برای کانتکت جدید، اگر status سازگار بود از همان استفاده می‌کنیم، وگرنه "lead"
  const lifecycle =
    mapLeadStatusToLifecycleStage(lead.status ?? undefined) ?? "lead";

  props.lifecyclestage = lifecycle;
  return props;
}

// برای آپدیت کانتکت موجود — احتیاطی‌تر (فقط اگر lifecycle معتبر باشد)
function buildContactUpdateProperties(
  lead: Lead,
): HubSpotContactUpdateProperties {
  const props: HubSpotContactUpdateProperties = {};

  if (lead.email) props.email = lead.email;
  if (lead.firstName) props.firstname = lead.firstName;
  if (lead.lastName) props.lastname = lead.lastName;
  if (lead.company) props.company = lead.company;

  const lifecycle = mapLeadStatusToLifecycleStage(lead.status ?? undefined);
  if (lifecycle) {
    props.lifecyclestage = lifecycle;
  }

  return props;
}

async function createContact(
  token: string,
  lead: Lead,
  _context?: HubSpotRunContext,
): Promise<string> {
  const properties = buildContactCreateProperties(lead);

  const response = await hubspotRequest<HubSpotIdResponse>(
    token,
    "/crm/v3/objects/contacts",
    {
      method: "POST",
      body: JSON.stringify({ properties }),
    },
    _context,
  );

  return response.id;
}

/**
 * نسخه‌ی جدید و امن updateContact:
 * - فقط فیلدهای مشخص را می‌فرستد.
 * - lifecycle stage را فقط زمانی ست می‌کند که مقدار معتبر باشد.
 * - اگر هیچ فیلدی برای آپدیت نبود، درخواست ارسال نمی‌شود.
 */
async function updateContactForLead(
  token: string,
  contactId: string,
  lead: Lead,
  _context?: HubSpotRunContext,
): Promise<void> {
  const properties = buildContactUpdateProperties(lead);

  if (Object.keys(properties).length === 0) {
    // چیزی برای آپدیت نیست؛ بی‌صدا برگردیم
    return;
  }

  await hubspotRequest(
    token,
    `/crm/v3/objects/contacts/${encodeURIComponent(contactId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    },
    _context,
  );
}

// ----------------- Deal & Task -----------------

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

  const response = await hubspotRequest<HubSpotIdResponse>(
    token,
    "/crm/v3/objects/deals",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    context,
  );

  return response.id;
}

async function createTask(
  token: string,
  input: { contactId: string; summary: string; dueInDays?: number },
  context?: HubSpotRunContext,
): Promise<string> {
  const dueDate = computeDueDateTimestamp(input.dueInDays);

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

  const response = await hubspotRequest<HubSpotIdResponse>(
    token,
    "/crm/v3/objects/tasks",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    context,
  );

  return response.id;
}

function computeDueDateTimestamp(dueInDays?: number): string {
  const fallback = 2;
  const numeric = typeof dueInDays === "number" ? dueInDays : Number(dueInDays);
  const days = Number.isFinite(numeric) ? Math.max(1, Math.round(numeric)) : fallback;

  const now = new Date();
  const startOfTodayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const targetTimestamp = startOfTodayUtc + days * MS_PER_DAY;
  return new Date(targetTimestamp).toISOString();
}

// ----------------- Core request helper -----------------

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
    const bodySnippet = await response
      .text()
      .then((text) => text.slice(0, 256))
      .catch(() => "");
    const baseMessage = `HubSpot request failed (${response.status})`;
    const contextMessage = bodySnippet
      ? `${baseMessage}: ${bodySnippet}`
      : baseMessage;
    throw new Error(contextMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}
