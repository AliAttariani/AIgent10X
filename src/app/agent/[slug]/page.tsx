import type { Metadata } from "next";
import Link from "next/link";
import type { FeaturedAgent } from "@/data/featured-agents";
import { featuredAgents } from "@/data/featured-agents";
import { AgentDetailClient } from "./AgentDetailClient";

type AgentPageParams = { slug: string };

interface AgentPageProps {
  params: Promise<AgentPageParams>;
}

function findAgentBySlug(slug: string): (FeaturedAgent & { gallery?: string[] }) | undefined {
  return featuredAgents.find((agent) => agent.slug === slug);
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = findAgentBySlug(slug);

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

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = findAgentBySlug(slug);

  if (!agent) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-center px-4 pb-24 pt-16 text-center text-lg font-semibold text-muted-foreground md:px-6">
        <div className="w-full text-left">
          <Link
            href="/browse"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span aria-hidden>←</span>
            Back to Browse
          </Link>
        </div>
        <p className="mt-16">Not found</p>
      </main>
    );
  }

  return <AgentDetailClient agent={agent} showBackLink />;
}
