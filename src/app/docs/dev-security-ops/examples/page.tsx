export default function ApiExamplesPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dev / Security / Ops</p>
        <h1 className="text-3xl font-semibold tracking-tight">Examples</h1>
        <p className="text-base text-muted-foreground">
          Copy-ready snippets that show how to call PantherIQ from different environments.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Node.js</h2>
        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          {String.raw`import fetch from "node-fetch";

await fetch("https://api.pantheriq.com/v1/runs", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.PANTHERIQ_TOKEN}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ automation_id: "lead-gen", environment: "production" }),
});`}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">cURL</h2>
        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          {String.raw`curl https://api.pantheriq.com/v1/outcomes \
  -H "Authorization: Bearer $PANTHERIQ_TOKEN" \
  -G --data-urlencode "automation_id=customer-support"`}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Webhook handler</h2>
        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          {String.raw`app.post("/pantheriq-webhook", (req, res) => {
  verifySignature(req.headers, req.rawBody);
  if (req.body.type === "run.completed") {
    archiveOutcome(req.body.data);
  }
  res.sendStatus(200);
});`}
        </div>
      </section>
    </article>
  );
}
