export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Legal</p>
        <h1 className="text-3xl font-semibold tracking-tight">Privacy policy</h1>
        <p className="text-base text-muted-foreground">
          PantherIQ processes data to operate managed automations that save time and grow revenue while respecting customer
          privacy expectations.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What we collect</h2>
        <p className="text-sm text-muted-foreground">
          We collect account information, usage data, and logs produced by automations so that we can administer workspaces and
          provide support.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How we use data</h2>
        <p className="text-sm text-muted-foreground">
          Data powers the automations you request, helps us improve reliability, and supports security reviews for regulated
          customers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Third-party processors</h2>
        <p className="text-sm text-muted-foreground">
          We rely on Stripe for billing and vetted AI providers such as OpenAI to run large language model workloads on your
          behalf. Each processor is bound by contracts that require appropriate safeguards.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Your choices</h2>
        <p className="text-sm text-muted-foreground">
          You can request data export or deletion by emailing support@pantheriq.ai. We will respond according to your regional
          compliance requirements.
        </p>
      </section>
    </article>
  );
}
