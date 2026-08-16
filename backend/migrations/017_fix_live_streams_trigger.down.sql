-- DOWN Migration: 011_fix_live_streams_trigger

ALTER TABLE live_streams RENAME COLUMN updated_at TO last_updated_at;
