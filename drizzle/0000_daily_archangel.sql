-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "property" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"content" text,
	"parent_id" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"rules_id" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"permissions" jsonb,
	CONSTRAINT "rules_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_parent_id_property_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_rules_id_rules_id_fk" FOREIGN KEY ("rules_id") REFERENCES "public"."rules"("id") ON DELETE set null ON UPDATE no action;
*/