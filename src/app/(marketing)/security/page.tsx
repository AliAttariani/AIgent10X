import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Policy – AIgent10X",
};

export default function SecurityPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose prose-neutral dark:prose-invert">
      <h1>Vulnerability Disclosure Policy</h1>
      <p>
        AIgent10X welcomes reports from security researchers and the broader community. We value your efforts to
        responsibly disclose potential vulnerabilities so we can keep our platform and customers protected.
      </p>

      <section>
        <h2>Report a Vulnerability</h2>
        <p>
          Please email a detailed report to <a href="mailto:security@aigent10x.com">security@aigent10x.com</a>. Include
          relevant reproduction steps, impacted endpoints or components, and any proof-of-concept information that helps
          us understand the issue quickly. Avoid publicly disclosing the finding until we confirm a fix is in place.
        </p>
      </section>

      <section>
        <h2>Response Targets</h2>
        <p>
          We aim to acknowledge new reports within 48 hours. Once acknowledged, our security team will triage the report,
          confirm severity, and coordinate remediation. We will provide periodic updates and notify you when the issue is
          resolved. If we need clarification, we will reach out using your preferred contact method.
        </p>
      </section>

      <section>
        <h2>Scope & Safe Harbor</h2>
        <p>
          Our App Router endpoints, public APIs, and creator dashboards are in scope. Please avoid attacks that could
          impact other users&apos; data or platform availability, including DDoS, social engineering, or physical access
          attempts. We operate under a good-faith safe harbor: as long as you follow this policy and act responsibly, we
          will not pursue legal action for your research activities.
        </p>
      </section>
    </div>
  );
}
