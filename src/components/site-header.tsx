"use client";

import Link from "next/link";

const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold">
            AIgent10X
          </Link>
          <nav className="hidden gap-4 text-sm font-medium md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground transition hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/auth/sign-in"
            className="text-muted-foreground transition hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/creator/agents/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
          >
            List your Agent
          </Link>
        </div>
      </div>
    </header>
  );
}
