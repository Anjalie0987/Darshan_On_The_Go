-- UP Migration: 010_analytics_audit

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  request_id VARCHAR,
  performed_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  action_type action_type_enum NOT NULL,
  entity_name VARCHAR NOT NULL,
  entity_id VARCHAR NOT NULL,
  old_data JSONB,
  new_data JSONB,
  metadata JSONB,
  ip_address VARCHAR,
  user_agent VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE temple_views (
  id BIGSERIAL PRIMARY KEY,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address VARCHAR,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE search_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  search_term VARCHAR,
  filters JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE temple_recommendations (
  id BIGSERIAL PRIMARY KEY,
  temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  recommended_temple_id UUID NOT NULL REFERENCES temples(id) ON DELETE CASCADE,
  similarity_score DECIMAL NOT NULL,
  algorithm_version VARCHAR NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_temple_recommendations_updated_at
  BEFORE UPDATE ON temple_recommendations
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
