import Link from "next/link";

const onboardingLinks = [
  { href: "/docs/onboarding/getting-started", label: "Getting started" },
  { href: "/docs/onboarding/workspace-and-roles", label: "Workspace & roles" },
  { href: "/docs/onboarding/billing-and-usage", label: "Billing & usage" },
  { href: "/docs/onboarding/running-your-first-automation", label: "Running your first automation" },
];

const automationLinks = [
  { href: "/docs/automations/lead-generation", label: "Lead generation automation" },
  { href: "/docs/automations/customer-support", label: "Customer support automation" },
  { href: "/docs/automations/content", label: "Content automation" },
  { href: "/docs/automations/workflow", label: "Workflow automations" },
  { href: "/docs/automations/research", label: "Research & analysis automations" },
];

const developerLinks = [
  { href: "/docs/dev-security-ops/api-overview", label: "API overview" },
  { href: "/docs/dev-security-ops/authentication", label: "Authentication" },
  { href: "/docs/dev-security-ops/trigger-automations", label: "Trigger automations" },
  { href: "/docs/dev-security-ops/result-webhooks", label: "Result webhooks" },
  { href: "/docs/dev-security-ops/sandbox-testing", label: "Sandbox testing" },
  { href: "/docs/dev-security-ops/examples", label: "Examples" },
];

const keyResources = [
  {
    title: "Getting started",
    description: "Set up PantherIQ, connect integrations, and run your first automation.",
    href: "/docs/onboarding/getting-started",
  },
  {
    title: "Outcomes & guarantees",
    description: "Benchmark ROI, preview week-one results, and review contractual guarantees.",
    href: "/docs/outcomes",
  },
  {
    title: "Automation playbooks",
    description: "See workflow diagrams plus expected outcomes for every managed automation.",
    href: "/docs/automations",
  },
  {
    title: "Compliance",
    description: "Review data protection, retention, encryption, and regional routing commitments.",
    href: "/docs/compliance",
  },
  {
    title: "Support & incident response",
    description: "Understand SLAs, escalation paths, and 24/7 support coverage.",
    href: "/docs/support",
  },
];

export default function DocsPage() {
  return (
    <main className="space-y-16 text-foreground">
      <header className="space-y-5">
        <h1 className="text-4xl font-semibold tracking-tight">PantherIQ Docs</h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          PantherIQ is the AI operations layer that designs, runs, and maintains automations for your business.
          Use these docs to understand the model, launch playbooks, and keep teams aligned on security, usage, and support.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Choose your track</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <TrackCard
            title="Onboarding"
            description="Foundations for business users bringing PantherIQ into production."
            links={onboardingLinks}
          />
          <TrackCard
            title="Automation playbooks"
            description="Overview of the managed automations we operate end to end."
            links={automationLinks}
          />
          <TrackCard
            title="Dev, security, & ops"
            description="APIs, webhooks, and governance for technical teams."
            links={developerLinks}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Key resources</h2>
          <p className="text-sm text-muted-foreground">Start here if you are in a hurry.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {keyResources.map((item) => (
            <article key={item.href} className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Link href={item.href} className="mt-4 inline-flex text-sm font-medium text-primary transition hover:underline">
                Read more
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Need assistance?</h2>
          <p className="text-sm text-muted-foreground">Report incidents, request help from our operators, or escalate a ticket.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Compliance & data protection</h3>
              <p className="text-sm text-muted-foreground">Review encryption, retention, GDPR posture, and cross-region safeguards.</p>
            </div>
            <Link href="/docs/compliance" className="mt-4 inline-flex text-sm font-medium text-primary transition hover:underline">
              Visit compliance docs
            </Link>
          </article>
          <article className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Support & incident reporting</h3>
              <p className="text-sm text-muted-foreground">Find response times, escalation paths, and 24/7 contacts for your plan.</p>
            </div>
            <Link href="/docs/support" className="mt-4 inline-flex text-sm font-medium text-primary transition hover:underline">
              Visit support docs
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}

type TrackCardProps = {
  title: string;
  description: string;
  links: { href: string; label: string }[];
};

function TrackCard({ title, description, links }: TrackCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-muted/40 p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="mt-6 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-muted-foreground transition hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
