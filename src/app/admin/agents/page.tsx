"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AgentStatus = "Draft" | "Pending" | "Published" | "Rejected";

type AdminAgentRow = {
  id: string;
  name: string;
  creator: string;
  category: string;
  status: AgentStatus;
  rating: number | null;
  featured?: boolean;
};

const defaultRows: AdminAgentRow[] = [
  {
    id: "agt-001",
    name: "Growth Coach Pro",
    creator: "Atlas Collective",
    category: "Marketing",
    status: "Pending",
    rating: 4.8,
  },
  {
    id: "agt-002",
    name: "Support Sage",
    creator: "Hestia Labs",
    category: "Support",
    status: "Draft",
    rating: null,
  },
  {
    id: "agt-003",
    name: "Finance Falcon",
    creator: "LumenOps",
    category: "Finance",
    status: "Published",
    rating: 4.9,
    featured: true,
  },
  {
    id: "agt-004",
    name: "Ops Orbit",
    creator: "Orbit Systems",
    category: "Operations",
    status: "Rejected",
    rating: 4.2,
  },
];

const statusStyles: Record<AgentStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Pending: "bg-amber-100 text-amber-700",
  Published: "bg-emerald-600 text-white",
  Rejected: "bg-destructive text-destructive-foreground",
};

export default function AdminAgentsPage() {
  const [rows, setRows] = useState<AdminAgentRow[]>(defaultRows);

  const handleStatusChange = (id: string, status: AgentStatus) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              status,
              featured: status === "Published" ? row.featured : false,
            }
          : row,
      ),
    );
  };

  const toggleFeatured = (id: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              featured: !row.featured,
              status: row.status === "Published" ? row.status : "Published",
            }
          : row,
      ),
    );
  };

  const publishedCount = useMemo(
    () => rows.filter((row) => row.status === "Published").length,
    [rows],
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 md:px-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Agent moderation
        </h1>
        <p className="text-sm text-muted-foreground">
          Review newly submitted agents, manage their lifecycle, and curate featured listings. {publishedCount} published agents currently live.
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-card p-4 shadow-sm md:p-6">
        <div className="hidden md:block">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="w-[22%]" />
            </colgroup>
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Creator</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80">
              {rows.map((row) => (
                <tr key={row.id} className="align-middle">
                  <td className="py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <span>{row.name}</span>
                      {row.featured ? (
                        <Badge className="bg-primary/15 text-xs font-semibold uppercase tracking-wide text-primary">
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{row.creator}</td>
                  <td className="py-3 text-muted-foreground">{row.category}</td>
                  <td className="py-3">
                    <Badge className={cn("text-xs", statusStyles[row.status])}>{row.status}</Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {row.rating ? (
                      <span className="flex items-center gap-1">
                        <span aria-hidden>⭐</span>
                        <span>{row.rating.toFixed(1)}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.id, "Published")}
                        className={buttonVariants({ size: "sm" })}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.id, "Rejected")}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFeatured(row.id)}
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        {row.featured ? "Unfeature" : "Feature"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 md:hidden">
          {rows.map((row) => (
            <article key={row.id} className="space-y-4 rounded-2xl border border-border bg-background/60 p-4 shadow-sm">
              <header className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-foreground">{row.name}</h2>
                  <Badge className={cn("text-xs", statusStyles[row.status])}>{row.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">By {row.creator}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
                    {row.category}
                  </span>
                  {row.rating ? (
                    <span className="flex items-center gap-1">
                      <span aria-hidden>⭐</span>
                      <span>{row.rating.toFixed(1)}</span>
                    </span>
                  ) : (
                    <span>New</span>
                  )}
                  {row.featured ? (
                    <Badge className="bg-primary/20 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Featured
                    </Badge>
                  ) : null}
                </div>
              </header>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(row.id, "Published")}
                  className={buttonVariants({ size: "sm", className: "justify-center" })}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(row.id, "Rejected")}
                  className={buttonVariants({ variant: "outline", size: "sm", className: "justify-center" })}
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => toggleFeatured(row.id)}
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "justify-center" })}
                >
                  {row.featured ? "Unfeature" : "Feature"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
