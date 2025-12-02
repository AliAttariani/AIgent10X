export type UserPlan = "free" | "pro";

type MockUser = {
  id: string;
  plan: UserPlan;
  publishedAgents: number;
  maxFreeAgents: number;
};

export const MOCK_USER: MockUser = {
  id: "local-user",
  plan: "free",
  publishedAgents: 1,
  maxFreeAgents: 1,
};
