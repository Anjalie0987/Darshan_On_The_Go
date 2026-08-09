-- DOWN Migration: 005_users_admins

DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS admin_sessions;
DROP TABLE IF EXISTS user_sessions;

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
DROP TABLE IF EXISTS admins;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TABLE IF EXISTS users;
