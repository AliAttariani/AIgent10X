export default function WorkflowAutomationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Automation playbook</p>
        <h1 className="text-3xl font-semibold tracking-tight">Workflow automations</h1>
        <p className="text-base text-muted-foreground">
          Coordinate internal processes like vendor onboarding, employee provisioning, or finance reconciliations without manual
          follow-up chains.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Diagram</h2>
        <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
{`Trigger event → Data fetch → Policy checks → Task orchestration → Stakeholder notifications → System updates`}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Outcomes</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Cycle time reduced for approvals, onboarding flows, or reconciliation steps.</li>
          <li>Automatic documentation of every action for auditors.</li>
          <li>Real-time alerts when dependencies block downstream tasks.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Governance</h2>
        <p className="text-sm text-muted-foreground">
          Define RACI roles inside the playbook so PantherIQ knows who to notify when thresholds fail. Attach SOPs or policy IDs
          for deterministic escalations.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Monitoring</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Throughput</p>
            <p className="text-sm text-muted-foreground">Tasks closed per day, grouped by workflow type.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">SLA adherence</p>
            <p className="text-sm text-muted-foreground">Percent of steps completed before their SLA timer.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Exception volume</p>
            <p className="text-sm text-muted-foreground">Number of runs requiring manual intervention.</p>
          </div>
        </div>
      </section>
    </article>
  );
}
