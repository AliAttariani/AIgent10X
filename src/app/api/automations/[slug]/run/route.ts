// src/app/api/automations/[slug]/run/route.ts

import { NextResponse } from "next/server";
import {
  runLeadFlowAutopilot,
  type LeadFlowRunRequest,
} from "@/lib/automations/lead-flow-autopilot";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const SUPPORTED_RUN_AUTOMATIONS = new Set<string>(["lead-flow-autopilot"]);

export async function POST(req: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!SUPPORTED_RUN_AUTOMATIONS.has(slug)) {
    return NextResponse.json(
      { error: `Automation "${slug}" does not expose a run endpoint.` },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    // اگر بدنه‌ی JSON نباشد، باز هم gracefully هندل می‌کنیم
    body = null;
  }

  const leads =
    body && typeof body === "object" && "leads" in body
      ? (body as LeadFlowRunRequest).leads
      : [];

  try {
    const result = await runLeadFlowAutopilot({ leads });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[automation-run] Unexpected error:", error);

    return NextResponse.json(
      { error: "Automation run failed due to an unexpected error. Please try again." },
      { status: 500 },
    );
  }
}
