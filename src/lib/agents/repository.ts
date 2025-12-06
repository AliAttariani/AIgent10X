import { Agent, AgentStatus } from "@/types/agents";

export type CreateAgentInput = Omit<Agent, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type ListAgentsOptions = {
  status?: Extract<AgentStatus, "approved" | "pending_review">;
  creatorId?: string;
};

declare global {
  var __agentStore: Agent[] | undefined;
}

const agentStore: Agent[] = globalThis.__agentStore ?? [];
if (!globalThis.__agentStore) {
  globalThis.__agentStore = agentStore;
}

export async function createAgent(input: CreateAgentInput): Promise<Agent> {
  if (agentStore.some((agent) => agent.slug === input.slug)) {
    throw new Error("Agent with this slug already exists");
  }

  const now = new Date();
  const agent: Agent = {
    ...input,
    id: input.id ?? crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  agentStore.push(agent);
  return agent;
}

export async function listAgents(options: ListAgentsOptions = {}): Promise<Agent[]> {
  const { status, creatorId } = options;
  return agentStore.filter((agent) => {
    if (status && agent.status !== status) {
      return false;
    }

    if (creatorId && agent.creatorId !== creatorId) {
      return false;
    }

    return true;
  });
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const agent = agentStore.find((item) => item.slug === slug);
  return agent ?? null;
}
