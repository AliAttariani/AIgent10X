import {
	type AutomationRunInput,
	type AutomationRunLogEntry,
	type AutomationRunMetrics,
	type AutomationRunResult,
	type Lead,
} from "@/agents/types";

const FALLBACK_LEAD_SOURCES: Array<Lead["source"]> = ["webform", "partner", "chat", "event", "referral"];

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

function buildMetricsAndLogs(allLeads: Lead[], qualified: Lead[]): {
	metrics: AutomationRunMetrics;
	logs: AutomationRunLogEntry[];
} {
	const inboundLeadsProcessed = allLeads.length;
	const qualifiedLeads = qualified.length;
	const meetingsBooked = Math.round(qualifiedLeads * 0.5);
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

function generateSimulatedLeads(count: number): Lead[] {
	return Array.from({ length: count }, (_, index) => {
		const source = FALLBACK_LEAD_SOURCES[index % FALLBACK_LEAD_SOURCES.length];
		const id = `demo-lead-${index + 1}`;

		return {
			id,
			name: `Demo Lead ${index + 1}`,
			email: `contact${index + 1}@example${index % 3}.com`,
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
	const { metrics, logs } = buildMetricsAndLogs(leads, qualified);

	const summary = leads.length
		? `Processed ${metrics.inboundLeadsProcessed} inbound leads, qualified ${metrics.qualifiedLeads}, and booked ${metrics.meetingsBooked} meetings automatically.`
		: "No leads were provided for this run.";

	return {
		slug: "lead-flow-autopilot",
		title: "Lead Flow simulated run",
		summary,
		metrics,
		logs,
	};
}
