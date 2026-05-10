 CREATE TABLE IF NOT EXISTS saved_searches (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filters      JSONB NOT NULL DEFAULT '{}',
  email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id      ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_email_alerts ON saved_searches(email_alerts);