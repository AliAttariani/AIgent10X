import {
  boolean,
  datetime,
  index,
  int,
  longtext,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const leadFlowSettingsTable = mysqlTable("lead_flow_settings", {
  agentId: varchar("agent_id", { length: 191 }).primaryKey(),
  enabled: boolean("enabled").notNull().default(true),
  qualificationScoreThreshold: int("qualification_score_threshold").notNull(),
  autoCloseLowScoreLeads: boolean("auto_close_low_score_leads").notNull(),
  followUpDueInDays: int("follow_up_due_in_days").notNull(),
  defaultOwnerEmail: varchar("default_owner_email", { length: 191 }),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
});

export type LeadFlowSettingsRow = typeof leadFlowSettingsTable.$inferSelect;
export type LeadFlowSettingsInsert = typeof leadFlowSettingsTable.$inferInsert;

export const leadFlowRunUsageTable = mysqlTable(
  "lead_flow_run_usage",
  {
    id: serial("id").primaryKey(),
    agentId: varchar("agent_id", { length: 191 }).notNull(),
    runAt: timestamp("run_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    agentIdx: index("lead_flow_run_usage_agent_idx").on(table.agentId),
    agentRunIdx: index("lead_flow_run_usage_agent_run_idx").on(table.agentId, table.runAt),
  }),
);

export type LeadFlowRunUsageRow = typeof leadFlowRunUsageTable.$inferSelect;
export type LeadFlowRunUsageInsert = typeof leadFlowRunUsageTable.$inferInsert;

export const leadFlowRunIdempotencyTable = mysqlTable(
  "lead_flow_run_idempotency",
  {
    id: serial("id").primaryKey(),
    agentId: varchar("agent_id", { length: 191 }).notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 191 }).notNull(),
    status: mysqlEnum("status", ["in_progress", "succeeded", "failed"]).notNull(),
    requestHash: varchar("request_hash", { length: 191 }),
    responseJson: text("response_json"),
    errorJson: text("error_json"),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
  },
  (table) => ({
    agentKeyUniqueIdx: uniqueIndex("lead_flow_run_idempotency_agent_key_idx").on(
      table.agentId,
      table.idempotencyKey,
    ),
    agentIdx: index("lead_flow_run_idempotency_agent_idx").on(table.agentId),
  }),
);

export type LeadFlowRunIdempotencyRow = typeof leadFlowRunIdempotencyTable.$inferSelect;
export type LeadFlowRunIdempotencyInsert = typeof leadFlowRunIdempotencyTable.$inferInsert;

export const leadFlowSettingsSnapshotsTable = mysqlTable(
  "lead_flow_settings_snapshots",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    agentId: varchar("agent_id", { length: 191 }).notNull(),
    settingsJson: longtext("settings_json").notNull(),
    createdAt: datetime("created_at").notNull(),
  },
  (table) => ({
    agentIdx: index("lead_flow_settings_snapshots_agent_idx").on(table.agentId),
    createdIdx: index("lead_flow_settings_snapshots_created_idx").on(table.createdAt),
  }),
);

export type LeadFlowSettingsSnapshotRow = typeof leadFlowSettingsSnapshotsTable.$inferSelect;
export type LeadFlowSettingsSnapshotInsert = typeof leadFlowSettingsSnapshotsTable.$inferInsert;
