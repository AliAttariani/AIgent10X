export default function ContentAutomationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Automation playbook</p>
        <h1 className="text-3xl font-semibold tracking-tight">Content automation</h1>
        <p className="text-base text-muted-foreground">
          Produce campaign assets, newsletters, enablement docs, and social posts that stay on-message and on-schedule without
          ballooning headcount.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Workflow diagram</h2>
        <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
{`Brief intake → Source library sync → Draft generation → Brand QA → Channel formatting → Publish & archive`}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Expected outcomes</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Editorial calendar automatically populated with approved drafts.</li>
          <li>Source citations embedded in every asset for compliance review.</li>
          <li>Performance recap tied to each asset (opens, clicks, shares, downloads).</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Setup essentials</h2>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Upload brand voice guidelines and guardrail prompts.</li>
          <li>Connect CMS, asset library, and analytics tooling.</li>
          <li>Define routing rules for legal or stakeholder approvals.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">KPIs to monitor</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Time-to-publish</p>
            <p className="text-sm text-muted-foreground">Average hours between brief submission and publication.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Asset coverage</p>
            <p className="text-sm text-muted-foreground">Percent of planned assets delivered per sprint.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Engagement lift</p>
            <p className="text-sm text-muted-foreground">Delta in opens, CTR, or downloads after automation adoption.</p>
          </div>
        </div>
      </section>
    </article>
  );
}
