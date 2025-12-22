import "server-only";

import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  leadFlowRunIdempotencyTable,
  type LeadFlowRunIdempotencyRow,
} from "@/lib/db/schema";

export type LeadFlowIdempotencyRecord = LeadFlowRunIdempotencyRow;
export type LeadFlowIdempotencyStatus = LeadFlowIdempotencyRecord["status"];

export type LeadFlowIdempotencyErrorPayload = {
  message: string;
  code?: string;
};

export async function getIdempotencyRecord(agentId: string, key: string): Promise<LeadFlowIdempotencyRecord | null> {
  const db = getDb();
  const [record] = await db
    .select()
    .from(leadFlowRunIdempotencyTable)
    .where(and(eq(leadFlowRunIdempotencyTable.agentId, agentId), eq(leadFlowRunIdempotencyTable.idempotencyKey, key)))
    .limit(1);

  return record ?? null;
}

export async function tryStartIdempotentRun(
  agentId: string,
  key: string,
  requestHash?: string,
): Promise<{ record: LeadFlowIdempotencyRecord | null; inserted: boolean }> {
  const db = getDb();
  const now = new Date();

  try {
    await db.insert(leadFlowRunIdempotencyTable).values({
      agentId,
      idempotencyKey: key,
      status: "in_progress",
      requestHash: requestHash ?? null,
      createdAt: now,
      updatedAt: now,
    });

    const record = await getIdempotencyRecord(agentId, key);
    return { record, inserted: true };
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      const existing = await getIdempotencyRecord(agentId, key);
      return { record: existing, inserted: false };
    }

    throw error;
  }
}

export async function markIdempotencySucceeded(agentId: string, key: string, responsePayload: unknown): Promise<void> {
  const db = getDb();
  await db
    .update(leadFlowRunIdempotencyTable)
    .set({
      status: "succeeded",
      responseJson: serializePayload(responsePayload),
      errorJson: null,
      updatedAt: new Date(),
    })
    .where(and(eq(leadFlowRunIdempotencyTable.agentId, agentId), eq(leadFlowRunIdempotencyTable.idempotencyKey, key)));
}

export async function markIdempotencyFailed(
  agentId: string,
  key: string,
  errorPayload: LeadFlowIdempotencyErrorPayload,
): Promise<void> {
  const db = getDb();
  await db
    .update(leadFlowRunIdempotencyTable)
    .set({
      status: "failed",
      errorJson: serializePayload(errorPayload),
      updatedAt: new Date(),
    })
    .where(and(eq(leadFlowRunIdempotencyTable.agentId, agentId), eq(leadFlowRunIdempotencyTable.idempotencyKey, key)));
}

function isDuplicateEntryError(error: unknown): error is { code?: string } {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string" &&
      (error as { code: string }).code === "ER_DUP_ENTRY",
  );
}

function serializePayload(payload: unknown): string | null {
  try {
    return JSON.stringify(payload);
  } catch (error) {
    console.error("[leadFlowIdempotency] Failed to serialize payload", error);
    return null;
  }
}
