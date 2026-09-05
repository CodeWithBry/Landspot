CREATE TABLE IF NOT EXISTS followers (
    follower_id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    follower_profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    time_followed TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (profile_id, follower_profile_id),
    CHECK (profile_id <> follower_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_follower_id ON followers(follower_id);