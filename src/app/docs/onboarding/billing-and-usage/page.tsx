export default function BillingAndUsagePage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Onboarding</p>
        <h1 className="text-3xl font-semibold tracking-tight">Billing & usage</h1>
        <p className="text-base text-muted-foreground">
          Understand how plans, usage credits, and overages work so finance teams can predict spend before automations scale.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Plan structure</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Managed tiers include a base platform fee plus included automation runs.</li>
          <li>Overflow credits allow burst capacity without renegotiating contracts.</li>
          <li>Annual plans can commit to outcome targets; PantherIQ tracks attainment.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Usage monitoring</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Live meter</h3>
            <p className="text-sm text-muted-foreground">Shows credits consumed per automation and forecasts month-end spend.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Alerts</h3>
            <p className="text-sm text-muted-foreground">Email and Slack alerts at 50%, 80%, and 100% of the monthly allocation.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Invoices & procurement</h2>
        <p className="text-sm text-muted-foreground">
          Billing owners receive PDF invoices plus CSV line items for each automation. Optionally push invoices into NetSuite or
          SAP via SFTP. Purchase orders can be attached to a workspace for faster reconciliation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Cost attribution</h2>
        <p className="text-sm text-muted-foreground">
          Tag automations with cost centers so finance teams can attribute spend directly to RevOps, CX, or R&D. Reports export
          as CSV or flow to BI tools through the reporting API.
        </p>
      </section>
    </article>
  );
}
