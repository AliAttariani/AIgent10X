import Link from "next/link";

const links = [
  { title: "API overview", href: "/docs/dev-security-ops/api-overview" },
  { title: "Authentication", href: "/docs/dev-security-ops/authentication" },
  { title: "Trigger automations", href: "/docs/dev-security-ops/trigger-automations" },
  { title: "Result webhooks", href: "/docs/dev-security-ops/result-webhooks" },
  { title: "Sandbox testing", href: "/docs/dev-security-ops/sandbox-testing" },
  { title: "Examples", href: "/docs/dev-security-ops/examples" },
];

export default function DevSecurityOpsPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dev / Security / Ops</p>
        <h1 className="text-3xl font-semibold tracking-tight">Build on PantherIQ safely</h1>
        <p className="text-base text-muted-foreground">
          Use these guides to integrate the PantherIQ API, manage authentication, and operationalize results with confidence.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">{link.title}</h2>
              <p className="mt-2 text-sm text-primary">Open doc →</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Change management</h2>
        <p className="text-sm text-muted-foreground">
          APIs follow semantic versioning. Breaking changes are announced 30 days prior with migration guides and optional
          compatibility shims maintained by PantherIQ operators.
        </p>
      </section>
    </article>
  );
}
