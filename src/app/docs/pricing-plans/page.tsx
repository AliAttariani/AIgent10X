export default function PricingPlansPage() {
  return (
    <main className="flex flex-col gap-16">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Docs</p>
        <h1 className="text-4xl font-semibold tracking-tight">Pricing &amp; Plans</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Understand how PantherIQ plans map to your growth stage and what the marketplace keeps to stay sustainable.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Plan overview</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Explorer</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Publish up to 1 agent with limited analytics and lower marketplace visibility. Ideal for testing the waters.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Unlock unlimited agents, advanced analytics, ranking boosts, and detailed performance metrics that drive conversions.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Teams</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Need custom usage, private models, or enterprise support? Contact the sales team for a tailored agreement.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Marketplace fees</h2>
        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          <p>
            PantherIQ collects a transparent 10% fee on each sale. Checkout clearly shows the agent price, platform fee, and Stripe processing so buyers understand exactly where every dollar goes.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Value for creators</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Pro increases sales:</span> unlimited listings and ranking boosts keep your agents in front of motivated buyers, compounding discoverability over time.
          </p>
          <p>
            <span className="font-semibold text-foreground">Analytics matter:</span> advanced dashboards surface conversion funnels, usage patterns, and drop-off points so you can ship updates that resonate.
          </p>
          <p>
            <span className="font-semibold text-foreground">Ranking boosts drive trust:</span> higher placement signals quality and improves click-through rates, especially during launch windows and seasonal campaigns.
          </p>
        </div>
      </section>
    </main>
  );
}
