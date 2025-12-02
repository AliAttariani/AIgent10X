import Link from "next/link";

const creatorLinks = [
  { href: "/docs/creator/getting-started", label: "Getting started as a creator" },
  { href: "/docs/creator/submitting", label: "Submitting a new agent" },
  { href: "/docs/pricing-plans", label: "Pricing & Plans" },
  { href: "/docs/legal/creator-agreement", label: "Creator Agreement & policies" },
];
// TODO: Create routes for /docs/creator/getting-started and /docs/creator/submitting.
// TODO: Create route for /docs/legal/creator-agreement.

const teamLinks = [
  { href: "/docs/workspaces/roles", label: "Workspace & roles" },
  { href: "/docs/security/overview", label: "Security & compliance overview" },
  { href: "/docs/billing/manage", label: "Managing billing & payouts" },
  { href: "/docs/support/incident-reporting", label: "Incident reporting & support" },
];
// TODO: Create routes for team and operator documentation listed above.

const developerLinks = [
  { href: "/docs/api/overview", label: "PantherIQ API overview" },
  { href: "/docs/api/webhooks", label: "Webhook events" },
  { href: "/docs/api/sandbox", label: "Testing in sandbox" },
  { href: "/docs/api/examples", label: "Examples & SDKs" },
];
// TODO: Create routes for developer documentation listed above.

const keyResources = [
  {
    title: "Pricing & Plans",
    description:
      "How plans map to your growth stage and what the marketplace keeps to stay sustainable.",
    href: "/docs/pricing-plans",
  },
  {
    title: "Creator Agreement",
    description: "Legal terms for listing agents on PantherIQ.",
    href: "/docs/legal/creator-agreement",
  },
  {
    title: "Security & incident reporting",
    description: "How we protect customers and how to reach security@pantheriq.ai.",
    href: "/docs/security/incident-reporting",
  },
  {
    title: "Refunds & payouts",
    description: "How refunds work, payout timelines, and how Stripe handles transfers.",
    href: "/docs/billing/refunds-payouts",
  },
];
// TODO: Create routes for legal, security, and billing resources where they do not yet exist.

export default function DocsPage() {
  return (
    <main className="space-y-16 text-foreground">
      <header className="space-y-5">
        <h1 className="text-4xl font-semibold tracking-tight">PantherIQ Docs</h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Everything you need to build, launch, and operate AI agents on PantherIQ. Start with the basics, then go deeper into
          pricing, security, and developer APIs.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Choose your track</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <TrackCard
            title="For creators"
            description="List agents, understand marketplace rules, and grow your catalog with clear pricing."
            links={creatorLinks}
          />
          <TrackCard
            title="For teams & ops"
            description="Coordinate multi-seat access, stay compliant, and keep billing and support in sync."
            links={teamLinks}
          />
          <TrackCard
            title="For developers"
            description="Integrate PantherIQ APIs, automate workflows, and run safe experiments in sandbox."
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
