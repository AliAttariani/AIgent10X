import { runLeadFlowAutopilotDemo } from "@/lib/automations/lead-flow-autopilot";
import type { AutomationDemoResult } from "@/lib/demo/types";

export async function runAutomationDemo(slug: string): Promise<AutomationDemoResult> {
  switch (slug) {
    case "lead-flow-autopilot":
      return runLeadFlowAutopilotDemo();
    default:
      throw new Error(`Demo not available for automation "${slug}".`);
  }
}
