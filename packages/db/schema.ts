import { pgTable, uuid, text, integer, timestamp, numeric, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('user_role', ['admin', 'student', 'driver']);

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone').unique().notNull(),
  role: roleEnum('role').notNull().default('student'),
  institutionId: uuid('institution_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const drivers = pgTable('drivers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  licenseNumber: text('license_number').unique().notNull(),
  vehicleModel: text('vehicle_model').notNull(),
  vehiclePlate: text('vehicle_plate').unique().notNull(),
  capacity: integer('capacity').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
});

export const routes = pgTable('routes', {
  id: uuid('id').primaryKey().defaultRandom(),
  driverId: uuid('driver_id').references(() => drivers.id).notNull(),
  title: text('title').notNull(),
  startLocation: text('start_location').notNull(),
  endLocation: text('end_location').notNull(),
  price: integer('price').notNull(),
  capacity: integer('capacity').notNull(),
  availableSeats: integer('available_seats').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => profiles.id).notNull(),
  routeId: uuid('route_id').references(() => routes.id).notNull(),
  status: text('status', { enum: ['pending', 'active', 'expired', 'cancelled'] }).default('pending').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  routeId: uuid('route_id').references(() => routes.id).notNull(),
  driverId: uuid('driver_id').references(() => drivers.id).notNull(),
  status: text('status', { enum: ['scheduled', 'driver_waiting', 'in_transit', 'completed', 'absent', 'cancelled'] }).default('scheduled').notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  lastLat: numeric('last_lat'),
  lastLng: numeric('last_lng'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: uuid('resource_id'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
