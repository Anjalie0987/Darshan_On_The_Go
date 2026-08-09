-- UP Migration: 004_lookup_tables

CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE states (
  id SERIAL PRIMARY KEY,
  country_id INT NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  state_id INT NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL
);

CREATE TABLE temple_categories (
  id SERIAL PRIMARY KEY,
  parent_category_id INT REFERENCES temple_categories(id) ON DELETE SET NULL,
  name VARCHAR UNIQUE NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE streaming_providers (
  id SERIAL PRIMARY KEY,
  provider_name VARCHAR UNIQUE NOT NULL,
  provider_code VARCHAR UNIQUE NOT NULL,
  api_base_url VARCHAR,
  documentation_url VARCHAR,
  supports_live_detection BOOLEAN NOT NULL DEFAULT FALSE,
  supports_embeds BOOLEAN NOT NULL DEFAULT FALSE,
  supports_chat BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE global_settings (
  key VARCHAR PRIMARY KEY,
  value JSONB NOT NULL,
  type VARCHAR NOT NULL,
  description VARCHAR,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_global_settings_updated_at
  BEFORE UPDATE ON global_settings
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
