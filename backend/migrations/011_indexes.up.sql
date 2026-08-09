-- UP Migration: 011_indexes

-- Trigram index for fuzzy search on temple name and address
CREATE INDEX temples_name_trgm_idx ON temples USING GIN (name gin_trgm_ops);
CREATE INDEX temples_address_trgm_idx ON temples USING GIN (address_line gin_trgm_ops);

-- B-Tree indexes for fast exact lookups
CREATE INDEX temples_slug_idx ON temples(slug);
CREATE INDEX temples_status_active_idx ON temples(status, is_active);
CREATE INDEX temples_category_idx ON temples(category_id);
CREATE INDEX temples_location_idx ON temples(state_id, city_id);

CREATE INDEX live_streams_status_idx ON live_streams(status);
CREATE INDEX live_streams_channel_idx ON live_streams(channel_id, status);

CREATE INDEX aarti_schedules_time_idx ON aarti_schedules(temple_id, time_start);

CREATE INDEX sessions_refresh_token_idx ON user_sessions(refresh_token_hash);
CREATE INDEX admin_sessions_refresh_token_idx ON admin_sessions(refresh_token_hash);

CREATE INDEX users_email_idx ON users(email);
CREATE INDEX admins_email_idx ON admins(email);
