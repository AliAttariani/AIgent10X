export type AgentCategory =
  | "marketing"
  | "finance"
  | "support"
  | "content"
  | "ops"
  | "hr"
  | (string & {});

export type AgentPricingModel = "free" | "one-time" | "subscription";

export type AgentStatus = "draft" | "pending_review" | "approved" | "rejected";

export type Agent = {
  id: string;
  slug: string;
  name: string;
  oneLiner: string;
  description: string;
  category: AgentCategory;
  logoUrl: string | null;
  pricingModel: AgentPricingModel;
  monthlyPrice: number | null;
  trialDays: number | null;
  configJson: string;
  endpointUrl: string;
  scopes: string[];
  status: AgentStatus;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AgentSummary = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  price: string;
  rating?: number;
  verified?: boolean;
  thumbnail: string;
};
