-- UP Migration: 009_notifications

CREATE TABLE notification_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel_type notification_channel_enum NOT NULL,
  identifier VARCHAR NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR UNIQUE NOT NULL,
  title_template VARCHAR NOT NULL,
  body_template TEXT NOT NULL,
  channel_type notification_channel_enum NOT NULL
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR NOT NULL,
  temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES notification_channels(id) ON DELETE SET NULL,
  delivery_status delivery_status_enum NOT NULL DEFAULT 'PENDING',
  read_at TIMESTAMPTZ
);
