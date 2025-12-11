export default function SandboxTestingPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dev / Security / Ops</p>
        <h1 className="text-3xl font-semibold tracking-tight">Sandbox testing</h1>
        <p className="text-base text-muted-foreground">
          Use the sandbox to validate integrations and guardrails before they impact production data.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Environment separation</h2>
        <p className="text-sm text-muted-foreground">
          Sandbox runs operate on masked data or synthetic fixtures. Tokens include an <code className="rounded bg-muted px-1">env</code> claim so they cannot be
          replayed against production endpoints.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Test data kits</h2>
        <p className="text-sm text-muted-foreground">
          PantherIQ provides sample payloads for each automation. Customize them to mirror your data model without exposing
          sensitive information.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Promotion workflow</h2>
        <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Run automated checks via API.</li>
          <li>Gather sign-off from the business owner inside the dashboard.</li>
          <li>Promote the configuration to production with a single click; changes are versioned automatically.</li>
        </ol>
      </section>
    </article>
  );
}
