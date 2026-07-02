CREATE TABLE IF NOT EXISTS contact_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Pošljite povpraševanje',
  intro text NOT NULL DEFAULT 'Opišite, kaj potrebujete, in kontaktirali vas bomo v najkrajšem možnem času.',
  submit_label text NOT NULL DEFAULT 'Pošlji povpraševanje',
  success_message text NOT NULL DEFAULT 'Hvala za povpraševanje. Prejeli smo vaše sporočilo.',
  fields jsonb NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_forms_company_id_idx ON contact_forms(company_id);
