import { demoLeadFlowAutopilot, type LeadFlowDemoResult } from "@/lib/automations/lead-flow-autopilot";
import type { AutomationDemoResult } from "@/lib/demo/types";

export async function runAutomationDemo(slug: string): Promise<AutomationDemoResult> {
  switch (slug) {
    case "lead-flow-autopilot":
      return mapLeadFlowDemoToAutomationResult(await demoLeadFlowAutopilot());
    default:
      throw new Error(`Demo not available for automation "${slug}".`);
  }
}

function mapLeadFlowDemoToAutomationResult(demo: LeadFlowDemoResult): AutomationDemoResult {
  const { summary } = demo;
  return {
    ok: true,
    title: "Lead Flow Autopilot demo preview",
    summary:
      `Processed ${summary.inboundLeadsProcessed} inbound leads, qualified ${summary.qualifiedLeads}, ` +
      `booked ${summary.meetingsBooked} meetings, saved ${summary.hoursSaved.toFixed(1)} hours.`,
    metrics: [
      { label: "Inbound leads", value: summary.inboundLeadsProcessed.toString() },
      { label: "Qualified", value: summary.qualifiedLeads.toString() },
      { label: "Meetings", value: summary.meetingsBooked.toString() },
      { label: "Hours saved", value: `${summary.hoursSaved.toFixed(1)}h` },
    ],
    actions: summary.actions,
    debug: { demo },
  } satisfies AutomationDemoResult;
}
