-- DOWN Migration: 010_analytics_audit

DROP TRIGGER IF EXISTS update_temple_recommendations_updated_at ON temple_recommendations;
DROP TABLE IF EXISTS temple_recommendations;
DROP TABLE IF EXISTS search_logs;
DROP TABLE IF EXISTS temple_views;
DROP TABLE IF EXISTS audit_logs;
