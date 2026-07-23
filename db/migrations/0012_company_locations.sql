ALTER TABLE "companies"
  ADD COLUMN IF NOT EXISTS "country" text NOT NULL DEFAULT 'SI',
  ADD COLUMN IF NOT EXISTS "service_areas" jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE "companies"
SET "country" = 'SI'
WHERE "country" IS NULL OR "country" = '';

CREATE INDEX IF NOT EXISTS "companies_country_status_idx"
  ON "companies" ("country", "status");
