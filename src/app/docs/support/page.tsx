import Link from "next/link";

export default function SupportHomePage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Support</p>
        <h1 className="text-3xl font-semibold tracking-tight">Support home</h1>
        <p className="text-base text-muted-foreground">
          PantherIQ support partners with teams running managed AI automations so you can stay focused on outcomes while we
          handle the operations.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-border p-5">
          <h2 className="text-lg font-semibold">Self-service docs</h2>
          <p className="mt-2 text-sm text-muted-foreground">Browse automation guides, onboarding steps, and operations playbooks.</p>
          <Link href="/docs" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
            Go to docs
          </Link>
        </article>
        <article className="rounded-2xl border border-border p-5">
          <h2 className="text-lg font-semibold">Contact support</h2>
          <p className="mt-2 text-sm text-muted-foreground">Reach the operators behind your workspace for hands-on assistance.</p>
          <Link href="/docs/support/contact" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
            View contact options
          </Link>
        </article>
      </section>
    </article>
  );
}
