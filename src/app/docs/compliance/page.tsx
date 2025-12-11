export default function CompliancePage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Compliance</p>
        <h1 className="text-3xl font-semibold tracking-tight">Data protection & controls</h1>
        <p className="text-base text-muted-foreground">
          PantherIQ applies enterprise-grade safeguards across data protection, retention, encryption, and regional routing. Use
          this page as the canonical reference for your security and legal teams.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Data protection</h2>
        <p className="text-sm text-muted-foreground">
          Production data is processed in isolated VPCs with strict network ACLs. Operators use just-in-time access that expires
          after each maintenance window. All access is logged and reviewed weekly.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Retention & storage</h2>
        <p className="text-sm text-muted-foreground">
          Outcome artifacts remain for 180 days by default. Configure shorter windows per automation or request legal holds for
          audits. Backups replicate across three availability zones and are encrypted at rest.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Encryption & hashing</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Data at rest: AES-256 with automated key rotation managed via HSMs.</li>
          <li>In transit: TLS 1.2+ with perfect forward secrecy.</li>
          <li>Secrets: Hashicorp Vault plus envelope encryption for credentials.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">SOC-style operational policies</h2>
        <p className="text-sm text-muted-foreground">
          Change management, vulnerability scans, and incident drills follow SOC 2 Type II controls. Reports are available under
          NDA. Production access requires MFA, device compliance, and change tickets tied to every action.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">GDPR compliance</h2>
        <p className="text-sm text-muted-foreground">
          PantherIQ acts as a processor. We sign DPAs with standard contractual clauses, support data subject requests in under
          30 days, and offer EU-only processing when requested.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Cross-region data flow</h2>
        <p className="text-sm text-muted-foreground">
          Data residency controls let you pin automations to US, EU, or APAC regions. Cross-region transfers require explicit
          approval and are logged with purpose, retention window, and authorized operator.
        </p>
      </section>
    </article>
  );
}
