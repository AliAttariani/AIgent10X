export default function ApiOverviewPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dev / Security / Ops</p>
        <h1 className="text-3xl font-semibold tracking-tight">API overview</h1>
        <p className="text-base text-muted-foreground">
          The PantherIQ API exposes endpoints to list automations, trigger runs, fetch outcomes, and manage integrations.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Base URL</h2>
        <div className="rounded-2xl border border-border bg-muted/50 p-4 font-mono text-sm text-foreground">
          https://api.pantheriq.com/v1
        </div>
        <p className="text-sm text-muted-foreground">All requests must include HTTPS and TLS 1.2+. IPv6 is fully supported.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Resources</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li><span className="font-semibold text-foreground">/automations</span> — metadata about available playbooks.</li>
          <li><span className="font-semibold text-foreground">/runs</span> — trigger, list, and inspect automation runs.</li>
          <li><span className="font-semibold text-foreground">/outcomes</span> — structured results plus evidence attachments.</li>
          <li><span className="font-semibold text-foreground">/integrations</span> — configure credentials, scopes, and environment tags.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Versioning</h2>
        <p className="text-sm text-muted-foreground">
          Version is embedded in the URL. Minor releases add fields but remain backwards compatible. Deprecations provide a
          90-day overlap period with dual-write responses.
        </p>
      </section>
    </article>
  );
}
