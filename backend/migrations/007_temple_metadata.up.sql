-- UP Migration: 007_temple_metadata

CREATE TABLE temple_social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL,
  url VARCHAR NOT NULL,
  UNIQUE (temple_id, platform)
);

CREATE TABLE temple_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  url VARCHAR NOT NULL,
  image_type image_type_enum NOT NULL,
  alt_text VARCHAR,
  caption VARCHAR,
  display_order INT NOT NULL DEFAULT 0,
  storage_provider VARCHAR,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE aarti_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME,
  time_zone VARCHAR NOT NULL,
  day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7),
  display_order INT NOT NULL DEFAULT 0,
  notes TEXT
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  event_type event_type_enum NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  banner_image VARCHAR,
  registration_required BOOLEAN NOT NULL DEFAULT FALSE,
  livestream_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  slug VARCHAR UNIQUE NOT NULL
);

CREATE TABLE temple_tags (
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (temple_id, tag_id)
);

CREATE TABLE user_favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, temple_id)
);
