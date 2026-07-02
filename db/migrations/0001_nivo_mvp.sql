CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN CREATE TYPE company_status AS ENUM ('active', 'setup', 'waiting_for_content', 'waiting_for_payment', 'suspended', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE plan AS ENUM ('basic'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('super_admin', 'client_admin', 'client_user'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quote_sent', 'won', 'completed', 'lost'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE customer_status AS ENUM ('new_contact', 'prospect', 'customer', 'past_customer', 'inactive'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE sms_type AS ENUM ('contractor_new_lead', 'customer_auto_reply', 'google_review_request', 'campaign_sms', 'test_sms'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE sms_status AS ENUM ('pending', 'sent', 'delivered', 'failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE review_request_status AS ENUM ('pending', 'sent', 'failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE campaign_type AS ENUM ('sms', 'referral', 'google_ads', 'facebook_ads', 'instagram_ads', 'tiktok_ads'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE campaign_status AS ENUM ('draft', 'prepared', 'active', 'paused', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE website_request_status AS ENUM ('new', 'in_progress', 'waiting_for_info', 'waiting_for_approval', 'completed', 'closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE request_priority AS ENUM ('low', 'normal', 'high', 'urgent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE support_ticket_status AS ENUM ('new', 'in_progress', 'waiting_for_info', 'completed', 'closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE service_type AS ENUM ('basic_plan', 'ai_addon', 'google_business_profile', 'seo', 'advertising', 'website_changes', 'campaigns', 'referral_system'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE billing_type AS ENUM ('monthly', 'one_time', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE service_status AS ENUM ('not_ordered', 'ordered', 'setup', 'waiting_for_data', 'active', 'completed', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  city text,
  domain text,
  status company_status NOT NULL DEFAULT 'setup',
  plan plan NOT NULL DEFAULT 'basic',
  has_ai_addon boolean NOT NULL DEFAULT false,
  google_review_url text,
  website_status text NOT NULL DEFAULT 'V pripravi',
  google_business_profile_status text NOT NULL DEFAULT 'Ni naročeno',
  seo_status text NOT NULL DEFAULT 'Ni naročeno',
  advertising_status text NOT NULL DEFAULT 'Ni naročeno',
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role user_role NOT NULL DEFAULT 'client_user',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS users_company_id_idx ON users(company_id);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  city text,
  notes text,
  source text NOT NULL DEFAULT 'spletni obrazec',
  status customer_status NOT NULL DEFAULT 'new_contact',
  marketing_consent boolean NOT NULL DEFAULT false,
  marketing_consent_at timestamptz,
  marketing_consent_source text,
  opt_out boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS customers_company_id_idx ON customers(company_id);
CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers(phone);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  location text,
  service text NOT NULL,
  message text NOT NULL,
  status lead_status NOT NULL DEFAULT 'new',
  source text NOT NULL DEFAULT 'spletni obrazec',
  ai_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_company_id_idx ON leads(company_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at);

CREATE TABLE IF NOT EXISTS sms_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  phone text NOT NULL,
  message text NOT NULL,
  type sms_type NOT NULL,
  status sms_status NOT NULL DEFAULT 'pending',
  provider text NOT NULL DEFAULT 'mvp_stub',
  cost numeric(10,4),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sms_messages_company_id_idx ON sms_messages(company_id);
CREATE INDEX IF NOT EXISTS sms_messages_lead_id_idx ON sms_messages(lead_id);
CREATE INDEX IF NOT EXISTS sms_messages_created_at_idx ON sms_messages(created_at);

CREATE TABLE IF NOT EXISTS company_sms_settings (
  company_id uuid PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  auto_reply_message text NOT NULL DEFAULT 'Hvala za povpraševanje. Prejeli smo vaše sporočilo in se vam javimo v najkrajšem možnem času.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  phone text NOT NULL,
  review_url text NOT NULL,
  status review_request_status NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS review_requests_company_id_idx ON review_requests(company_id);

CREATE TABLE IF NOT EXISTS review_feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  review_request_id uuid REFERENCES review_requests(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  rating integer NOT NULL,
  name text,
  email text,
  feedback text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS review_feedbacks_company_id_idx ON review_feedbacks(company_id);
CREATE INDEX IF NOT EXISTS review_feedbacks_review_request_id_idx ON review_feedbacks(review_request_id);

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  type campaign_type NOT NULL,
  channel text NOT NULL,
  status campaign_status NOT NULL DEFAULT 'draft',
  message text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaigns_company_id_idx ON campaigns(company_id);

CREATE TABLE IF NOT EXISTS campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  phone text NOT NULL,
  status sms_status NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  error_message text
);

CREATE TABLE IF NOT EXISTS website_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  message text NOT NULL,
  status website_request_status NOT NULL DEFAULT 'new',
  priority request_priority NOT NULL DEFAULT 'normal',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
CREATE INDEX IF NOT EXISTS website_change_requests_company_id_idx ON website_change_requests(company_id);

CREATE TABLE IF NOT EXISTS website_change_request_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES website_change_requests(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE SET NULL,
  message text NOT NULL,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  category text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  status support_ticket_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
CREATE INDEX IF NOT EXISTS support_tickets_company_id_idx ON support_tickets(company_id);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  type service_type NOT NULL,
  price numeric(10,2),
  billing_type billing_type NOT NULL,
  status service_status NOT NULL DEFAULT 'ordered',
  started_at timestamptz,
  completed_at timestamptz,
  notes text
);
CREATE INDEX IF NOT EXISTS services_company_id_idx ON services(company_id);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_company_id_idx ON audit_logs(company_id);

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type text NOT NULL,
  source text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_company_id_idx ON analytics_events(company_id);
