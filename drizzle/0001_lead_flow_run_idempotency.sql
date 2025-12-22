CREATE TABLE `lead_flow_run_idempotency` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`agent_id` varchar(191) NOT NULL,
	`idempotency_key` varchar(191) NOT NULL,
	`status` enum('in_progress','succeeded','failed') NOT NULL,
	`request_hash` varchar(191),
	`response_json` text,
	`error_json` text,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lead_flow_run_idempotency_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lead_flow_run_idempotency_agent_key_idx` ON `lead_flow_run_idempotency` (`agent_id`,`idempotency_key`);
--> statement-breakpoint
CREATE INDEX `lead_flow_run_idempotency_agent_idx` ON `lead_flow_run_idempotency` (`agent_id`);
