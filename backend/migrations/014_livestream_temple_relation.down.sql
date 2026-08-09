-- DOWN Migration: 014_livestream_temple_relation

ALTER TABLE live_streams
DROP COLUMN IF EXISTS temple_id,
ALTER COLUMN channel_id SET NOT NULL;

ALTER TABLE temples
DROP COLUMN IF EXISTS is_live,
DROP COLUMN IF EXISTS last_live_check_at;
