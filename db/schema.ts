import { pgTable, text, serial, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const apiCredentials = pgTable("api_credentials", {
  id: serial("id").primaryKey(),
  service: text("service").notNull(), // "dialpad" or "netsuite"
  credentials: jsonb("credentials").notNull(),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  callId: text("call_id").notNull().unique(),
  callerNumber: text("caller_number").notNull(),
  customerInfo: jsonb("customer_info"),
  purchaseHistory: jsonb("purchase_history"),
  status: text("status").notNull(), // "pending", "processed", "failed"
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const apiStatus = pgTable("api_status", {
  id: serial("id").primaryKey(),
  service: text("service").notNull().unique(), // "dialpad" or "netsuite"
  status: text("status").notNull(), // "healthy", "degraded", "down"
  lastCheck: timestamp("last_check").defaultNow(),
  errorMessage: text("error_message")
});

export type ApiCredentials = typeof apiCredentials.$inferSelect;
export type CallLog = typeof callLogs.$inferSelect;
export type ApiStatus = typeof apiStatus.$inferSelect;

export const insertCallLogSchema = createInsertSchema(callLogs);
export const selectCallLogSchema = createSelectSchema(callLogs);
