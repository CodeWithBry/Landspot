CREATE TABLE IF NOT EXISTS listings (
  num_id        SERIAL UNIQUE,
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  property_type VARCHAR(20) NOT NULL DEFAULT 'condo'
                  CHECK (property_type IN ('house', 'condo', 'apartment', 'lot')),
  price         NUMERIC(15, 2) NOT NULL,
  bedrooms      INT NOT NULL DEFAULT 0,
  bathrooms     INT NOT NULL DEFAULT 0,
  address       TEXT NOT NULL,
  lat           DOUBLE PRECISION NOT NULL,
  lng           DOUBLE PRECISION NOT NULL,
  status        VARCHAR(10) NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'sold', 'inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_agent_id ON listings(agent_id);
CREATE INDEX IF NOT EXISTS idx_listings_status   ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_price    ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_lat_lng  ON listings(lat, lng);
CREATE INDEX IF NOT EXISTS idx_listings_type     ON listings(property_type);