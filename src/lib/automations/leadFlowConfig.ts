export type LeadTier = "A" | "B" | "C";

export interface TaskTemplateConfig {
	defaultDueInDays: number;
	subjectTemplate: string;
	bodyTemplate: string;
}

export interface LeadFlowConfig {
	minQualifiedScore: number;
	scoring: {
		emailPresentBonus: number;
		companyPresenceBonus: number;
		jobTitlePresenceBonus: number;
		highIntentSources: string[];
		highIntentSourceBonus: number;
	};
	qualification: {
		tierThresholds: {
			A: number;
			B: number;
		};
	};
	deal: {
		createWhenTierIn: LeadTier[];
		defaultPipelineStage: string;
		pipeline: string;
		baseAmount: number;
		tierMultipliers: Record<LeadTier, number>;
	};
	tasks: {
		followUp: TaskTemplateConfig;
		qualificationNote: TaskTemplateConfig;
		disqualify: TaskTemplateConfig;
	};
	summary: {
		hoursSavedPerQualifiedLead: number;
	};
}

export const LEAD_FLOW_DEFAULT_CONFIG: LeadFlowConfig = {
	minQualifiedScore: 60,
	scoring: {
		emailPresentBonus: 30,
		companyPresenceBonus: 20,
		jobTitlePresenceBonus: 20,
		highIntentSources: ["webinar", "website-chat"],
		highIntentSourceBonus: 20,
	},
	qualification: {
		tierThresholds: {
			A: 80,
			B: 60,
		},
	},
	deal: {
		createWhenTierIn: ["A", "B"],
		defaultPipelineStage: "appointmentscheduled",
		pipeline: "default",
		baseAmount: 5000,
		tierMultipliers: {
			A: 2,
			B: 1,
			C: 0.5,
		},
	},
	tasks: {
		followUp: {
			defaultDueInDays: 1,
			subjectTemplate: "Follow up with qualified lead",
			bodyTemplate: "Reach out to {{leadName}} - tier {{tier}}, score {{score}}.",
		},
		qualificationNote: {
			defaultDueInDays: 2,
			subjectTemplate: "Log qualification notes",
			bodyTemplate: "{{reason}}",
		},
		disqualify: {
			defaultDueInDays: 3,
			subjectTemplate: "Auto-close or nurture unqualified lead",
			bodyTemplate: "{{reason}}",
		},
	},
	summary: {
		hoursSavedPerQualifiedLead: 0.15,
	},
};
