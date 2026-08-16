-- UP Migration: 016_youtube_uploads_playlist

ALTER TABLE temples ADD COLUMN IF NOT EXISTS uploads_playlist_id VARCHAR;
