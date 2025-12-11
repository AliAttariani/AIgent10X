export default function GettingStartedPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Getting started</p>
        <h1 className="text-3xl font-semibold tracking-tight">Onboard your team with PantherIQ</h1>
        <p className="text-base text-muted-foreground">
          Follow these steps to create an account, connect business systems, and run your first managed automation with
          confidence.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Create your workspace</h2>
        <p className="text-sm text-muted-foreground">
          Click <span className="font-medium text-foreground">Get started</span> on the marketing site, choose your plan, and invite the teammates
          who will review outcomes. Each workspace receives an owner role by default, plus optional admin and operator seats.
        </p>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Verify your email and enable SSO/OAuth for quick sign-in.</li>
          <li>Define workspace name and business unit—this appears on invoices and reports.</li>
          <li>Review the automation catalog to flag which playbooks you intend to activate.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. Select an automation</h2>
        <p className="text-sm text-muted-foreground">
          Browse <span className="font-medium text-foreground">/browse</span> or the Automations section of the dashboard. Each card includes the outcome it delivers,
          integrations required, and KPIs PantherIQ monitors on your behalf.
        </p>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Open the automation detail page to review deployment notes and sample insights.</li>
          <li>Click <span className="font-medium text-foreground">Request deployment</span> and pick the workspace plus environment (demo or production).</li>
          <li>Assign an internal business owner who will receive weekly summaries.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. Connect integrations</h2>
        <p className="text-sm text-muted-foreground">
          PantherIQ automations stay in sync with your stack via OAuth or service accounts. Provide the minimum scopes needed for
          each integration—email, CRM, social, calendar, data warehouses, or bespoke APIs.
        </p>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Use the Integrations tab to authorize Google Workspace, Microsoft 365, HubSpot, Salesforce, Slack, X, or custom REST.</li>
          <li>Tag environments (demo vs production) so we never mix data sources.</li>
          <li>Confirm webhook destinations if you plan to consume results programmatically.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Run your first automation</h2>
        <p className="text-sm text-muted-foreground">
          Once connections are verified, PantherIQ operators schedule an initial run. You can trigger a demo run immediately or
          wait for the production cadence defined in the runbook.
        </p>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Use the <span className="font-medium text-foreground">Runs</span> tab to monitor queued, in-progress, and completed jobs.</li>
          <li>Outcome dashboards highlight leads generated, tickets resolved, messages sent, or workflows closed.</li>
          <li>Pause or resume automations without losing configuration data.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Review insights & outcome reports</h2>
        <p className="text-sm text-muted-foreground">
          Each run produces structured outcomes, QA notes, and operator commentary. Reports arrive via email and are also
          accessible through the dashboard or API.
        </p>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Outcome cards summarize the value created (meetings booked, replies handled, tasks completed).</li>
          <li>Trend charts show week-over-week deltas plus forecasted impact.</li>
          <li>Export CSV/JSON artifacts or forward results to BI tools through webhooks.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Troubleshoot common issues</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Integration errors</h3>
            <p className="text-sm text-muted-foreground">
              Re-authenticate expired tokens or update service accounts with the scopes listed in the automation runbook.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Usage limits</h3>
            <p className="text-sm text-muted-foreground">
              If a run stops due to credit exhaustion, upgrade to the next plan or request overflow credits from support.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Data quality flags</h3>
            <p className="text-sm text-muted-foreground">
              PantherIQ pauses an automation if upstream data deviates from expected formats. Review the alert in the dashboard,
              adjust mappings, and rerun.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Support escalation</h3>
            <p className="text-sm text-muted-foreground">
              Open a ticket from the Support panel with the run ID. Our operators respond within your SLA window.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
