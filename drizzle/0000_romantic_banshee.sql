CREATE TABLE `lead_flow_run_usage` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`agent_id` varchar(191) NOT NULL,
	`run_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `lead_flow_run_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lead_flow_settings` (
	`agent_id` varchar(191) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`qualification_score_threshold` int NOT NULL,
	`auto_close_low_score_leads` boolean NOT NULL,
	`follow_up_due_in_days` int NOT NULL,
	`default_owner_email` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lead_flow_settings_agent_id` PRIMARY KEY(`agent_id`)
);
--> statement-breakpoint
CREATE INDEX `lead_flow_run_usage_agent_idx` ON `lead_flow_run_usage` (`agent_id`);--> statement-breakpoint
CREATE INDEX `lead_flow_run_usage_agent_run_idx` ON `lead_flow_run_usage` (`agent_id`,`run_at`);