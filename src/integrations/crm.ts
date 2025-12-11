export type CrmProvider = "mock";

export interface CrmLead {
	id?: string;
	email: string;
	name?: string;
	company?: string;
	score?: number;
	ownerId?: string;
	source?: string;
	notes?: string;
}

export interface CrmMeetingOptions {
	title: string;
	scheduledFor: Date;
	durationMinutes?: number;
	location?: string;
}

export interface CrmTimelineEvent {
	leadEmail: string;
	message: string;
	createdAt?: Date;
}

export interface CrmClient {
	createOrUpdateLead(lead: CrmLead): Promise<CrmLead>;
	createMeeting(lead: CrmLead, options: CrmMeetingOptions): Promise<{ id: string }>;
	appendTimelineEvent(event: CrmTimelineEvent): Promise<void>;
}

/**
 * Very small in-memory CRM implementation.
 * This is used for:
 *  - Live demos
 *  - Local development
 *  - Unit tests
 *
 * Later we can plug in real providers (HubSpot, Pipedrive, Salesforce, Close, etc.)
 * behind the same CrmClient interface.
 */
class InMemoryCrmClient implements CrmClient {
	private leads: CrmLead[] = [];
	private meetings: Array<{ id: string; leadEmail: string }> = [];
	private events: CrmTimelineEvent[] = [];

	async createOrUpdateLead(lead: CrmLead): Promise<CrmLead> {
		const existing = this.leads.find((l) => l.email.toLowerCase() === lead.email.toLowerCase());
		if (existing) {
			Object.assign(existing, lead);
			this.log("Updated lead in mock CRM", existing);
			return existing;
		}

		const created: CrmLead = {
			...lead,
			id: `mock-lead-${this.leads.length + 1}`,
		};
		this.leads.push(created);
		this.log("Created lead in mock CRM", created);
		return created;
	}

	async createMeeting(lead: CrmLead, options: CrmMeetingOptions): Promise<{ id: string }> {
		const id = `mock-meeting-${this.meetings.length + 1}`;
		this.meetings.push({
			id,
			leadEmail: lead.email,
		});

		this.log("Created meeting in mock CRM", {
			meetingId: id,
			leadEmail: lead.email,
			options,
		});

		return { id };
	}

	async appendTimelineEvent(event: CrmTimelineEvent): Promise<void> {
		const stored: CrmTimelineEvent = {
			...event,
			createdAt: event.createdAt ?? new Date(),
		};
		this.events.push(stored);
		this.log("Appended timeline event in mock CRM", stored);
	}

	// For now just log to the server console.
	// In real life we might stream this into a debug log collector.
	private log(message: string, payload: unknown) {
		console.log(`[MockCRM] ${message}`, payload);
	}
}

// Single instance reused across requests in dev/demo.
// Good enough for live demo flows.
const inMemoryCrmClient = new InMemoryCrmClient();

/**
 * Later this will:
 *  - Look up tenant configuration
 *  - Decide which provider (HubSpot, Pipedrive, etc.)
 *  - Instantiate the right CrmClient implementation with API keys
 *
 * For now we always return the in-memory mock client.
 */
export function getCrmClientForTenant(tenantId: string): CrmClient {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const _ignored = tenantId;
	return inMemoryCrmClient;
}

export type { CrmLead as LeadRecord };
