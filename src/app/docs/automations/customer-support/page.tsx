export default function CustomerSupportAutomationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Automation playbook</p>
        <h1 className="text-3xl font-semibold tracking-tight">Customer support automation</h1>
        <p className="text-base text-muted-foreground">
          Provide 24/7 coverage across chat, email, and social. PantherIQ triages intents, drafts empathetic responses, and
          escalates to humans when needed.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What it does</h2>
        <p className="text-sm text-muted-foreground">
          The automation ingests support tickets, classifies urgency, resolves repetitive issues, and surfaces priority items to
          specialists with full context.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Workflow diagram</h2>
        <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
{`Multi-channel intake
   ↓
Intent classification → Knowledge lookup → Draft response → Human QA → Customer update → Incident logging`}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Expected outcomes</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Median first-response time under two minutes for tier-one tickets.</li>
          <li>Automatic status updates synchronized with Zendesk, Intercom, or ServiceNow.</li>
          <li>Daily summaries of unresolved incidents with recommended next actions.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Setup steps</h2>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Connect ticketing platforms plus any knowledge bases or release notes feeds.</li>
          <li>Define escalation rules, brand tone, and compliance statements.</li>
          <li>Provide sample transcripts so PantherIQ can align on empathy and mirroring.</li>
          <li>Enable sentiment logging to capture churn signals directly in your CRM.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Best practices</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Maintain an FAQ library with version tags. Automations cite these sources for traceability.</li>
          <li>Use PantherIQ audit logs to sample transcripts weekly with your CX lead.</li>
          <li>Route complex cases straight to operators by tagging intent keywords.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">KPIs to monitor</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">First-response time</p>
            <p className="text-sm text-muted-foreground">Monitor automation vs. human benchmarks during go-live.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Containment rate</p>
            <p className="text-sm text-muted-foreground">Share of tickets resolved autonomously without escalation.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">CSAT / NPS impact</p>
            <p className="text-sm text-muted-foreground">Sentiment before and after introducing PantherIQ responses.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Backlog burn-down</p>
            <p className="text-sm text-muted-foreground">Tracks how quickly unresolved queues shrink each day.</p>
          </div>
        </div>
      </section>
    </article>
  );
}
