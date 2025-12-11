"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const docsNav = [
  {
    label: "Onboarding",
    items: [
      { href: "/docs/onboarding/getting-started", label: "Getting started" },
      { href: "/docs/onboarding/workspace-roles", label: "Workspace & roles" },
      { href: "/docs/onboarding/integrations", label: "Connecting integrations" },
      { href: "/docs/onboarding/first-automation", label: "Your first automation" },
      { href: "/docs/onboarding/billing-usage", label: "Billing & usage" },
    ],
  },
  {
    label: "Automation playbooks",
    items: [
      { href: "/docs/playbooks/overview", label: "Overview" },
      { href: "/docs/playbooks/lead-generation", label: "Lead generation automation" },
      { href: "/docs/playbooks/content", label: "Content automation" },
      { href: "/docs/playbooks/customer-support", label: "Customer support automation" },
      { href: "/docs/playbooks/workflow", label: "Workflow automation" },
      { href: "/docs/playbooks/research-analysis", label: "Research & analysis automation" },
    ],
  },
  {
    label: "Ops & admin",
    items: [
      { href: "/docs/ops/workspace-access", label: "Workspace access" },
      { href: "/docs/ops/audit-logs", label: "Audit logs" },
      { href: "/docs/ops/usage-credits", label: "Usage credits" },
      { href: "/docs/ops/monitoring", label: "Monitoring automations" },
      { href: "/docs/ops/runtime-behavior", label: "Runtime behavior" },
      { href: "/docs/ops/incident-response", label: "Incident response" },
    ],
  },
  {
    label: "Security & compliance",
    items: [
      { href: "/docs/security/compliance", label: "Compliance" },
      { href: "/docs/security/data-protection", label: "Data protection" },
      { href: "/docs/security/encryption", label: "Encryption" },
    ],
  },
  {
    label: "Support",
    items: [
      { href: "/docs/support", label: "Support home" },
      { href: "/docs/support/contact", label: "Contact support" },
    ],
  },
  {
    label: "Legal",
    items: [
      { href: "/docs/legal/terms", label: "Terms of service" },
      { href: "/docs/legal/privacy", label: "Privacy policy" },
    ],
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-8">
      {docsNav.map((section) => (
        <div key={section.label}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{section.label}</h3>

          <ul className="space-y-2">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-1 text-sm transition ${
                      active ? "font-semibold text-black" : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
