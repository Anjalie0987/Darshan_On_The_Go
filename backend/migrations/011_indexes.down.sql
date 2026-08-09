-- DOWN Migration: 011_indexes

DROP INDEX IF EXISTS admins_email_idx;
DROP INDEX IF EXISTS users_email_idx;

DROP INDEX IF EXISTS admin_sessions_refresh_token_idx;
DROP INDEX IF EXISTS sessions_refresh_token_idx;

DROP INDEX IF EXISTS aarti_schedules_time_idx;

DROP INDEX IF EXISTS live_streams_channel_idx;
DROP INDEX IF EXISTS live_streams_status_idx;

DROP INDEX IF EXISTS temples_location_idx;
DROP INDEX IF EXISTS temples_category_idx;
DROP INDEX IF EXISTS temples_status_active_idx;
DROP INDEX IF EXISTS temples_slug_idx;

DROP INDEX IF EXISTS temples_address_trgm_idx;
DROP INDEX IF EXISTS temples_name_trgm_idx;
