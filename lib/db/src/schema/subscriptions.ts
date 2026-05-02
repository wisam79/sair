import { pgTable, uuid, text, boolean, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").notNull().references(() => usersTable.id),
  driverId: uuid("driver_id").notNull().references(() => usersTable.id),
  driverName: text("driver_name").notNull(),
  plan: text("plan", { enum: ["basic", "standard", "premium"] }).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  monthlyFare: numeric("monthly_fare", { precision: 10, scale: 0 }).notNull(),
  tripsPerMonth: integer("trips_per_month").notNull(),
  tripsUsed: integer("trips_used").default(0).notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ id: true, startDate: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;
