import {
	type AutomationRunInput,
	type AutomationRunLogEntry,
	type AutomationRunMetrics,
	type AutomationRunResult,
	type Lead,
} from "@/agents/types";
import { getCrmClientForTenant, type LeadRecord as CrmLead } from "@/integrations/crm";
import { getSlackClientForTenant } from "@/integrations/slack";

const FALLBACK_LEAD_SOURCES: Array<Lead["source"]> = ["webform", "partner", "chat", "event", "referral"];

type PlannedMeeting = {
	leadEmail: string;
	scheduledFor: Date;
};

export function scoreLead(lead: Lead): number {
	const source = lead.source.toLowerCase();
	const emailDomain = lead.email.split("@")[1]?.toLowerCase() ?? "";
	const notes = lead.notes?.toLowerCase() ?? "";

	let score = 50;

	if (source.includes("partner") || source.includes("referral")) {
		score += 25;
	} else if (source.includes("event")) {
		score += 10;
	} else if (source.includes("chat")) {
		score += 5;
	}

	if (notes.includes("enterprise") || notes.includes("scaling")) {
		score += 10;
	}

	if (emailDomain.endsWith(".edu") || emailDomain.includes("gmail") || emailDomain.includes("outlook")) {
		score -= 5;
	}

	if (lead.score && Number.isFinite(lead.score)) {
		score = Math.round(0.5 * score + 0.5 * Math.min(100, Math.max(0, lead.score)));
	}

	return Math.min(100, Math.max(0, Math.round(score)));
}

export function qualifyLeads(leads: Lead[]): { qualified: Lead[]; unqualified: Lead[] } {
	const qualified: Lead[] = [];
	const unqualified: Lead[] = [];

	for (const lead of leads) {
		const score = scoreLead(lead);
		const enrichedLead = { ...lead, score };

		if (score >= 70) {
			qualified.push(enrichedLead);
		} else {
			unqualified.push(enrichedLead);
		}
	}

	return { qualified, unqualified };
}

function buildMetricsAndLogs(allLeads: Lead[], qualified: Lead[], meetingsBookedOverride?: number): {
	metrics: AutomationRunMetrics;
	logs: AutomationRunLogEntry[];
} {
	const inboundLeadsProcessed = allLeads.length;
	const qualifiedLeads = qualified.length;
	const meetingsBooked = typeof meetingsBookedOverride === "number" ? meetingsBookedOverride : Math.round(qualifiedLeads * 0.5);
	const hoursSaved = Number((meetingsBooked * 0.175).toFixed(1));

	const now = new Date();
	const iso = () => new Date().toISOString();

	const logs: AutomationRunLogEntry[] = [
		{
			timestamp: now.toISOString(),
			level: "info",
			message: `Processed ${inboundLeadsProcessed} inbound leads.`,
		},
		{
			timestamp: iso(),
			level: "info",
			message: `${qualifiedLeads} leads qualified for follow-up and ${meetingsBooked} meetings booked automatically.`,
		},
	];

	for (const lead of qualified) {
		logs.push({
			timestamp: iso(),
			level: "info",
			message: `Qualified ${lead.name} (${lead.email})`,
			details: {
				score: lead.score,
				source: lead.source,
			},
		});
	}

	const metrics: AutomationRunMetrics = {
		inboundLeadsProcessed,
		qualifiedLeads,
		meetingsBooked,
		hoursSaved,
	};

	return { metrics, logs };
}

function planMeetings(qualified: Lead[], count: number): PlannedMeeting[] {
	if (count <= 0) {
		return [];
	}

	const limit = Math.min(count, qualified.length);
	const baseTime = Date.now() + 60 * 60 * 1000;

	return qualified.slice(0, limit).map((lead, index) => ({
		leadEmail: lead.email,
		scheduledFor: new Date(baseTime + index * 30 * 60 * 1000),
	}));
}

function generateSimulatedLeads(count: number): Lead[] {
	return Array.from({ length: count }, (_, index) => {
		const source = FALLBACK_LEAD_SOURCES[index % FALLBACK_LEAD_SOURCES.length];
		const id = `demo-lead-${index + 1}`;

		return {
			id,
			name: `Demo Lead ${index + 1}`,
			email: `contact${index + 1}@example${index % 3}.com`,
			company: `Example Co ${index + 1}`,
			source,
			notes:
				source === "partner"
					? "Partner referral seeking enterprise routing"
					: source === "chat"
						? "Asked about weekend coverage"
						: "Inbound request for sales walkthrough",
		} satisfies Lead;
	});
}

export async function runLeadFlowAutopilot(input: AutomationRunInput): Promise<AutomationRunResult> {
	const leads: Lead[] = (() => {
		if (input.leads && input.leads.length > 0) {
			return input.leads;
		}

		if (input.simulate) {
			const count = 15;
			return generateSimulatedLeads(count);
		}

		return [];
	})();

	const { qualified } = qualifyLeads(leads);
	const plannedMeetingCount = Math.round(qualified.length * 0.5);
	const meetings = planMeetings(qualified, plannedMeetingCount);
	const { metrics, logs } = buildMetricsAndLogs(leads, qualified, meetings.length);

	const summary = leads.length
		? `Processed ${metrics.inboundLeadsProcessed} inbound leads, qualified ${metrics.qualifiedLeads}, and booked ${metrics.meetingsBooked} meetings automatically.`
		: "No leads were provided for this run.";

	const tenantIdCandidate = input.context?.["tenantId"];
	const tenantId = typeof tenantIdCandidate === "string" ? tenantIdCandidate : undefined;
	const crm = getCrmClientForTenant(tenantId ?? "demo-tenant");

	const crmLeads: CrmLead[] = qualified.map((lead) => ({
		email: lead.email,
		name: lead.name,
		company: lead.company,
		score: lead.score,
		source: lead.source ?? "Lead Flow Autopilot demo",
		notes: lead.notes,
	}));

	const meetingLookup = new Map<string, PlannedMeeting>();
	for (const meeting of meetings) {
		meetingLookup.set(meeting.leadEmail, meeting);
	}

	let meetingsCreated = 0;
	let timelineEvents = 0;

	for (const lead of crmLeads) {
		const saved = await crm.createOrUpdateLead(lead);
		const meetingInfo = meetingLookup.get(lead.email);

		if (meetingInfo) {
			await crm.createMeeting(saved, {
				title: "Intro call – qualified inbound lead",
				scheduledFor: meetingInfo.scheduledFor ?? new Date(),
				durationMinutes: 30,
			});
			meetingsCreated += 1;
		}

		await crm.appendTimelineEvent({
			leadEmail: lead.email,
			message: `Lead Flow Autopilot run: score=${lead.score ?? "n/a"}`,
		});
		timelineEvents += 1;
	}

	const crmSummary = {
		leadsSynced: crmLeads.length,
		meetingsCreated,
		timelineEvents,
	};

	const slack = getSlackClientForTenant(tenantId ?? "demo-tenant");

	await slack.sendMessage({
		channel: "#sales-updates",
		text: `Lead Flow Autopilot finished.\nQualified: ${qualified.length}\nMeetings: ${meetings.length}`,
	});

	const actions = logs.map((log) => log.message);
	actions.push(
		`Synced ${crmSummary.leadsSynced} qualified leads into CRM and created ${crmSummary.meetingsCreated} meetings automatically.`,
	);
	actions.push("Notified sales team in Slack with summary.");

	return {
		slug: "lead-flow-autopilot",
		title: "Lead Flow simulated run",
		summary,
		metrics,
		logs,
		crmSummary,
		actions,
	};
}
