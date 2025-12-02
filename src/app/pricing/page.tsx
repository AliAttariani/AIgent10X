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
            PRICING
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Simple pricing for AI agents
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 md:text-lg">
            Creators set prices for their agents. PantherIQ adds small platform fees to cover hosting, billing, and support.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">Explorer</h2>
                <p className="text-sm text-slate-500">
                  Test-drive community agents before you launch.
                </p>
              </div>
              <div className="text-3xl font-semibold text-slate-900">Free</div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Browse and trial agents with demo data</li>
                <li>Save favorites to your workspace</li>
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
                  Launch production agents with advanced controls.
                </p>
              </div>
              <div className="text-3xl font-semibold text-white">$49 / month</div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li>Deploy unlimited agents with live integrations</li>
                <li>Role-based access and usage analytics</li>
                <li>Priority email support within 24 hours</li>
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
                  Enterprise controls for growing agent practices.
                </p>
              </div>
              <div className="text-3xl font-semibold text-slate-900">Contact sales</div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Custom usage tiers and security reviews</li>
                <li>Dedicated success manager</li>
                <li>SLAs and consolidated billing</li>
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
                How are agent prices determined?
              </h3>
              <p className="text-sm text-slate-600">
                Each creator sets their own price based on features, integrations, and support levels. PantherIQ adds a small transparent platform fee at checkout to keep the marketplace running.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                What is your refund policy?
              </h3>
              <p className="text-sm text-slate-600">
                Most agents include a 7-day refund window. If you are unsatisfied, submit a refund request from your dashboard and we will coordinate directly with the creator to resolve it quickly.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                How do creators receive payouts?
              </h3>
              <p className="text-sm text-slate-600">
                Payouts are handled through Stripe. Earnings are transferred on a rolling 7-day schedule after deducting platform fees and any applicable chargebacks.
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
              Need the full breakdown for creators? Read the{" "}
              <Link
                href="/docs/pricing-plans"
                className="inline-flex items-center text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-500 md:text-base"
              >
                Pricing &amp; Plans guide
              </Link>{" "}
              in Docs.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}


