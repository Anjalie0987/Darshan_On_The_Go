-- UP Migration: 014_livestream_temple_relation

ALTER TABLE temples
ADD COLUMN is_live BOOLEAN DEFAULT false,
ADD COLUMN last_live_check_at TIMESTAMPTZ;

-- Add temple_id to live_streams and make channel_id nullable
ALTER TABLE live_streams
ADD COLUMN temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
ALTER COLUMN channel_id DROP NOT NULL;
