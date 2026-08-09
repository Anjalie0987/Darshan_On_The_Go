-- DOWN Migration: 006_temples

DROP TABLE IF EXISTS admin_temples;

DROP TRIGGER IF EXISTS update_temples_updated_at ON temples;
DROP TABLE IF EXISTS temples;
