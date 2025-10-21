import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 bg-muted/5">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
