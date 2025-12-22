CREATE TABLE `lead_flow_settings_snapshots` (
	`id` varchar(191) NOT NULL,
	`agent_id` varchar(191) NOT NULL,
	`settings_json` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `lead_flow_settings_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `lead_flow_settings_snapshots_agent_idx` ON `lead_flow_settings_snapshots` (`agent_id`);
--> statement-breakpoint
CREATE INDEX `lead_flow_settings_snapshots_created_idx` ON `lead_flow_settings_snapshots` (`created_at`);
