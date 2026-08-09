-- UP Migration: 008_streaming

CREATE TABLE temple_streaming_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  provider_id INT NOT NULL REFERENCES streaming_providers(id) ON DELETE CASCADE,
  channel_reference VARCHAR NOT NULL,
  channel_url VARCHAR,
  channel_name VARCHAR,
  channel_thumbnail VARCHAR,
  subscriber_count INT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  priority INT NOT NULL DEFAULT 0,
  api_status api_status_enum NOT NULL DEFAULT 'HEALTHY',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE live_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES temple_streaming_channels(id) ON DELETE CASCADE,
  stream_reference VARCHAR NOT NULL,
  stream_url VARCHAR,
  embed_url VARCHAR,
  title VARCHAR,
  thumbnail_url VARCHAR,
  status stream_status_enum NOT NULL DEFAULT 'LIVE',
  status_reason VARCHAR,
  viewer_count INT,
  duration_seconds INT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_live_streams_updated_at
  BEFORE UPDATE ON live_streams
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
