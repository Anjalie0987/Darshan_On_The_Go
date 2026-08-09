-- DOWN Migration: 004_lookup_tables

DROP TRIGGER IF EXISTS update_global_settings_updated_at ON global_settings;
DROP TABLE IF EXISTS global_settings;
DROP TABLE IF EXISTS streaming_providers;
DROP TABLE IF EXISTS temple_categories;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS countries;
