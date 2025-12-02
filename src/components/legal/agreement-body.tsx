"use client";

import { BRAND } from "@/config/brand";

export function AgreementBody() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h2>Creator Agreement</h2>
      <p className="text-muted-foreground">
        We wrote this agreement to protect trust between creators and customers on {BRAND.NAME}.
      </p>

      <h3>1. Eligibility and Verification</h3>
      <p>
        You must be at least 18, able to enter a binding contract, and complete creator verification. Keep account info
        accurate and notify us of changes affecting eligibility.
      </p>

      <h3>2. Ownership and Licensing</h3>
      <p>
        You retain ownership of your Agent and materials. By listing on {BRAND.NAME}, you grant us a non-exclusive,
        worldwide, royalty-free license to host, display, and distribute the Agent to operate and market the marketplace,
        including adapting placement assets without changing substantive content.
      </p>

      <h3>3. Compliance and Legal Responsibility</h3>
      <p>
        You are solely responsible for ensuring your Agent, documentation, and connected services comply with applicable
        laws, regulations, platform policies, and third-party terms. If your Agent processes personal data, you must
        provide a clear privacy policy and honor data subject requests.
      </p>

      <h3>4. Indemnification</h3>
      <p>
        You will defend, indemnify, and hold harmless {BRAND.NAME}, its affiliates, and their officers, directors,
        employees, and agents from any claims, damages, liabilities, costs, and expenses (including reasonable legal
        fees) arising from your listings, use of the platform, or breach of this agreement. We will promptly notify you
        of indemnified claims and cooperate in your defense.
      </p>

      <h3>5. Liability Disclaimer</h3>
      <p>
  {BRAND.NAME} provides the marketplace as-is and disclaims all implied warranties. To the maximum extent
        permitted by law, our aggregate liability to you for any claim will not exceed the greater of CAD $100 or the
        fees we have paid you in the twelve months preceding the claim.
      </p>

      <h3>6. Security and Incident Reporting</h3>
      <p>
        You must implement reasonable safeguards to protect customer data and your agent infrastructure. If you
        discover a security incident impacting customers or platform integrity, email {BRAND.SECURITY_EMAIL} within 24
        hours, investigate promptly, and cooperate with remediation. We may suspend listings while an incident is
        addressed.
      </p>

      <h3>7. Delisting and Enforcement</h3>
      <p>
        We may review listings at any time and remove or disable access for policy violations, legal risk, low quality,
        or safety concerns. We will use reasonable efforts to provide notice unless immediate action is required.
        Reinstatement is at our sole discretion and may require additional assurances.
      </p>

      <h3>8. Payments and Refunds</h3>
      <p>
        Payouts follow your creator dashboard schedule and are processed by Stripe. You must honor any guarantees or
        refund policies you advertise and respond to customer support inquiries within three business days. We may offset
        future payouts to reconcile disputes or refunds.
      </p>

      <h3>9. Governing Law and Dispute Resolution</h3>
      <p>
        This agreement is governed by the laws of Canada and the Province of Quebec. Any dispute will be resolved by
        binding arbitration in Montreal, Quebec, conducted in English, before a single arbitrator under applicable rules.
        The award may be entered in any court of competent jurisdiction.
      </p>

      <h3>10. Acceptance</h3>
      <p>
        By submitting content or listings to {BRAND.NAME}, you confirm you have read, understood, and agree to be bound
        by this Creator Agreement. If acting on behalf of an organization, you represent that you have authority to bind
        that organization.
      </p>
    </div>
  );
}
