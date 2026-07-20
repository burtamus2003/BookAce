ALTER TABLE "books" ADD COLUMN "condition" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "format" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "edition" text;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "signed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "reading_status" text DEFAULT 'unread' NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "rating" smallint;