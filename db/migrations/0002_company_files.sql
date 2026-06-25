ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS logo_key text,
  ADD COLUMN IF NOT EXISTS logo_name text;

CREATE TABLE IF NOT EXISTS company_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  uploaded_by_id uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_key text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  custom_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS company_documents_company_id_idx ON company_documents(company_id);
CREATE INDEX IF NOT EXISTS company_documents_created_at_idx ON company_documents(created_at);
