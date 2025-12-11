export default function OutcomesAndGuaranteesPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Outcomes & guarantees</p>
        <h1 className="text-3xl font-semibold tracking-tight">What PantherIQ guarantees</h1>
        <p className="text-base text-muted-foreground">
          This page outlines the results you can expect in the first week, how we model ROI, and the contractual guarantees that
          back every automation program.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Results in the first 7 days</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Automation deployed to sandbox within 48 hours of signed order form.</li>
          <li>First production run executed within seven days, assuming integrations are connected.</li>
          <li>Daily launch notes summarizing QA findings, blockers, and operator actions.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">ROI benchmarks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Lead generation</p>
            <p className="text-sm text-muted-foreground">3-5x pipeline lift vs. manual SDR baselines within 30 days.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Customer support</p>
            <p className="text-sm text-muted-foreground">35% reduction in handle time with CSAT flat or improving.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Content operations</p>
            <p className="text-sm text-muted-foreground">2x output per marketer with less than 5% rework.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Workflow & research</p>
            <p className="text-sm text-muted-foreground">50% faster cycle times on diligence, onboarding, or approvals.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Real examples</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Enterprise SaaS</h3>
            <p className="text-sm text-muted-foreground">
              64 meetings booked in one quarter from net-new accounts using the lead generation automation. Pipeline attribution
              exported to Salesforce daily.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Global CX team</h3>
            <p className="text-sm text-muted-foreground">
              Resolved 72% of tier-one tickets autonomously while keeping NPS steady at 52. Human agents focused on complex
              escalations only.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Performance guarantees</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Named operator accountable for each automation with weekly executive-ready reports.</li>
          <li>Guaranteed remediation window: if KPIs dip below agreed thresholds, PantherIQ deploys a fix within five business days.</li>
          <li>Credit-back clause for missed outcome targets on committed plans.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">SLA around speed & accuracy</h2>
        <p className="text-sm text-muted-foreground">
          Production runs are monitored 24/7. Priority incidents receive a first human response within 15 minutes. Accuracy is
          measured via sampling: lead qualification, ticket responses, and research briefs must meet or exceed the accuracy band
          defined in your Statement of Work.
        </p>
      </section>
    </article>
  );
}
