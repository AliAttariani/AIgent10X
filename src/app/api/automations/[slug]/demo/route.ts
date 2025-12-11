// src/app/api/automations/[slug]/demo/route.ts

import { NextResponse } from "next/server";
import { demoLeadFlowAutopilot } from "@/lib/automations/lead-flow-autopilot";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const SUPPORTED_DEMO_AUTOMATIONS = new Set<string>(["lead-flow-autopilot"]);

export async function POST(_req: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!SUPPORTED_DEMO_AUTOMATIONS.has(slug)) {
    return NextResponse.json(
      { error: `Automation "${slug}" does not expose a demo endpoint.` },
      { status: 400 },
    );
  }

  try {
    const result = await demoLeadFlowAutopilot();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[automation-demo] Unexpected error:", error);

    return NextResponse.json(
      { error: "Live demo failed due to an unexpected error. Please try again." },
      { status: 500 },
    );
  }
}
