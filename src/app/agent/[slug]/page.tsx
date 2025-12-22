import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManagedAutomationBySlug } from "@/data/automations";
import { getLeadFlowSettings, serializeLeadFlowSettings } from "@/lib/automations/leadFlowSettings";
import { getLeadFlowUsageSummary } from "@/lib/automations/runUsage";
import { AgentDetailClient } from "./AgentDetailClient";

type AgentPageParams = { slug: string };

type AgentPageSearchParams = Record<string, string | string[] | undefined> | undefined;

type AgentPageProps = {
  params: Promise<AgentPageParams>;
  searchParams?: Promise<AgentPageSearchParams>;
};

export async function generateMetadata({ params }: { params: Promise<AgentPageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const automation = getManagedAutomationBySlug(slug);

  if (!automation) {
    return {
      title: "Automation Not Found – AIgent10X",
      description: "Browse verified AI automations on AIgent10X.",
    };
  }

  return {
    title: `${automation.name} – AIgent10X`,
    description: automation.heroTagline || automation.summary,
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const automation = getManagedAutomationBySlug(slug);
  if (!automation) {
    notFound();
  }

  const detailContent = {
    heroTagline: automation.heroTagline,
    heroSummary: automation.outcomeSummary,
    whoItsFor: automation.whoItsFor,
    outcomes: automation.outcomes,
    workflows: automation.includedWorkflows,
    integrations: automation.integrations,
    metrics: automation.metrics,
    launchPlan: automation.launchPlan,
    guaranteeLabel: automation.guaranteeLabel,
  };

  const isLeadFlowAutomation = automation.slug === "lead-flow-autopilot";
  const leadFlowSettings = isLeadFlowAutomation
    ? serializeLeadFlowSettings(await getLeadFlowSettings(automation.slug))
    : null;
  const runUsageSummary = isLeadFlowAutomation
    ? await getLeadFlowUsageSummary(automation.slug)
    : null;

  return (
    <AgentDetailClient
      automation={automation}
      detailContent={detailContent}
      showBackLink
      initialSettings={leadFlowSettings}
      runUsage={runUsageSummary}
    />
  );
}
