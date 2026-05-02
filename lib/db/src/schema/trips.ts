import { pgTable, uuid, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const tripsTable = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").notNull().references(() => usersTable.id),
  studentName: text("student_name").notNull(),
  driverId: uuid("driver_id").references(() => usersTable.id),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  driverVehicle: text("driver_vehicle"),
  driverRating: numeric("driver_rating", { precision: 3, scale: 1 }),
  originLat: numeric("origin_lat", { precision: 10, scale: 6 }).notNull(),
  originLng: numeric("origin_lng", { precision: 10, scale: 6 }).notNull(),
  originAddress: text("origin_address").notNull(),
  destLat: numeric("dest_lat", { precision: 10, scale: 6 }).notNull(),
  destLng: numeric("dest_lng", { precision: 10, scale: 6 }).notNull(),
  destAddress: text("dest_address").notNull(),
  status: text("status", {
    enum: ["waiting", "accepted", "pickup", "inprogress", "arrived", "completed", "cancelled"],
  }).notNull().default("waiting"),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  fare: numeric("fare", { precision: 10, scale: 0 }).notNull().default("75000"),
  driverShare: numeric("driver_share", { precision: 10, scale: 0 }),
  appCommission: numeric("app_commission", { precision: 10, scale: 0 }),
  distance: numeric("distance", { precision: 6, scale: 2 }),
  notes: text("notes"),
});

export const insertTripSchema = createInsertSchema(tripsTable).omit({ id: true, startTime: true });
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof tripsTable.$inferSelect;
