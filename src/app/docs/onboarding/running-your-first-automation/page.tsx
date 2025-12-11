export default function RunningYourFirstAutomationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Onboarding</p>
        <h1 className="text-3xl font-semibold tracking-tight">Run your first automation</h1>
        <p className="text-base text-muted-foreground">
          Use this checklist to move from configuration to a production-ready automation with clear QA gates and success
          metrics.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Kickoff</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Pick an automation with measurable impact in under two weeks.</li>
          <li>Identify the internal reviewer who will approve early outputs.</li>
          <li>Confirm integrations and credentials are ready for sandbox.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. Dry run in sandbox</h2>
        <p className="text-sm text-muted-foreground">
          PantherIQ runs the automation against masked or sample data. Review transcripts, enrichment steps, and scoring logic to
          ensure they reflect your brand.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. QA checklist</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Data validation</h3>
            <p className="text-sm text-muted-foreground">Spot-check 10 records and confirm fields map correctly.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Guardrails</h3>
            <p className="text-sm text-muted-foreground">Ensure tone, channel limits, and escalation triggers are configured.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Outcome review</h3>
            <p className="text-sm text-muted-foreground">Agree on what counts as success (meetings, tickets, tasks, etc.).</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Approvals</h3>
            <p className="text-sm text-muted-foreground">Document sign-off from the business owner before production launch.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Launch & monitor</h2>
        <p className="text-sm text-muted-foreground">
          When you flip to production, PantherIQ operators monitor the first 72 hours closely. Expect twice-daily status notes
          plus a full report at the end of the launch window.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Set recurring reviews</h2>
        <p className="text-sm text-muted-foreground">
          Schedule weekly outcome reviews and monthly tuning sessions. Use the built-in review template to capture insights,
          blockers, and backlog items for the automation team.
        </p>
      </section>
    </article>
  );
}
