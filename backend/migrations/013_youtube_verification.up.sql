-- UP Migration: 013_youtube_verification

ALTER TABLE temples
ADD COLUMN youtube_channel_url VARCHAR,
ADD COLUMN youtube_channel_id VARCHAR,
ADD COLUMN youtube_channel_name VARCHAR,
ADD COLUMN youtube_channel_handle VARCHAR,
ADD COLUMN youtube_channel_logo VARCHAR,
ADD COLUMN youtube_verification_status VARCHAR DEFAULT 'PENDING',
ADD COLUMN last_verified_at TIMESTAMPTZ;
