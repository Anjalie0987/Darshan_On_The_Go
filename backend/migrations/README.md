# DarshanHub Database Migrations

This directory contains the raw PostgreSQL migration scripts that define the DarshanHub database architecture.

## 📂 Migration Order and Dependencies

Migrations MUST be executed in strictly numerical order (`001` -> `012`) because later scripts depend on earlier schemas (e.g., Foreign Keys pointing to Lookup Tables, or Tables relying on Enums and Triggers).

### Execution Sequence
1. **001_extensions**: Enables `uuid-ossp` and `pg_trgm`. (Required first).
2. **002_triggers**: Defines the `trigger_set_timestamp()` function.
3. **003_enums**: Defines custom ENUM types (`user_status`, `stream_status`, etc.).
4. **004_lookup_tables**: Creates `countries`, `states`, `cities`, `temple_categories`, `streaming_providers`, `global_settings`.
5. **005_users_admins**: Creates auth-related tables (`users`, `admins`, sessions, history).
6. **006_temples**: Creates the core `temples` and `admin_temples` mapping table.
7. **007_temple_metadata**: Creates tables referencing `temples` (`images`, `social_links`, `aarti_schedules`, `events`, `tags`).
8. **008_streaming**: Creates `temple_streaming_channels` and `live_streams`.
9. **009_notifications**: Creates push/email notification matrix tables.
10. **010_analytics_audit**: Creates log tables and ML recommendation caches.
11. **011_indexes**: Creates all B-Tree and GIN (`pg_trgm`) performance indexes.
12. **012_seed_data**: Seeds the initial state (countries, states, streaming providers).

## 🚀 Execution Instructions

Because we are not using an ORM, these scripts are designed to be run directly against the PostgreSQL database.
You can execute them using `psql`:

```bash
# To run all migrations in sequence:
for file in up/*.up.sql; do psql -U your_db_user -d darshanhub -a -f "$file"; done
```

*(Note: We recommend implementing a lightweight migration runner script in Node.js during Phase 3.4 to automatically track which migrations have run using a `migrations_history` table).*

## ⏪ Rollback Instructions

Every `.up.sql` file has an exact corresponding `.down.sql` file. 
To roll back, execute the down scripts in **reverse numerical order** (`012` -> `001`).

```bash
# To completely reset the database:
ls down/*.down.sql | sort -r | while read file; do psql -U your_db_user -d darshanhub -a -f "$file"; done
```

## 🛠️ Future Migration Conventions

When adding new features:
1. **Do not modify existing `001` to `012` files** (unless the database has never been deployed to production).
2. Create new sequential files (e.g., `013_add_new_feature.up.sql` and `013_add_new_feature.down.sql`).
3. Maintain the `.up.sql` and `.down.sql` structure.
4. If adding new updated_at logic, reuse the existing `trigger_set_timestamp()` function by adding a trigger to your new table:
   ```sql
   CREATE TRIGGER update_new_table_updated_at
     BEFORE UPDATE ON new_table
     FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
   ```
