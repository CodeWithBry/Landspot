CREATE TABLE IF NOT EXISTS profile_images (
    id              UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id      UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    public_id       TEXT NOT NULL PRIMARY KEY,
    photo_url       TEXT NOT NULL,
    created_at      DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profile_id ON profiles(profile_id);