import { runLeadFlowAutopilotDemo } from "./automations/lead-flow-autopilot";
import type { AutomationDemoResult } from "./demo/types";

export type AutomationSlug = "lead-flow-autopilot" | "inbox-triage-copilot";

export type AutomationRunMode = "simulate" | "live";

export interface AutomationRunMetrics {
  inboundLeadsProcessed: number;
  qualifiedLeads: number;
  meetingsBooked: number;
  hoursSaved: number;
}

export interface AutomationRunResponse {
  slug: AutomationSlug;
  mode: AutomationRunMode;
  summary: string;
  metrics: AutomationRunMetrics;
  actionsExecuted: string[];
  rawOutput?: unknown;
}

export type AutomationDemoInput = {
  seedEmailCount?: number;
  seedLeadCount?: number;
};

export interface AutomationMetadata {
  slug: AutomationSlug;
  name: string;
  category: "lead" | "support" | "content" | "ops";
  planType: "managed";
  runDemo: (input: AutomationDemoInput) => Promise<AutomationDemoResult>;
}

export type AutomationDefinition = AutomationMetadata;

const automations: AutomationDefinition[] = [
  {
    slug: "lead-flow-autopilot",
    name: "Lead Flow Autopilot",
    category: "lead",
    planType: "managed",
    runDemo: async (input) => {
      const seedLeadCount = input.seedLeadCount ?? 25;
      return runLeadFlowAutopilotDemo(seedLeadCount);
    },
  },
  {
    slug: "inbox-triage-copilot",
    name: "Inbox Triage Copilot",
    category: "support",
    planType: "managed",
    runDemo: async (input) => {
      const seedEmailCount = Math.max(20, input.seedEmailCount ?? 140);
      const ticketsTriaged = Math.round(seedEmailCount * 0.82);
      const slaAdherence = 0.95;
      const csatDelta = "+0.6";
      const backlogReduction = `${Math.round(ticketsTriaged * 0.3)} tickets`;

      return {
        ok: true,
        title: "Support queues stabilized",
        summary: `Cleared ${ticketsTriaged} of ${seedEmailCount} inbound conversations, keeping SLA adherence at ${Math.round(slaAdherence * 100)}% and nudging CSAT up by ${csatDelta}. Backlog dropped by ${backlogReduction}.`,
        metrics: [
          { label: "Tickets triaged", value: ticketsTriaged.toString() },
          { label: "SLA adherence", value: `${Math.round(slaAdherence * 100)}%` },
          { label: "CSAT trend", value: csatDelta },
          { label: "Backlog reduction", value: backlogReduction },
        ],
        debug: {
          seedEmailCount,
          ticketsTriaged,
          slaAdherence,
          csatDelta,
          backlogReduction,
        },
      };
    },
  },
];

export function getAutomationBySlug(slug: string): AutomationDefinition | null {
  return automations.find((automation) => automation.slug === slug) ?? null;
}
