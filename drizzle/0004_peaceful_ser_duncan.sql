ALTER TABLE "books" ADD COLUMN "loaned_to_name" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "loaned_to_email" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "loaned_at" timestamp with time zone;