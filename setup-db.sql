-- EventKonnect Database Setup Script
-- Run this as PostgreSQL superuser (postgres)

-- Create the database
CREATE DATABASE "eventKonnect";

-- Connect to the new database
\c eventKonnect

-- Grant all privileges on the database to enock user
GRANT ALL PRIVILEGES ON DATABASE "eventKonnect" TO enock;

-- Grant all privileges on all tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO enock;

-- Grant all privileges on all sequences in public schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO enock;

-- Grant usage and create on schema
GRANT USAGE, CREATE ON SCHEMA public TO enock;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO enock;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO enock;
