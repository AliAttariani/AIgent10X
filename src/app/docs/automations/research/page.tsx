export default function ResearchAutomationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Automation playbook</p>
        <h1 className="text-3xl font-semibold tracking-tight">Research & analysis automations</h1>
        <p className="text-base text-muted-foreground">
          Generate market maps, competitor tear-downs, diligence briefs, or executive updates with traceable sources and
          operator QA baked in.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Diagram</h2>
        <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
{`Question intake → Source harvesting → Evidence ranking → Narrative synthesis → Human QA → Delivery & citations`}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Expected outcomes</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Research briefs delivered in less than 24 hours with cited sources.</li>
          <li>Auto-generated slides or memos tailored to exec, GTM, or product audiences.</li>
          <li>Archive of prior briefs searchable by keyword, industry, or competitor.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Quality controls</h2>
        <p className="text-sm text-muted-foreground">
          PantherIQ tags each insight with confidence scores. Operators review low-confidence claims, attach screenshots, and
          mark sources that require human-only handling.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Turnaround time</p>
            <p className="text-sm text-muted-foreground">Average hours from request submission to delivery.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Source diversity</p>
            <p className="text-sm text-muted-foreground">Count of unique sources per brief to avoid blind spots.</p>
          </div>
        </div>
      </section>
    </article>
  );
}
