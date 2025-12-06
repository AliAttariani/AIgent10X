import { NextResponse } from "next/server";

import { listAgents } from "@/lib/agents/repository";

export async function GET() {
  const agents = await listAgents({ status: "approved" });
  return NextResponse.json({ agents });
}
