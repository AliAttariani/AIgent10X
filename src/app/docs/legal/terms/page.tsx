export default function TermsOfServicePage() {
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Legal</p>
        <h1 className="text-3xl font-semibold tracking-tight">Terms of service</h1>
        <p className="text-base text-muted-foreground">
          This summary outlines how PantherIQ provides managed AI automations today. A full legal agreement will be shared with
          every customer prior to onboarding.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Use of PantherIQ</h2>
        <p className="text-sm text-muted-foreground">
          PantherIQ is intended for lawful business operations. Customers agree not to upload abusive, infringing, or illegal
          content and to maintain the access controls we provide for their workspaces.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Accounts & billing</h2>
        <p className="text-sm text-muted-foreground">
          Plans cover managed automations delivered by PantherIQ operators. Subscriptions renew per the order form and invoices
          are processed through Stripe unless otherwise specified.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">No guarantees</h2>
        <p className="text-sm text-muted-foreground">
          We operate on a best-effort basis and do not guarantee uninterrupted service. PantherIQ is not liable for indirect,
          incidental, or consequential damages arising from use of the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Changes</h2>
        <p className="text-sm text-muted-foreground">
          These terms may be updated as the platform evolves. We will publish an effective date for each revision and notify
          active customers through the dashboard or email.
        </p>
      </section>
    </article>
  );
}
