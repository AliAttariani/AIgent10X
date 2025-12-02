import Link from "next/link";

import { BRAND } from "@/config/brand";

const footerLinks = [
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refunds", label: "Refunds" },
  { href: "/security", label: "Security Policy" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:px-6">
        <p className="text-center md:text-left">© {year} {BRAND.NAME}. All rights reserved.</p>
        <nav className="flex flex-wrap justify-center gap-4 md:justify-end">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
