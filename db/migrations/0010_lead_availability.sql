DO $$ BEGIN
  CREATE TYPE lead_pause_reason AS ENUM ('vacation', 'capacity');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS accepting_leads boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS lead_pause_reason lead_pause_reason;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS received_while_paused boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pause_reason lead_pause_reason;
