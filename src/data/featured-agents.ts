import type { AgentCardProps, AgentPricingType } from "@/components/agent-card";
import type { AgentSummary } from "@/types/agents";

export interface FeaturedAgent extends AgentCardProps, AgentSummary {
  category: string;
  pricingType: AgentPricingType;
  launchOrder: number;
}

export const featuredAgents: FeaturedAgent[] = [
  {
    id: "automation-1",
    slug: "lead-flow-autopilot",
    title: "Lead Flow Autopilot",
    tagline: "Turns inbound interest into qualified pipeline with automatic follow-up.",
    price: "Managed plan",
    rating: 4.9,
    verified: true,
    thumbnail: "/images/agents/placeholder.jpg",
    category: "Lead generation",
    pricingType: "subscription",
    launchOrder: 6,
  },
  {
    id: "automation-2",
    slug: "inbox-triage-copilot",
    title: "Inbox Triage Copilot",
    tagline: "Summarizes and routes tickets so your team handles what matters.",
    price: "Managed plan",
    rating: 4.8,
    verified: true,
    thumbnail: "/images/agents/placeholder.jpg",
    category: "Customer support",
    pricingType: "subscription",
    launchOrder: 5,
  },
  {
    id: "automation-3",
    slug: "content-engine-lite",
    title: "Content Engine Lite",
    tagline: "Plans and drafts weekly social + email content from your offers.",
    price: "Managed plan",
    rating: 4.7,
    verified: true,
    thumbnail: "/images/agents/placeholder.jpg",
    category: "Content automation",
    pricingType: "subscription",
    launchOrder: 4,
  },
  {
    id: "automation-4",
    slug: "churn-rescue-follow-up",
    title: "Churn Rescue Follow-up",
    tagline: "Re-engages at-risk customers with intelligent outreach sequences.",
    price: "Managed plan",
    rating: 4.8,
    verified: true,
    thumbnail: "/images/agents/placeholder.jpg",
    category: "Workflow automation",
    pricingType: "subscription",
    launchOrder: 3,
  },
];
