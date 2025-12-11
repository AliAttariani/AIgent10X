import Link from "next/link";

const automations = [
  {
    title: "Lead generation",
    description: "Prospecting, enrichment, and outreach tuned for your ICP.",
    href: "/docs/automations/lead-generation",
  },
  {
    title: "Customer support",
    description: "24/7 triage that drafts empathetic responses and escalates complex tickets.",
    href: "/docs/automations/customer-support",
  },
  {
    title: "Content automation",
    description: "Multi-channel thought-leadership and enablement content produced on schedule.",
    href: "/docs/automations/content",
  },
  {
    title: "Workflow automations",
    description: "Back-office task orchestration across finance, HR, and IT systems.",
    href: "/docs/automations/workflow",
  },
  {
    title: "Research & analysis",
    description: "Competitive briefs, market maps, and diligence summaries delivered on demand.",
    href: "/docs/automations/research",
  },
];

export default function AutomationOverviewPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Automation playbooks</p>
        <h1 className="text-3xl font-semibold tracking-tight">How PantherIQ runs automations</h1>
        <p className="text-base text-muted-foreground">
          All automations follow the same managed model: scoped outcomes, operator-led QA, and instrumentation across every
          step. Choose a playbook below to see workflow diagrams and performance expectations.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Operating model</h2>
        <div className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">
          <pre className="whitespace-pre-wrap text-xs leading-6">
{`Intake → Data sync → Reasoning & generation → Human QA → Delivery → Feedback loop`}
          </pre>
          <p className="mt-3">
            Each phase is instrumented with guardrails, so incident response and tuning are straightforward across every
            automation track.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {automations.map((automation) => (
          <article key={automation.href} className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{automation.title}</h2>
              <p className="text-sm text-muted-foreground">{automation.description}</p>
            </div>
            <Link href={automation.href} className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
              View playbook
            </Link>
          </article>
        ))}
      </section>
    </article>
  );
}
