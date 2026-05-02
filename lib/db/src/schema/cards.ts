import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const subscriptionCardsTable = pgTable("subscription_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  plan: text("plan", { enum: ["basic", "standard", "premium"] }).notNull(),
  durationMonths: integer("duration_months").notNull().default(1),
  status: text("status", { enum: ["unused", "activated", "expired"] }).notNull().default("unused"),
  activatedBy: uuid("activated_by").references(() => usersTable.id),
  activatedAt: timestamp("activated_at"),
  driverId: uuid("driver_id").references(() => usersTable.id),
  cardExpiresAt: timestamp("card_expires_at"),
  batchId: text("batch_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCardSchema = createInsertSchema(subscriptionCardsTable).omit({
  id: true,
  createdAt: true,
  status: true,
  activatedBy: true,
  activatedAt: true,
});
export type InsertCard = z.infer<typeof insertCardSchema>;
export type SubscriptionCard = typeof subscriptionCardsTable.$inferSelect;
