export default function ResultWebhooksPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dev / Security / Ops</p>
        <h1 className="text-3xl font-semibold tracking-tight">Result webhooks</h1>
        <p className="text-base text-muted-foreground">
          Receive structured outcomes, QA notes, and evidence payloads in real time. Webhooks are signed and replay protected.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Event types</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li><span className="font-semibold text-foreground">run.started</span> — automation moved into execution.</li>
          <li><span className="font-semibold text-foreground">run.completed</span> — includes KPIs and outcome metadata.</li>
          <li><span className="font-semibold text-foreground">run.flagged</span> — human operator paused the run for review.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground">
          Verify signatures using the shared secret derived from your dashboard. Reject requests where the <code className="rounded bg-muted px-1">X-PantherIQ-Timestamp</code>
          is older than five minutes to block replay attacks.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Retries</h2>
        <p className="text-sm text-muted-foreground">
          PantherIQ retries failed deliveries up to 10 times with exponential backoff. Use idempotent processing so duplicate
          events do not double-count outcomes.
        </p>
      </section>
    </article>
  );
}
