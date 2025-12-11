// Legacy route for the OpenAI-powered Lead Flow Autopilot preview.
// New deterministic demo runs live at /api/automations/[slug]/demo but we keep this
// endpoint for deep-dive previews that need the richer model output.
import { NextRequest, NextResponse } from "next/server";
import {
  runLeadFlowAutopilot,
  type LeadFlowInput,
  type LeadRecord,
} from "@/lib/automations/lead-flow-autopilot";

export const dynamic = "force-dynamic";

const SAMPLE_INPUT: LeadFlowInput = {
  companyName: "PantherIQ",
  productDescription:
    "Lead orchestration platform that routes, qualifies, and personalizes follow-up for inbound demand across web, partners, and events.",
  region: "North America",
  leads: [
    {
      id: "lead_web_001",
      name: "Alex Monroe",
      email: "alex@summitops.com",
      company: "SummitOps",
      title: "VP Growth",
      source: "web_form",
      message:
        "We're scaling inbound volume from a new paid campaign and need tighter follow-up within 5 minutes. Can you help automate qualification?",
      createdAt: new Date().toISOString(),
    },
    {
      id: "lead_partner_002",
      name: "Dina Park",
      email: "dina@lumetrix.io",
      company: "Lumetrix",
      title: "Revenue Operations Lead",
      source: "partner_referral",
      message:
        "Referred by Acme Ventures. Interested in routing partner-sourced leads to the right AE while keeping partners in the loop.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "lead_event_003",
      name: "Marcus Reed",
      email: "marcus@northwind.ai",
      company: "Northwind AI",
      title: "Head of Sales",
      source: "event",
      message:
        "Met at SaaStr booth. Need a lightweight SDR assist that drafts follow-ups for smaller inbound accounts. Happy to share CRM access.",
      createdAt: new Date().toISOString(),
    },
  ],
};

function validateInput(body: unknown): { valid: boolean; errors?: string[]; payload?: LeadFlowInput } {
  const errors: string[] = [];

  if (typeof body !== "object" || body === null) {
    return { valid: false, errors: ["Body must be a JSON object"] };
  }

  const payload = body as Partial<LeadFlowInput>;

  if (!payload.companyName || typeof payload.companyName !== "string" || !payload.companyName.trim()) {
    errors.push("companyName is required");
  }

  if (
    !payload.productDescription ||
    typeof payload.productDescription !== "string" ||
    !payload.productDescription.trim()
  ) {
    errors.push("productDescription is required");
  }

  if (!Array.isArray(payload.leads) || payload.leads.length === 0) {
    errors.push("leads must be a non-empty array");
  }

  const leads: LeadRecord[] = [];
  if (Array.isArray(payload.leads)) {
    payload.leads.forEach((lead, index) => {
      if (!lead || typeof lead !== "object") {
        errors.push(`Lead at index ${index} must be an object`);
        return;
      }

      const record = lead as Partial<LeadRecord>;
      const leadErrors: string[] = [];

      if (!record.id || typeof record.id !== "string") {
        leadErrors.push(`Lead ${index} is missing id`);
      }
      if (!record.name || typeof record.name !== "string") {
        leadErrors.push(`Lead ${index} is missing name`);
      }
      if (!record.email || typeof record.email !== "string") {
        leadErrors.push(`Lead ${index} is missing email`);
      }
      if (!record.source || typeof record.source !== "string") {
        leadErrors.push(`Lead ${index} is missing source`);
      }
      if (!record.message || typeof record.message !== "string") {
        leadErrors.push(`Lead ${index} is missing message`);
      }
      if (!record.createdAt || typeof record.createdAt !== "string") {
        leadErrors.push(`Lead ${index} is missing createdAt`);
      }

      if (leadErrors.length > 0) {
        errors.push(...leadErrors);
        return;
      }

      leads.push(record as LeadRecord);
    });
  }

  if (errors.length) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    payload: {
      companyName: payload.companyName!,
      productDescription: payload.productDescription!,
      region: payload.region,
      leads,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { valid, errors, payload } = validateInput(body);

    if (!valid || !payload) {
      return NextResponse.json({ error: "Invalid input", details: errors }, { status: 400 });
    }

    const result = await runLeadFlowAutopilot(payload);
    return NextResponse.json(result);
  } catch (error) {
    const errorId = Date.now().toString();
    console.error("Lead Flow Autopilot API error", errorId, error);
    return NextResponse.json(
      {
        error: "Failed to run Lead Flow Autopilot",
        errorId,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    sampleInput: SAMPLE_INPUT,
    hint: "POST this to /api/automations/lead-flow-autopilot to receive prioritized leads and outreach templates.",
  });
}
