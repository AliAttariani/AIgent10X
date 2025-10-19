import type { Metadata } from "next";
import type { FeaturedAgent } from "@/data/featured-agents";
import { featuredAgents } from "@/data/featured-agents";
import { AgentDetailClient } from "./AgentDetailClient";

interface AgentPageProps {
  params: { slug: string };
}

function findAgentBySlug(slug: string): (FeaturedAgent & { gallery?: string[] }) | undefined {
  return featuredAgents.find((agent) => agent.slug === slug);
}

export function generateMetadata({ params }: AgentPageProps): Metadata {
  const agent = findAgentBySlug(params.slug);

  if (!agent) {
    return {
      title: "Agent Not Found – AIgent10X",
      description: "Browse verified AI agents on AIgent10X.",
    };
  }

  return {
    title: `${agent.title} – AIgent10X`,
    description: agent.tagline,
  };
}

export default function AgentPage({ params }: AgentPageProps) {
  const agent = findAgentBySlug(params.slug);

  if (!agent) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-24 text-center text-lg font-semibold text-muted-foreground">
        Not found
      </main>
    );
  }

  return <AgentDetailClient agent={agent} />;
}
