import Link from "next/link";

const footerLinks = [
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refunds", label: "Refunds" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:px-6">
        <p>© {year} AIgent10X. All rights reserved.</p>
        <nav className="flex gap-4">
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
