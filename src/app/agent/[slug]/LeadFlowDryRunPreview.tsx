"use client";

import { Button } from "@/components/ui/button";
import type { DryRunPreview } from "./AgentDetailClient";

type LeadFlowDryRunPreviewProps = {
  preview: DryRunPreview;
  onCancel: () => void;
  onConfirm: () => void;
  onAcknowledgeChange: (next: boolean) => void;
  acknowledged: boolean;
  isRunning?: boolean;
};

const formatNumber = (value: number) => value.toLocaleString("en-US");

export function LeadFlowDryRunPreview({
  preview,
  onCancel,
  onConfirm,
  onAcknowledgeChange,
  acknowledged,
  isRunning,
}: LeadFlowDryRunPreviewProps) {
  const willHappenItems = [
    `We’ll process ${formatNumber(preview.totalLeads)} leads.`,
    `Qualification threshold: ${preview.threshold} points.`,
    `${formatNumber(preview.expectedQualified)} lead${preview.expectedQualified === 1 ? "" : "s"} are expected to qualify.`,
    preview.autoCloseLowScoreLeads
      ? "Low-score leads will be auto-closed."
      : "Low-score leads will remain open for manual review.",
    preview.owner ? `Qualified leads will be assigned to ${preview.owner}.` : null,
    typeof preview.followUpDays === "number"
      ? `Follow-up tasks will be due in ${preview.followUpDays} days.`
      : null,
  ].filter(Boolean) as string[];

  const planDescription =
    preview.plan === "free"
      ? `Free plan: ${preview.used}/${preview.limit ?? 0} real runs used this month. ${preview.remaining ?? 0} remaining.`
      : "Pro plan: unlimited real runs.";

  const isConfirmDisabled = Boolean(isRunning || !acknowledged);

  return (
    <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Dry run</p>
        <h3 className="text-lg font-semibold text-foreground">Preview before running on real data</h3>
        <p className="text-sm text-muted-foreground">
          Understand the scope of this run before touching production data. Opening this preview never
          consumes quota or calls your CRM.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What will happen
          </p>
          <ul className="space-y-2 text-sm text-foreground">
            {willHappenItems.map((item) => (
              <li key={item} className="rounded-2xl border border-border/60 bg-background/60 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Safety checks
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="rounded-2xl border border-border/40 bg-muted/40 px-3 py-2">No leads will be deleted.</li>
            <li className="rounded-2xl border border-border/40 bg-muted/40 px-3 py-2">
              No CRM fields will be overwritten.
            </li>
            <li className="rounded-2xl border border-border/40 bg-muted/40 px-3 py-2">
              You can disable this automation anytime.
            </li>
          </ul>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-foreground">
            <p>{planDescription}</p>
            {preview.plan === "free" ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Real runs consume quota. Dry runs remain unlimited.
              </p>
            ) : null}
          </div>
          <label className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/80 px-4 py-3 text-sm text-foreground">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              checked={acknowledged}
              onChange={(event) => onAcknowledgeChange(event.target.checked)}
            />
            <span>I understand this will run on my real data.</span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isRunning}>
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} disabled={isConfirmDisabled}>
          {isRunning ? "Running…" : "Confirm & Run"}
        </Button>
      </div>
    </section>
  );
}
