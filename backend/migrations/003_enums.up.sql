-- UP Migration: 003_enums

-- Authentication & Roles
CREATE TYPE admin_role_enum AS ENUM ('SUPER_ADMIN', 'CONTENT_EDITOR', 'TEMPLE_MANAGER');
CREATE TYPE login_status_enum AS ENUM ('SUCCESS', 'FAILED');
CREATE TYPE action_type_enum AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- Temple Domain
CREATE TYPE temple_status_enum AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED', 'ARCHIVED');
CREATE TYPE image_type_enum AS ENUM ('THUMBNAIL', 'BANNER', 'GALLERY');
CREATE TYPE event_type_enum AS ENUM ('FESTIVAL', 'RITUAL');

-- Streaming Domain
CREATE TYPE api_status_enum AS ENUM ('HEALTHY', 'ERROR', 'QUOTA_EXCEEDED');
CREATE TYPE stream_status_enum AS ENUM ('LIVE', 'ENDED', 'ERROR');

-- Notifications
CREATE TYPE notification_channel_enum AS ENUM ('EMAIL', 'PUSH', 'SMS', 'WHATSAPP', 'IN_APP');
CREATE TYPE delivery_status_enum AS ENUM ('PENDING', 'SENT', 'FAILED');
