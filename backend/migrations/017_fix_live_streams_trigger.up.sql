-- UP Migration: 017_fix_live_streams_trigger

-- The trigger_set_timestamp function attempts to update NEW.updated_at.
-- However, the live_streams table originally used last_updated_at.
-- We rename it to updated_at to align with the application schema and allow the trigger to work.

ALTER TABLE live_streams RENAME COLUMN last_updated_at TO updated_at;
