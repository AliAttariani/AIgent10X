"use client";

import type { LeadFlowRunManifest as LeadFlowRunManifestData } from "@/lib/leadflow/manifest";

type LeadFlowRunManifestProps = {
  manifest: LeadFlowRunManifestData;
};

export function LeadFlowRunManifestCard({ manifest }: LeadFlowRunManifestProps) {
  const started = formatTimestamp(manifest.timestamps.startedAtISO);
  const finished = manifest.timestamps.finishedAtISO
    ? formatTimestamp(manifest.timestamps.finishedAtISO)
    : null;

  return (
    <section className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Run details
          </p>
          <p className="text-sm font-semibold text-foreground">
            Snapshot {manifest.settingsSnapshotId}
          </p>
          <p className="text-xs text-muted-foreground">Source · {manifest.source}</p>
          {manifest.idempotencyKey ? (
            <p className="text-xs text-muted-foreground">Idempotency key · {manifest.idempotencyKey}</p>
          ) : null}
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>Started · {started}</p>
          {finished ? <p>Completed · {finished}</p> : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Inputs</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Threshold · {manifest.inputs.threshold}</li>
            <li>
              Auto-close below threshold · {manifest.inputs.autoCloseLowScoreLeads ? "Enabled" : "Disabled"}
            </li>
            {manifest.inputs.owner ? <li>Owner · {manifest.inputs.owner}</li> : null}
            {typeof manifest.inputs.followUpDays === "number" ? (
              <li>Follow-up within · {manifest.inputs.followUpDays} day(s)</li>
            ) : null}
          </ul>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Outputs</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Processed · {manifest.outputs.totalLeadsProcessed}</li>
            <li>Qualified · {manifest.outputs.qualifiedLeads}</li>
            {typeof manifest.outputs.meetingsBooked === "number" ? (
              <li>Meetings · {manifest.outputs.meetingsBooked}</li>
            ) : null}
            {typeof manifest.outputs.estimatedCostUnits === "number" ? (
              <li>Estimated cost · {formatNumber(manifest.outputs.estimatedCostUnits)} units</li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Safety guarantees
        </p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          <li>No leads deleted</li>
          <li>No CRM fields overwritten</li>
          <li>Deterministic given snapshot</li>
        </ul>
      </div>

      {manifest.idempotencyReplayed ? (
        <p className="mt-3 text-xs font-semibold text-emerald-700">
          Duplicate run prevented — previous result returned.
        </p>
      ) : null}

      {manifest.notes && manifest.notes.length ? (
        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          {manifest.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function formatTimestamp(value: string): string {
  try {
    return new Date(value).toLocaleString("en-US", {
      hour12: false,
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}
