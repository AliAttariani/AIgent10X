export default function LeadGenerationAutomationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Automation playbook</p>
        <h1 className="text-3xl font-semibold tracking-tight">Lead generation automation</h1>
        <p className="text-base text-muted-foreground">
          PantherIQ operates an autonomous prospecting engine that finds, enriches, and contacts qualified accounts while
          keeping your CRM current.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What it does</h2>
        <p className="text-sm text-muted-foreground">
          The playbook sources new leads from specified industries, enriches them with firmographic data, writes personalized
          outreach, and hands off warm responses to your sales team.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Workflow diagram</h2>
        <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
{`Target filters
   ↓
Prospect discovery → Enrichment → Messaging → Human QA → CRM sync → Follow-up automation`}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Expected outcomes</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Net-new qualified accounts booked on your calendar.</li>
          <li>CRM automatically updated with contact notes, stages, and sentiment.</li>
          <li>Alerting when accounts reach reply or scheduling thresholds.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Setup steps</h2>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Define ICP filters (industry, revenue, geography) and upload do-not-contact lists.</li>
          <li>Connect CRM, email, calendar, and enrichment APIs.</li>
          <li>Approve the outreach brief and guardrails for tone, cadence, and escalation.</li>
          <li>Schedule verification runs to confirm mappings before production launch.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Best practices</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Refresh suppression lists weekly to avoid contacting existing customers.</li>
          <li>Loop in SDR managers on the weekly outcome report to refine messaging.</li>
          <li>Use PantherIQ usage caps to throttle outreach by territory or channel.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">KPIs to monitor</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Meetings booked</p>
            <p className="text-sm text-muted-foreground">Tracked per week and compared to manual baselines.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Positive reply rate</p>
            <p className="text-sm text-muted-foreground">Calculated across channels with anomaly alerts.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Pipeline value</p>
            <p className="text-sm text-muted-foreground">Forecasted revenue tied to automation-sourced opportunities.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">List health</p>
            <p className="text-sm text-muted-foreground">Bounce rate and enrichment coverage across lead batches.</p>
          </div>
        </div>
      </section>
    </article>
  );
}
