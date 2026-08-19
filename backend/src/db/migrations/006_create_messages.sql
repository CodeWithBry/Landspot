CREATE TABLE IF NOT EXISTS mails (
    mail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_name VARCHAR(255),
    agent_email VARCHAR(255) NOT NULL,
    message_description TEXT NOT NULL DEFAULT '',
    html TEXT NOT NULL,
    subject TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sender_id UUID NOT NULL REFERENCES users(id),
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    is_seen BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_messages_user_id ON mails(user_id);