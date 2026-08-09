-- DOWN Migration: 008_streaming

DROP TRIGGER IF EXISTS update_live_streams_updated_at ON live_streams;
DROP TABLE IF EXISTS live_streams;
DROP TABLE IF EXISTS temple_streaming_channels;
