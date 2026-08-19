DROP TABLE IF EXISTS notifications CASCADE;
DROP INDEX IF EXISTS idx_notification_user_id;
CREATE TABLE IF NOT EXISTS notifications (
    notification_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mail_id                     UUID NOT NULL REFERENCES mails(mail_id) ON DELETE CASCADE,
    notification_type           VARCHAR(20) NOT NULL CHECK (notification_type IN ('message', 'listing-update')),
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_seen                     BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_notification_id ON notifications(mail_id);