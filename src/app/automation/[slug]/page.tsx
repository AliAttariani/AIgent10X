import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getManagedAutomationBySlug } from "@/data/automations";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const automation = getManagedAutomationBySlug(params.slug);

  if (!automation) {
    return {
      title: "Automation Not Found – PantherIQ",
      description: "Browse managed automations run by PantherIQ.",
    };
  }

  return {
    title: `${automation.name} – PantherIQ`,
    description: automation.heroTagline || automation.summary,
  };
}

export default function AutomationPage({ params }: PageProps) {
  const automation = getManagedAutomationBySlug(params.slug);

  if (!automation) {
    return notFound();
  }

  const heroCopy = automation.heroTagline || automation.summary;
  const supportingCopy = automation.outcomeSummary || automation.summary;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-24 pt-12 text-foreground md:px-6">
      <section className="grid gap-10 rounded-3xl border border-border bg-card px-6 py-8 shadow-sm lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide">
            <Badge variant="outline">{automation.primaryOutcomeLabel}</Badge>
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              {automation.planType === "managed" ? "Managed plan" : automation.planType}
            </span>
            {automation.runByPantherIQ ? (
              <Badge className="bg-black text-white">Run by PantherIQ</Badge>
            ) : null}
            {automation.verified ? (
              <Badge className="bg-emerald-600 text-white">Verified automation</Badge>
            ) : null}
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{automation.name}</h1>
            <p className="text-base text-muted-foreground sm:text-lg">{heroCopy}</p>
            <p className="text-sm text-muted-foreground">{supportingCopy}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {typeof automation.rating === "number" ? (
              <span className="flex items-center gap-1 font-semibold">
                ⭐ {automation.rating.toFixed(1)}
              </span>
            ) : null}
            <span>{automation.price}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/browse" className={buttonVariants({ size: "lg" })}>
              Back to Browse
            </Link>
            <Link
              href="/creator/agents/new"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              Request managed setup
            </Link>
          </div>
        </div>
        <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src={automation.thumbnail ?? "/images/agents/placeholder.jpg"}
            alt={automation.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DetailCard title="Who it's for" items={automation.whoItsFor} />
        <DetailCard title="Measurable outcomes" items={automation.outcomes} />
        <DetailCard title="Included workflows" items={automation.includedWorkflows} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <DetailCard title="Integrations" items={automation.integrations} />
        <DetailCard title="Metrics & KPIs" items={automation.metrics} />
      </section>

      <section className="rounded-3xl border border-border bg-muted/30 p-6">
        <h3 className="text-lg font-semibold text-foreground">Launch plan (first 2 weeks)</h3>
        <ol className="mt-4 space-y-2 pl-5 text-sm text-muted-foreground">
          {automation.launchPlan.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}

type DetailCardProps = {
  title: string;
  items: string[];
};

function DetailCard({ title, items }: DetailCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
