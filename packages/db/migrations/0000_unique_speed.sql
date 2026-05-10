CREATE TYPE "public"."user_role" AS ENUM('admin', 'student', 'driver');--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"license_number" text NOT NULL,
	"vehicle_model" text NOT NULL,
	"vehicle_plate" text NOT NULL,
	"capacity" integer NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "drivers_license_number_unique" UNIQUE("license_number"),
	CONSTRAINT "drivers_vehicle_plate_unique" UNIQUE("vehicle_plate")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"institution_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_id" uuid NOT NULL,
	"title" text NOT NULL,
	"start_location" text NOT NULL,
	"end_location" text NOT NULL,
	"price" integer NOT NULL,
	"capacity" integer NOT NULL,
	"available_seats" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"route_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_id" uuid NOT NULL,
	"driver_id" uuid NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"started_at" timestamp,
	"ended_at" timestamp,
	"last_lat" numeric,
	"last_lng" numeric
);
--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routes" ADD CONSTRAINT "routes_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_student_id_profiles_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;