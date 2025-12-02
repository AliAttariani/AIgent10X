"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";

const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeMap = useMemo(() => {
    return navLinks.reduce<Record<string, boolean>>((acc, link) => {
      acc[link.href] = pathname === link.href;
      return acc;
    }, {});
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="inline-flex h-11 items-center text-lg font-semibold"
          >
            {BRAND.NAME}
          </Link>
          <nav className="hidden gap-4 text-sm font-medium md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex h-11 items-center border-b-2 border-transparent px-1 text-muted-foreground transition hover:text-foreground",
                  activeMap[href] && "border-foreground text-foreground",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SignedOut>
            <Link
              href="/auth/sign-in"
              className="inline-flex h-11 items-center rounded-md px-4 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Sign in
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-10 w-10" } }} />
          </SignedIn>
          <Link
            href="/creator/agents/new"
            className="hidden h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 sm:inline-flex"
          >
            List your Agent
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-full border border-border md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {isMenuOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          role="presentation"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="ml-auto flex h-full w-80 flex-col gap-4 border-l border-border bg-background p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-lg font-semibold text-foreground">Menu</div>
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "inline-flex h-12 items-center rounded-lg px-3 text-base font-medium transition hover:bg-muted",
                    activeMap[href] && "bg-muted text-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/creator/agents/new"
                className="inline-flex h-12 items-center rounded-lg bg-primary px-3 text-base font-semibold text-primary-foreground transition hover:bg-primary/90"
                onClick={() => setIsMenuOpen(false)}
              >
                List your Agent
              </Link>
              <SignedOut>
                <Link
                  href="/auth/sign-in"
                  className="inline-flex h-12 items-center rounded-lg px-3 text-base font-medium text-muted-foreground transition hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
              </SignedOut>
            </nav>
            <Button
              variant="outline"
              className="mt-auto h-11"
              onClick={() => setIsMenuOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
