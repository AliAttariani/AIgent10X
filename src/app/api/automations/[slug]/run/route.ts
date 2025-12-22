// src/app/api/automations/[slug]/run/route.ts

import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  runLeadFlowAutopilot,
  type LeadFlowRunRequest,
} from "@/lib/automations/lead-flow-autopilot";
import {
  getLeadFlowSettings,
  type LeadFlowSettings,
} from "@/lib/automations/leadFlowSettings";
import { resolveAgentPlan } from "@/lib/automations/plan";
import { getLeadFlowRunCountThisMonth, recordLeadFlowRun } from "@/lib/automations/runUsage";
import { FREE_PLAN_MONTHLY_LIMIT } from "@/lib/automations/runUsage.shared";
import {
  markIdempotencyFailed,
  markIdempotencySucceeded,
  tryStartIdempotentRun,
  type LeadFlowIdempotencyErrorPayload,
} from "@/lib/leadFlowIdempotency";
import type {
  LeadFlowRunError,
  LeadFlowRunErrorCode,
  LeadFlowRunFailure,
  LeadFlowRunInput as LeadFlowContractInput,
  LeadFlowRunSuccess,
} from "@/lib/leadflow/contracts";
import { getLeadFlowSettingsSnapshot } from "@/lib/leadflow/settingsSnapshots";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const SUPPORTED_RUN_AUTOMATIONS = new Set<string>(["lead-flow-autopilot"]);

const leadFlowSettingsSchema = z.object({
  agentSlug: z.string().optional(),
  isEnabled: z.boolean(),
  qualificationScoreThreshold: z.number(),
  autoCloseBelowThreshold: z.boolean(),
  followUpDueInDays: z.number(),
  defaultOwner: z.string().nullable().optional(),
  defaultOwnerEmail: z.string().nullable().optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

type ParsedRunBody = Partial<LeadFlowRunRequest> &
  Partial<LeadFlowContractInput> & {
    settings?: unknown;
  };

const INVALID_INPUT_ERROR: LeadFlowRunError = {
  code: "INVALID_INPUT",
  message: "Missing or invalid run parameters.",
  retryable: false,
};

const MISSING_IDEMPOTENCY_HEADER_ERROR: LeadFlowRunError = {
  code: "INVALID_INPUT",
  message: "Missing Idempotency-Key header.",
  retryable: false,
};

const AGENT_SLUG_MISMATCH_ERROR: LeadFlowRunError = {
  code: "INVALID_INPUT",
  message: "Automation route and agentId do not match.",
  retryable: false,
};

const INVALID_SNAPSHOT_ERROR: LeadFlowRunError = {
  code: "INVALID_INPUT",
  message: "Invalid settings snapshot.",
  retryable: false,
};

const IDEMPOTENCY_GUARD_ERROR: LeadFlowRunError = {
  code: "ENGINE_FAILURE",
  message: "Unable to establish idempotent run guard.",
  retryable: true,
};

const IDEMPOTENCY_RESPONSE_MISSING_ERROR: LeadFlowRunError = {
  code: "UNKNOWN",
  message: "Previous run succeeded but response payload is unavailable.",
  retryable: false,
};

export async function POST(req: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!SUPPORTED_RUN_AUTOMATIONS.has(slug)) {
    return respondWithFailure(
      {
        code: "INVALID_INPUT",
        message: `Automation "${slug}" does not expose a run endpoint.`,
        retryable: false,
      },
      400,
    );
  }

  const normalizedSlug = normalizeAgentId(slug);
  const rawBody = await readJsonBody(req);
  const parsedBody: ParsedRunBody = isPlainObject(rawBody) ? (rawBody as ParsedRunBody) : {};
  const runContractInput = validateRunContractInput(parsedBody);

  if (!runContractInput) {
    return respondWithFailure(INVALID_INPUT_ERROR, 400);
  }

  const agentId = normalizeAgentId(runContractInput.agentId);

  if (agentId !== normalizedSlug) {
    return respondWithFailure(AGENT_SLUG_MISMATCH_ERROR, 400);
  }

  const leads = Array.isArray(parsedBody.leads) ? parsedBody.leads : [];
  const simulate = Boolean(parsedBody.simulate);
  const providedSettings = coerceSettings(agentId, parsedBody.settings);
  const plan = resolveAgentPlan(agentId);

  if (!simulate && plan === "free") {
    const runsThisMonth = await getLeadFlowRunCountThisMonth(agentId);
    if (runsThisMonth >= FREE_PLAN_MONTHLY_LIMIT) {
      return respondWithFailure(
        {
          code: "RATE_LIMITED",
          message: `Free plan limit reached: ${runsThisMonth}/${FREE_PLAN_MONTHLY_LIMIT} runs used this month.`,
          retryable: false,
        },
        429,
      );
    }
  }

  let settings: LeadFlowSettings | null = null;

  if (simulate) {
    settings = providedSettings ?? (await getLeadFlowSettings(agentId));
  } else {
    settings = await getLeadFlowSettingsSnapshot(agentId, runContractInput.settingsSnapshotId);
    if (!settings) {
      return respondWithFailure(INVALID_SNAPSHOT_ERROR, 400);
    }
  }

  if (!settings) {
    return respondWithFailure(INVALID_SNAPSHOT_ERROR, 400);
  }

  const shouldEnforceIdempotency = !simulate;
  const headerKey = req.headers.get("Idempotency-Key");
  let idempotencyKey: string | null = null;
  let idempotencyRecordInserted = false;

  if (shouldEnforceIdempotency) {
    idempotencyKey = headerKey?.trim() ?? null;

    if (!idempotencyKey) {
      return respondWithFailure(MISSING_IDEMPOTENCY_HEADER_ERROR, 400);
    }

    const requestHash = buildRunRequestHash(agentId, leads, settings, runContractInput);
    const { record, inserted } = await tryStartIdempotentRun(agentId, idempotencyKey, requestHash);

    if (!record) {
      return respondWithFailure(IDEMPOTENCY_GUARD_ERROR, 500);
    }

    if (!inserted) {
      if (record.status === "succeeded") {
        const storedResponse = parseStoredPayload(record.responseJson);
        if (storedResponse && typeof storedResponse === "object") {
          const replayedResult = Array.isArray(storedResponse)
            ? storedResponse
            : {
                ...(storedResponse as Record<string, unknown>),
                idempotencyReplayed: true,
              };
          return respondWithSuccess(replayedResult, 200);
        }

        return respondWithFailure(IDEMPOTENCY_RESPONSE_MISSING_ERROR, 500);
      }

      if (record.status === "in_progress") {
        return respondWithFailure(
          {
            code: "IN_PROGRESS",
            message: "Run already in progress for this Idempotency-Key.",
            retryable: true,
          },
          202,
        );
      }

      return respondWithFailure(
        {
          code: "IDEMPOTENCY_REPLAY",
          message: "Previous attempt failed; use a new Idempotency-Key.",
          retryable: false,
        },
        409,
      );
    }

    idempotencyRecordInserted = true;
  }

  try {
    const result = await runLeadFlowAutopilot({ leads, simulate }, settings);
    if (!simulate) {
      await recordLeadFlowRun(agentId);
      if (idempotencyRecordInserted && idempotencyKey) {
        await safelyMarkIdempotencySucceeded(agentId, idempotencyKey, result);
      }
    }
    return respondWithSuccess(result, 200);
  } catch (error) {
    console.error("[automation-run] Unexpected error:", error);
    const mappedError = mapRunExecutionError(error);

    if (idempotencyRecordInserted && idempotencyKey) {
      await safelyMarkIdempotencyFailed(agentId, idempotencyKey, {
        message: mappedError.message,
        code: mappedError.code,
      });
    }

    const status = statusForErrorCode(mappedError.code);
    return respondWithFailure(mappedError, status);
  }
}

function coerceSettings(agentId: string, input: unknown): LeadFlowSettings | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const parsed = leadFlowSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }

  const data = parsed.data;
  const ownerCandidate = data.defaultOwner ?? data.defaultOwnerEmail ?? null;
  const owner = typeof ownerCandidate === "string" && ownerCandidate.trim().length > 0 ? ownerCandidate.trim() : null;

  return {
    agentSlug: data.agentSlug?.trim() || agentId,
    isEnabled: data.isEnabled,
    qualificationScoreThreshold: data.qualificationScoreThreshold,
    autoCloseBelowThreshold: data.autoCloseBelowThreshold,
    followUpDueInDays: data.followUpDueInDays,
    defaultOwner: owner,
    updatedAt:
      data.updatedAt instanceof Date
        ? data.updatedAt
        : new Date(data.updatedAt ?? Date.now()),
  } satisfies LeadFlowSettings;
}

function buildRunRequestHash(
  agentId: string,
  leads: LeadFlowRunRequest["leads"],
  settings: LeadFlowSettings | null,
  runInput: LeadFlowContractInput,
): string {
  const hash = createHash("sha256");
  hash.update(
    JSON.stringify({
      agentId,
      leads,
      runInput,
      settings: settings ? serializeSettingsSnapshot(settings) : null,
    }),
  );
  return hash.digest("hex");
}

function serializeSettingsSnapshot(settings: LeadFlowSettings) {
  return {
    agentSlug: settings.agentSlug,
    isEnabled: settings.isEnabled,
    qualificationScoreThreshold: settings.qualificationScoreThreshold,
    autoCloseBelowThreshold: settings.autoCloseBelowThreshold,
    followUpDueInDays: settings.followUpDueInDays,
    defaultOwner: settings.defaultOwner ?? null,
    updatedAt: settings.updatedAt?.toISOString?.() ?? null,
  };
}

function parseStoredPayload(value: string | null): unknown {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function safelyMarkIdempotencySucceeded(agentId: string, key: string, responsePayload: unknown) {
  try {
    await markIdempotencySucceeded(agentId, key, responsePayload);
  } catch (error) {
    console.error("[automation-run] Failed to mark idempotent run as succeeded", error);
  }
}

async function safelyMarkIdempotencyFailed(
  agentId: string,
  key: string,
  errorPayload: LeadFlowIdempotencyErrorPayload,
) {
  try {
    await markIdempotencyFailed(agentId, key, errorPayload);
  } catch (error) {
    console.error("[automation-run] Failed to mark idempotent run as failed", error);
  }
}

async function readJsonBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function validateRunContractInput(body: ParsedRunBody): LeadFlowContractInput | null {
  const agentId = typeof body.agentId === "string" ? body.agentId.trim() : "";
  const settingsSnapshotId =
    typeof body.settingsSnapshotId === "string" ? body.settingsSnapshotId.trim() : "";
  const source = body.source;

  if (!agentId || !settingsSnapshotId) {
    return null;
  }

  if (source !== "hubspot" && source !== "csv") {
    return null;
  }

  return {
    agentId,
    source,
    settingsSnapshotId,
  } satisfies LeadFlowContractInput;
}

function respondWithSuccess(data: unknown, status: number): NextResponse<LeadFlowRunSuccess> {
  return NextResponse.json<LeadFlowRunSuccess>(
    {
      ok: true,
      data,
    },
    { status },
  );
}

function respondWithFailure(error: LeadFlowRunError, status: number): NextResponse<LeadFlowRunFailure> {
  return NextResponse.json<LeadFlowRunFailure>(
    {
      ok: false,
      error,
    },
    { status },
  );
}

function mapRunExecutionError(error: unknown): LeadFlowRunError {
  if (error instanceof Error) {
    const normalizedMessage = error.message.toLowerCase();
    if (normalizedMessage.includes("hubspot private access token")) {
      return {
        code: "MISSING_INTEGRATION",
        message: "HubSpot integration is not connected. Connect it before running live flows.",
        retryable: false,
      } satisfies LeadFlowRunError;
    }

    if (normalizedMessage.includes("disabled")) {
      return {
        code: "INVALID_INPUT",
        message: error.message,
        retryable: false,
      } satisfies LeadFlowRunError;
    }

    return {
      code: "ENGINE_FAILURE",
      message: "Lead Flow engine encountered an unexpected error. Try again.",
      retryable: true,
    } satisfies LeadFlowRunError;
  }

  return {
    code: "UNKNOWN",
    message: "Lead Flow engine failed due to an unknown error.",
    retryable: false,
  } satisfies LeadFlowRunError;
}

function statusForErrorCode(code: LeadFlowRunErrorCode): number {
  switch (code) {
    case "RATE_LIMITED":
      return 429;
    case "IN_PROGRESS":
      return 202;
    case "IDEMPOTENCY_REPLAY":
      return 409;
    case "MISSING_INTEGRATION":
    case "INVALID_INPUT":
      return 400;
    case "ENGINE_FAILURE":
      return 502;
    default:
      return 500;
  }
}

function normalizeAgentId(value: string): string {
  return value.trim().toLowerCase();
}
