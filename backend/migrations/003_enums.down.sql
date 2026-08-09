-- DOWN Migration: 003_enums

DROP TYPE IF EXISTS delivery_status_enum;
DROP TYPE IF EXISTS notification_channel_enum;

DROP TYPE IF EXISTS stream_status_enum;
DROP TYPE IF EXISTS api_status_enum;

DROP TYPE IF EXISTS event_type_enum;
DROP TYPE IF EXISTS image_type_enum;
DROP TYPE IF EXISTS temple_status_enum;

DROP TYPE IF EXISTS action_type_enum;
DROP TYPE IF EXISTS login_status_enum;
DROP TYPE IF EXISTS admin_role_enum;
