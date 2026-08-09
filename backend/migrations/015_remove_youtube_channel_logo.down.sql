-- Down Migration: Add back youtube_channel_logo to temples

ALTER TABLE temples
ADD COLUMN IF NOT EXISTS youtube_channel_logo VARCHAR;
