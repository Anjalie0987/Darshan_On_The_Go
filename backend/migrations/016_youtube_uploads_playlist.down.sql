-- DOWN Migration: 014_youtube_uploads_playlist

ALTER TABLE temples DROP COLUMN IF EXISTS uploads_playlist_id;
