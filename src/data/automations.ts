const DEFAULT_THUMBNAIL = "/images/agents/placeholder.jpg";

export type AutomationCategory =
  | "lead-generation"
  | "customer-support"
  | "content-automation"
  | "sales-follow-up"
  | "workflow-automation"
  | "research-analysis";

export type AutomationPlanType = "demo" | "fixed" | "managed";

export type AutomationDetail = {
  heroTagline: string;
  outcomeSummary: string;
  whoItsFor: string[];
  outcomes: string[];
  workflows: string[];
  integrations: string[];
  metrics: string[];
  launchPlan: string[];
  guaranteeLabel?: string;
};

export interface ManagedAutomation {
  slug: string;
  name: string;
  summary: string;
  category: AutomationCategory;
  planType: "managed";
  price: string;
  rating: number;
  heroTagline: string;
  outcomeSummary: string;
  primaryOutcomeLabel: string;
  runByPantherIQ: boolean;
  verified: boolean;
  thumbnail?: string;
  whoItsFor: string[];
  outcomes: string[];
  includedWorkflows: string[];
  integrations: string[];
  metrics: string[];
  launchPlan: string[];
  guaranteeLabel?: string;
  isFeatured?: boolean;
  launchOrder?: number;
}

export type Automation = ManagedAutomation & {
  detail: AutomationDetail;
  workflows: string[];
  featured?: boolean;
};

const leadFlowDetail: AutomationDetail = {
  heroTagline: "Convert inbound demand into sales-ready pipeline - automatically.",
  outcomeSummary:
    "Automatically converts inbound hand-raises into qualified, sales-ready meetings with 27% higher conversion.",
  whoItsFor: [
    "Growth and demand gen teams juggling multiple inbound channels.",
    "RevOps leaders enforcing routing rules and SLAs.",
    "Agencies accountable for client pipeline targets.",
  ],
  outcomes: [
    "Faster speed-to-lead without adding headcount.",
    "Cleaner CRM records with enrichment baked in.",
    "Higher meeting rates from inbound sources.",
  ],
  workflows: [
    "Lead capture from forms, chat, and partner referrals.",
    "AI-generated follow-up emails and reminders.",
    "Automatic lead qualification and routing to the right owner.",
    "Calendar handoff with warm context for reps.",
  ],
  integrations: [
    "HubSpot, Salesforce, Pipedrive.",
    "Website forms and chat widgets.",
    "Calendly and other calendar tools.",
    "Slack notifications for hot leads.",
  ],
  metrics: [
    "Meetings booked per week and per channel.",
    "Conversion from inbound lead -> qualified opportunity.",
    "Speed-to-first-touch and follow-up completion rates.",
  ],
  launchPlan: [
    "Map current lead sources and routing rules.",
    "Import existing templates and sequences.",
    "Run in \"shadow mode\" for 1-2 weeks to compare outcomes.",
    "Switch to full automation with weekly performance reviews.",
  ],
};

const inboxTriageDetail: AutomationDetail = {
  heroTagline: "AI-first triage that keeps inboxes calm, 24/7.",
  outcomeSummary:
    "AI summarizes context, drafts replies, and resolves Tier-1 support - cutting response times by 50%.",
  whoItsFor: [
    "CX leads covering 24/7 queues with limited headcount.",
    "Ops teams consolidating multiple mailboxes into one view.",
    "B2B SaaS support desks with strict SLAs and premium customers.",
  ],
  outcomes: [
    "Up to 50% faster first-response times across shared inboxes.",
    "Tier-1 coverage without hiring for night shifts or weekends.",
    "Consistent tone and escalation hygiene across the whole team.",
  ],
  workflows: [
    "Ticket intake with sentiment and urgency detection.",
    "Suggested reply drafting using your macros and past tickets.",
    "Smart escalation routing into Slack / Teams and senior queues.",
  ],
  integrations: [
    "Zendesk, Intercom, Front.",
    "Gmail shared inboxes and forwarding rules.",
    "Slack, Microsoft Teams, PagerDuty.",
  ],
  metrics: [
    "SLA adherence for first-response and resolution times.",
    "Backlog volume and time-to-clear for each queue.",
    "CSAT trend and verbatim feedback.",
  ],
  launchPlan: [
    "Intake existing macros, tags, and routing rules.",
    "Calibrate tone and guardrails with your CX lead.",
    "Run in shadow mode while humans approve suggested replies.",
    "Move to full automation with weekly health reports.",
  ],
};

const contentEngineDetail: AutomationDetail = {
  heroTagline: "Weekly content delivered without draining your team.",
  outcomeSummary:
    "Generates weekly on-brand content and maintains your editorial calendar - saving 10+ hours per week.",
  whoItsFor: [
    "Founders and marketers who need consistency, not random bursts.",
    "Small teams without a full-time content writer.",
    "B2B companies that sell on expertise and trust.",
  ],
  outcomes: [
    "Never miss another publishing slot on your content calendar.",
    "3-5x more high-quality drafts for the same internal effort.",
    "Clear alignment between content topics and revenue goals.",
  ],
  workflows: [
    "Monthly content calendar planning from your themes and campaigns.",
    "AI-generated social posts, email copy, and blog outlines.",
    "Repurposing of top posts into multi-channel assets.",
  ],
  integrations: [
    "Notion, Google Docs, or your preferred content hub.",
    "LinkedIn and other social schedulers.",
    "Email tools (HubSpot, Customer.io, Mailchimp).",
  ],
  metrics: [
    "Posts and campaigns published vs. planned.",
    "Engagement and click-through on content assets.",
    "Contribution of content-sourced leads and opportunities.",
  ],
  launchPlan: [
    "Capture ICP, tone of voice, and example assets.",
    "Generate a 4-week pilot content calendar.",
    "Review and approve the first batch of drafts.",
    "Lock in a weekly production cadence with review checkpoints.",
  ],
};

const salesFollowDetail: AutomationDetail = {
  heroTagline: "AI that follows up so reps don't have to.",
  outcomeSummary:
    "Handles multi-step follow-ups that triple reply rates and increase meetings by 22%.",
  whoItsFor: [
    "Account Exec teams without SDR support",
    "RevOps leaders standardizing cadences",
    "Agencies managing outbound for clients",
  ],
  outcomes: [
    "20% lift in reactivated opportunities",
    "Hours saved on manual sequence edits",
    "Real-time notifications on engaged leads",
  ],
  workflows: [
    "Intent monitoring + trigger mapping",
    "Copy refresh + personalization",
    "CRM updates + task creation",
  ],
  integrations: [
    "HubSpot, Salesforce, Pipedrive",
    "Salesloft, Outreach",
    "Slack, email, SMS gateways",
  ],
  metrics: [
    "Reply rate",
    "Pipeline revived",
    "Tasks completed",
  ],
  launchPlan: [
    "Deal review + playbook selection",
    "Connect CRM + sequencing tools",
    "Shadow sends with AE QA",
    "Live automation with scorecards",
  ],
};

const workflowOpsDetail: AutomationDetail = {
  heroTagline: "Replace repetitive ops with automated flows.",
  outcomeSummary:
    "Automates recurring ops tasks, eliminating 40-60% of manual work.",
  whoItsFor: [
    "BizOps and RevOps teams",
    "Project managers coordinating launches",
    "COOs needing reliable reporting",
  ],
  outcomes: [
    "Reliable Monday-morning status packs",
    "Fewer missed handoffs",
    "Automated dependency tracking",
  ],
  workflows: [
    "Task sync between PM + CRM tools",
    "Status digest generation",
    "Escalation routing",
  ],
  integrations: [
    "Asana, ClickUp, Jira",
    "Sheets, Notion, Airtable",
    "Slack and Teams",
  ],
  metrics: [
    "Task completion rate",
    "Blocked item count",
    "Cycle time",
  ],
  launchPlan: [
    "Workflow intake + RACI mapping",
    "System connection + QA",
    "Pilot run with operator supervision",
    "Full automation + weekly retros",
  ],
};

const researchRadarDetail: AutomationDetail = {
  heroTagline: "Insights delivered automatically.",
  outcomeSummary:
    "Replaces manual research with automated insights - saving 10-20 hours weekly.",
  whoItsFor: [
    "Product and research teams",
    "Customer insight leads",
    "Agencies producing client recaps",
  ],
  outcomes: [
    "Hours saved on note consolidation",
    "Faster insight-to-action cycles",
    "Centralized knowledge base",
  ],
  workflows: [
    "Transcript + doc ingestion",
    "Insight tagging + clustering",
    "Brief + action-item distribution",
  ],
  integrations: [
    "Notion, Coda, Confluence",
    "Gong, Zoom, Meet recordings",
    "Slack, email",
  ],
  metrics: [
    "Brief delivery cadence",
    "Action items completed",
    "Stakeholder satisfaction",
  ],
  launchPlan: [
    "Source audit + tagging schema",
    "Connect storage + recording tools",
    "Pilot brief with stakeholder feedback",
    "Steady-state delivery with quarterly tune-ups",
  ],
};

export const managedAutomations: ManagedAutomation[] = [
  {
    slug: "lead-flow-autopilot",
    name: "Lead Flow Autopilot",
    summary:
      "Automatically converts inbound hand-raises into qualified, sales-ready meetings with 27% higher conversion.",
    category: "lead-generation",
    planType: "managed",
    price: "Managed plan",
    rating: 4.9,
    heroTagline: leadFlowDetail.heroTagline,
    outcomeSummary: leadFlowDetail.outcomeSummary,
    primaryOutcomeLabel: "LEAD GENERATION",
    runByPantherIQ: true,
    verified: true,
    thumbnail: DEFAULT_THUMBNAIL,
    whoItsFor: leadFlowDetail.whoItsFor,
    outcomes: leadFlowDetail.outcomes,
    includedWorkflows: leadFlowDetail.workflows,
    integrations: leadFlowDetail.integrations,
    metrics: leadFlowDetail.metrics,
    launchPlan: leadFlowDetail.launchPlan,
    guaranteeLabel: leadFlowDetail.guaranteeLabel,
    isFeatured: true,
    launchOrder: 1,
  },
  {
    slug: "inbox-triage-copilot",
    name: "Inbox Triage Copilot",
    summary:
      "AI summarizes context, drafts replies, and resolves Tier-1 support - cutting response times by 50%.",
    category: "customer-support",
    planType: "managed",
    price: "Managed plan",
    rating: 4.8,
    heroTagline: inboxTriageDetail.heroTagline,
    outcomeSummary: inboxTriageDetail.outcomeSummary,
    primaryOutcomeLabel: "CUSTOMER SUPPORT",
    runByPantherIQ: true,
    verified: true,
    thumbnail: DEFAULT_THUMBNAIL,
    whoItsFor: inboxTriageDetail.whoItsFor,
    outcomes: inboxTriageDetail.outcomes,
    includedWorkflows: inboxTriageDetail.workflows,
    integrations: inboxTriageDetail.integrations,
    metrics: inboxTriageDetail.metrics,
    launchPlan: inboxTriageDetail.launchPlan,
    guaranteeLabel: inboxTriageDetail.guaranteeLabel,
    launchOrder: 2,
  },
  {
    slug: "content-engine-lite",
    name: "Content Engine Lite",
    summary:
      "Generates weekly on-brand content and maintains your editorial calendar - saving 10+ hours per week.",
    category: "content-automation",
    planType: "managed",
    price: "Managed plan",
    rating: 4.7,
    heroTagline: contentEngineDetail.heroTagline,
    outcomeSummary: contentEngineDetail.outcomeSummary,
    primaryOutcomeLabel: "CONTENT AUTOMATION",
    runByPantherIQ: true,
    verified: true,
    thumbnail: DEFAULT_THUMBNAIL,
    whoItsFor: contentEngineDetail.whoItsFor,
    outcomes: contentEngineDetail.outcomes,
    includedWorkflows: contentEngineDetail.workflows,
    integrations: contentEngineDetail.integrations,
    metrics: contentEngineDetail.metrics,
    launchPlan: contentEngineDetail.launchPlan,
    guaranteeLabel: contentEngineDetail.guaranteeLabel,
    launchOrder: 3,
  },
  {
    slug: "sales-follow-up-stream",
    name: "Sales Follow-Up Autopilot",
    summary:
      "Handles multi-step follow-ups that triple reply rates and increase meetings by 22%.",
    category: "sales-follow-up",
    planType: "managed",
    price: "Managed plan",
    rating: 4.8,
    heroTagline: salesFollowDetail.heroTagline,
    outcomeSummary: salesFollowDetail.outcomeSummary,
    primaryOutcomeLabel: "SALES FOLLOW-UP",
    runByPantherIQ: true,
    verified: true,
    thumbnail: DEFAULT_THUMBNAIL,
    whoItsFor: salesFollowDetail.whoItsFor,
    outcomes: salesFollowDetail.outcomes,
    includedWorkflows: salesFollowDetail.workflows,
    integrations: salesFollowDetail.integrations,
    metrics: salesFollowDetail.metrics,
    launchPlan: salesFollowDetail.launchPlan,
    guaranteeLabel: salesFollowDetail.guaranteeLabel,
    launchOrder: 4,
  },
  {
    slug: "workflow-ops-orbit",
    name: "Workflow Automation Hub",
    summary:
      "Automates recurring ops tasks, eliminating 40-60% of manual work.",
    category: "workflow-automation",
    planType: "managed",
    price: "Managed plan",
    rating: 4.6,
    heroTagline: workflowOpsDetail.heroTagline,
    outcomeSummary: workflowOpsDetail.outcomeSummary,
    primaryOutcomeLabel: "WORKFLOW AUTOMATION",
    runByPantherIQ: true,
    verified: true,
    thumbnail: DEFAULT_THUMBNAIL,
    whoItsFor: workflowOpsDetail.whoItsFor,
    outcomes: workflowOpsDetail.outcomes,
    includedWorkflows: workflowOpsDetail.workflows,
    integrations: workflowOpsDetail.integrations,
    metrics: workflowOpsDetail.metrics,
    launchPlan: workflowOpsDetail.launchPlan,
    guaranteeLabel: workflowOpsDetail.guaranteeLabel,
    launchOrder: 5,
  },
  {
    slug: "research-radar",
    name: "Research & Analysis Automation",
    summary:
      "Replaces manual research with automated insights - saving 10-20 hours weekly.",
    category: "research-analysis",
    planType: "managed",
    price: "Managed plan",
    rating: 4.7,
    heroTagline: researchRadarDetail.heroTagline,
    outcomeSummary: researchRadarDetail.outcomeSummary,
    primaryOutcomeLabel: "RESEARCH & ANALYSIS",
    runByPantherIQ: true,
    verified: true,
    thumbnail: DEFAULT_THUMBNAIL,
    whoItsFor: researchRadarDetail.whoItsFor,
    outcomes: researchRadarDetail.outcomes,
    includedWorkflows: researchRadarDetail.workflows,
    integrations: researchRadarDetail.integrations,
    metrics: researchRadarDetail.metrics,
    launchPlan: researchRadarDetail.launchPlan,
    guaranteeLabel: researchRadarDetail.guaranteeLabel,
    launchOrder: 6,
  },
];

const toAutomationDetail = (automation: ManagedAutomation): AutomationDetail => ({
  heroTagline: automation.heroTagline,
  outcomeSummary: automation.outcomeSummary,
  whoItsFor: automation.whoItsFor,
  outcomes: automation.outcomes,
  workflows: automation.includedWorkflows,
  integrations: automation.integrations,
  metrics: automation.metrics,
  launchPlan: automation.launchPlan,
  guaranteeLabel: automation.guaranteeLabel,
});

const toLegacyAutomation = (automation: ManagedAutomation): Automation => ({
  ...automation,
  featured: automation.isFeatured,
  detail: toAutomationDetail(automation),
  workflows: automation.includedWorkflows,
});

export const automations: Automation[] = managedAutomations.map(toLegacyAutomation);

export function getFeaturedAutomation(): Automation {
  return automations.find((automation) => automation.featured) ?? automations[0];
}

export function getManagedAutomationBySlug(
  slug: string,
): ManagedAutomation | undefined {
  return managedAutomations.find((automation) => automation.slug === slug);
}

export function getAutomationBySlug(slug: string): Automation | undefined {
  return automations.find((automation) => automation.slug === slug);
}
