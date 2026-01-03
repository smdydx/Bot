import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export Auth models
export * from "./models/auth";

// Telegram Users
export const telegramUsers = pgTable("telegram_users", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isActive: boolean("is_active").default(true),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Telegram Messages (Logs)
export const telegramMessages = pgTable("telegram_messages", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull(),
  content: text("content"),
  direction: text("direction").notNull(), // 'inbound' | 'outbound'
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Broadcasts
export const broadcasts = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sentCount: integer("sent_count").default(0),
  failedCount: integer("failed_count").default(0),
  status: text("status").default("completed"), // 'pending' | 'processing' | 'completed'
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertTelegramUserSchema = createInsertSchema(telegramUsers).omit({
  id: true,
  lastActiveAt: true,
  joinedAt: true,
});

export const insertTelegramMessageSchema = createInsertSchema(telegramMessages).omit({
  id: true,
  createdAt: true,
});

export const insertBroadcastSchema = createInsertSchema(broadcasts).omit({
  id: true,
  sentCount: true,
  failedCount: true,
  status: true,
  createdAt: true,
});

// Types
export type TelegramUser = typeof telegramUsers.$inferSelect;
export type InsertTelegramUser = z.infer<typeof insertTelegramUserSchema>;
export type TelegramMessage = typeof telegramMessages.$inferSelect;
export type InsertTelegramMessage = z.infer<typeof insertTelegramMessageSchema>;
export type Broadcast = typeof broadcasts.$inferSelect;
export type InsertBroadcast = z.infer<typeof insertBroadcastSchema>;

// API Request Types
export type SendBroadcastRequest = {
  content: string;
};

// API Response Types
export type StatsResponse = {
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
};
