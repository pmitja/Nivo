CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  industry text,
  message text,
  status lead_status NOT NULL DEFAULT 'new',
  source text NOT NULL DEFAULT 'obrtio.si/kontakt',
  confirmation_email_sent_at timestamptz,
  confirmation_email_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_inquiries_status_idx
  ON contact_inquiries(status);

CREATE INDEX IF NOT EXISTS contact_inquiries_created_at_idx
  ON contact_inquiries(created_at);
