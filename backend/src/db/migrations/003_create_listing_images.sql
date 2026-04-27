 CREATE TABLE IF NOT EXISTS listing_images (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id           UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  cloudinary_url       TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  display_order        INT NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);