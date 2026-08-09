-- DOWN Migration: 013_youtube_verification

ALTER TABLE temples
DROP COLUMN IF EXISTS youtube_channel_url,
DROP COLUMN IF EXISTS youtube_channel_id,
DROP COLUMN IF EXISTS youtube_channel_name,
DROP COLUMN IF EXISTS youtube_channel_handle,
DROP COLUMN IF EXISTS youtube_channel_logo,
DROP COLUMN IF EXISTS youtube_verification_status,
DROP COLUMN IF EXISTS last_verified_at;
