import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="bg-white text-slate-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 md:px-6">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <span aria-hidden="true">←</span>
          Back to Browse
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 md:px-6">
        <section className="space-y-6 text-center">
          <span className="text-xs font-semibold tracking-[0.4em] text-slate-500">
            AI OPERATIONS LAYER
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Simple pricing for managed AI automations
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 md:text-lg">
            Choose a PantherIQ plan for your business. Our transparent platform fee covers hosting, monitoring, billing, and day-to-day operations for the agents we run on your behalf.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">Explorer</h2>
                <p className="text-sm text-slate-500">
                  Test PantherIQ automations with demo data or low-risk workflows.
                </p>
              </div>
              <div className="text-3xl font-semibold text-slate-900">Free</div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Browse curated agents and run sandbox demos</li>
                <li>Validate use cases with limited workloads</li>
                <li>Email support within 72 hours</li>
              </ul>
            </div>
            <button className="mt-10 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:text-slate-900">
              Get started
            </button>
          </article>

          <article className="flex h-full flex-col justify-between rounded-2xl border border-black bg-black p-8 text-white shadow-lg md:-translate-y-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">Pro</h2>
                <p className="text-sm text-slate-200">
                  Launch production agents with live integrations and higher usage limits.
                </p>
              </div>
              <div className="text-3xl font-semibold text-white">$49 / month</div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li>Deploy unlimited managed agents across sales, support, and ops</li>
                <li>Role-based access, usage analytics, and outcome reporting</li>
                <li>Priority support with 24-hour response times</li>
              </ul>
            </div>
            <button className="mt-10 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200">
              Upgrade to Pro
            </button>
          </article>

          <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">Teams</h2>
                <p className="text-sm text-slate-500">
                  Multi-seat access, security reviews, and a dedicated success manager.
                </p>
              </div>
              <div className="text-3xl font-semibold text-slate-900">Contact sales</div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Custom usage tiers, SSO, and audit-ready controls</li>
                <li>Named PantherIQ automation success manager</li>
                <li>Enterprise SLAs and consolidated billing</li>
              </ul>
            </div>
            <button className="mt-10 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:text-slate-900">
              Talk to sales
            </button>
          </article>
        </section>

        <section className="space-y-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                How do plan prices relate to agents and workflows?
              </h3>
              <p className="text-sm text-slate-600">
                Explorer is ideal for evaluating one or two automations with demo environments. Pro unlocks unlimited managed agents running against your live tools. Teams layers on governance so multiple departments can share automations without paying per seat.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                How does usage-based billing or overages work?
              </h3>
              <p className="text-sm text-slate-600">
                Every plan includes a baseline number of automation runs. If you exceed those thresholds, we notify you and bill overages at the same transparent rate, or help you upgrade tiers before the next cycle.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                What is your performance guarantee and refund policy?
              </h3>
              <p className="text-sm text-slate-600">
                PantherIQ-managed agents include a 7-day performance guarantee. If an automation fails to deliver as scoped, request a refund from your dashboard and our team will either remediate or credit your account immediately.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                How is billing processed?
              </h3>
              <p className="text-sm text-slate-600">
                All plans bill through Stripe for security and compliance. You receive itemized invoices covering the base plan plus any usage adjustments, and Teams customers can consolidate multiple workspaces under one contract.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 text-slate-700">
            <span className="text-2xl" aria-hidden="true">
              📘
            </span>
            <p className="text-sm leading-relaxed md:text-base">
              Need a deeper breakdown of what&apos;s included in each plan? Read the{" "}
              <Link
                href="/docs/pricing-plans"
                className="inline-flex items-center text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-500 md:text-base"
              >
                Pricing &amp; Plans guide
              </Link>{" "}
              in Docs for full feature comparisons.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}


