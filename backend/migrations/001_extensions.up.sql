-- UP Migration: 001_extensions

-- Enable UUID extension for generating UUIDv4 primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for advanced text similarity search (useful for Indian temple names)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
