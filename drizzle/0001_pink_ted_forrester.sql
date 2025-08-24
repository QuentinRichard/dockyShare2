CREATE TABLE "dockies_children" (
	"order" integer,
	"parent_id" integer NOT NULL,
	"child_id" integer NOT NULL,
	CONSTRAINT "dockies_children_parent_id_child_id_pk" PRIMARY KEY("parent_id","child_id")
);
--> statement-breakpoint
CREATE TABLE "dockies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" text,
	"data" jsonb,
	"user_id" integer
);
--> statement-breakpoint
ALTER TABLE "property" DROP CONSTRAINT "property_parent_id_property_id_fk";
--> statement-breakpoint
ALTER TABLE "property" DROP CONSTRAINT "property_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "dockies" ADD CONSTRAINT "dockies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;