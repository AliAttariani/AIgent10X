"use client";

export type LeadFlowAuditEvent = {
  id: string;
  label: string;
  detail?: string;
};

type LeadFlowAuditLogProps = {
  events: LeadFlowAuditEvent[];
};

export function LeadFlowAuditLog({ events }: LeadFlowAuditLogProps) {
  if (!events.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Audit log</p>
      <ol className="mt-3 space-y-3 text-sm text-foreground">
        {events.map((event) => (
          <li key={event.id} className="flex gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
            <div>
              <p className="font-medium">{event.label}</p>
              {event.detail ? (
                <p className="text-xs text-muted-foreground">{event.detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
