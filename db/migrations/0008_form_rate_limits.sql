CREATE TABLE IF NOT EXISTS form_rate_limits (
  key text PRIMARY KEY,
  scope text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_started_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS form_rate_limits_expires_at_idx
  ON form_rate_limits(expires_at);
