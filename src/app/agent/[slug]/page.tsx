import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getManagedAutomationBySlug } from "@/data/automations";
import { AgentDetailClient } from "./AgentDetailClient";

type AgentPageParams = { slug: string };

interface AgentPageProps {
  params: Promise<AgentPageParams> | AgentPageParams;
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
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
  const { slug } = await Promise.resolve(params);
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

  return <AgentDetailClient automation={automation} detailContent={detailContent} showBackLink />;
}
