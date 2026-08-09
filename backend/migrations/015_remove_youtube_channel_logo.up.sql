-- Up Migration: Remove youtube_channel_logo from temples

ALTER TABLE temples
DROP COLUMN IF EXISTS youtube_channel_logo;
