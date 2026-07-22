DO $$ BEGIN
  CREATE TYPE outreach_status AS ENUM ('queued', 'sent', 'delivered', 'bounced', 'failed', 'replied');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outreach_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"recipient_name" text,
	"email" text NOT NULL,
	"activity" text,
	"town" text,
	"subject" text NOT NULL,
	"campaign" text DEFAULT 'maribor-okolica' NOT NULL,
	"resend_id" text,
	"status" "outreach_status" DEFAULT 'queued' NOT NULL,
	"error" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "outreach_messages_status_idx" ON "outreach_messages" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "outreach_messages_created_at_idx" ON "outreach_messages" USING btree ("created_at");
