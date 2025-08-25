ALTER TABLE "dockies" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "dockies" ADD COLUMN "cat" text;--> statement-breakpoint
ALTER TABLE "dockies" ADD COLUMN "is_public" integer;--> statement-breakpoint
ALTER TABLE "dockies" ADD COLUMN "tree_id" integer;--> statement-breakpoint
ALTER TABLE "dockies" ADD CONSTRAINT "dockies_tree_id_property_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."property"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dockies" ADD CONSTRAINT "dockies_slug_unique" UNIQUE("slug");