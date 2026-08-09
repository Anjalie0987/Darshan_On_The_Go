-- UP Migration: 006_temples

CREATE TABLE temples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  category_id INT REFERENCES temple_categories(id) ON DELETE SET NULL,
  country_id INT REFERENCES countries(id) ON DELETE SET NULL,
  state_id INT REFERENCES states(id) ON DELETE SET NULL,
  city_id INT REFERENCES cities(id) ON DELETE SET NULL,
  address_line VARCHAR,
  pincode VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  meta_title VARCHAR,
  meta_description VARCHAR,
  canonical_url VARCHAR,
  official_website VARCHAR,
  official_email VARCHAR,
  official_phone VARCHAR,
  google_maps_url VARCHAR,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  live_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  status temple_status_enum NOT NULL DEFAULT 'DRAFT',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by_admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER update_temples_updated_at
  BEFORE UPDATE ON temples
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE admin_temples (
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  PRIMARY KEY (admin_id, temple_id)
);
