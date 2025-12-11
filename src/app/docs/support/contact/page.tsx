export default function ContactSupportPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Support</p>
        <h1 className="text-3xl font-semibold tracking-tight">Contact support</h1>
        <p className="text-base text-muted-foreground">
          Our team responds within 24–48 business hours. Reach out if you are running PantherIQ automations in sandbox or
          production and need help from the operators assigned to your workspace.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Channels</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Email: <span className="font-medium text-foreground">support@pantheriq.ai</span></li>
          <li>In-app: Use the Help button inside your PantherIQ dashboard</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          For security issues or incident reports, follow the instructions in the security docs.
        </p>
      </section>
    </article>
  );
}
