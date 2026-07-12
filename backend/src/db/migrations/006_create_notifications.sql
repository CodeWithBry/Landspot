DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message_description TEXT NOT NULL DEFAULT '',
    html TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sender_id UUID NOT NULL REFERENCES users(id),
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    is_seen BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_notification_user_id ON notifications(user_id);