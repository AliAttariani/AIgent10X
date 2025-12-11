import "@/app/globals.css";
import DocsSidebar from "@/components/docs/DocsSidebar";
import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-white p-6 md:block">
        <DocsSidebar />
      </aside>

      {/* Content Area */}
      <main className="mx-auto flex-1 max-w-4xl p-8">{children}</main>
    </div>
  );
}
