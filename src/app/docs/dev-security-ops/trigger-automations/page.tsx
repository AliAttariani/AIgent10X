export default function TriggerAutomationsPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dev / Security / Ops</p>
        <h1 className="text-3xl font-semibold tracking-tight">Trigger automations</h1>
        <p className="text-base text-muted-foreground">
          Kick off runs synchronously or asynchronously from your own systems. PantherIQ validates guardrails before accepting
          the request.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Endpoint</h2>
        <div className="rounded-2xl border border-border bg-muted/40 p-4 font-mono text-sm text-foreground">
          POST /v1/runs
        </div>
        <p className="text-sm text-muted-foreground">Body includes <code className="rounded bg-muted px-1">automation_id</code>, <code className="rounded bg-muted px-1">environment</code>, and optional <code className="rounded bg-muted px-1">payload</code> overrides.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Idempotency</h2>
        <p className="text-sm text-muted-foreground">
          Provide <code className="rounded bg-muted px-1">Idempotency-Key</code> to prevent duplicate runs. Keys are stored for 24 hours per automation.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Scheduling</h2>
        <p className="text-sm text-muted-foreground">
          Include <code className="rounded bg-muted px-1">execute_at</code> for future-dated runs. PantherIQ queues the job and emits status updates via webhook as soon as it
          starts.
        </p>
      </section>
    </article>
  );
}
