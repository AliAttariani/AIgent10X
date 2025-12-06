import { NextRequest, NextResponse } from "next/server";

import { agentSubmissionSchema, type AgentSubmissionInput } from "@/lib/agents/schema";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          formErrors: ["Invalid JSON body"],
          fieldErrors: {},
        },
      },
      { status: 400 }
    );
  }

  const parsed = agentSubmissionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const payload: AgentSubmissionInput = parsed.data;
  void payload; // TODO: Hook up to persistence layer.

  const agentId = crypto.randomUUID();

  return NextResponse.json(
    {
      success: true,
      agentId,
      status: "pending_review" as const,
    },
    { status: 201 }
  );
}
