CREATE TABLE IF NOT EXISTS profiles (
    profile_id          UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name           VARCHAR(100) NOT NULL,
    role                VARCHAR(10) NOT NULL CHECK (role IN ('buyer', 'agent')),
    email               VARCHAR(255),
    first_name          VARCHAR(255),
    last_name           VARCHAR(255),
    phone_number        VARCHAR(30),
    bio                 TEXT,
    facebook_acc        TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_id ON profiles(profile_id);

