# Database Setup Guide for EventKonnect

## Step-by-Step Database Creation

### Step 1: Connect to PostgreSQL as superuser
Open your terminal and run:

```bash
sudo -u postgres psql
```

This will open the PostgreSQL interactive terminal as the postgres superuser.

### Step 2: Create the database and grant privileges

Once inside the PostgreSQL terminal (you'll see `postgres=#` prompt), run these commands one by one:

```sql
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

-- Set default privileges for future tables (so enock can create tables)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO enock;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO enock;
```

### Step 3: Exit PostgreSQL
```sql
\q
```

## Alternative: Run the SQL script automatically

If you prefer to run everything at once, use this command from your terminal:

```bash
sudo -u postgres psql < setup-db.sql
```

## Verify Database Creation

After creating the database, verify it was created successfully:

```bash
# List all databases
PGPASSWORD=admin123 psql -U enock -l

# Connect to the eventKonnect database
PGPASSWORD=admin123 psql -U enock -d eventKonnect

# Inside psql, check your privileges
\l eventKonnect
```

## If enock user doesn't exist

If you get an error that the user "enock" doesn't exist, you need to create it first:

```bash
# Connect as postgres superuser
sudo -u postgres psql

# Create enock user with password
CREATE USER enock WITH PASSWORD 'admin123';

# Make enock a superuser (optional, but simplest for development)
ALTER USER enock WITH SUPERUSER;

# Or just give specific privileges (more secure)
ALTER USER enock CREATEDB;

# Exit
\q
```

Then run the database creation steps again.

## Quick Setup (All-in-One)

If you want to do everything at once, run:

```bash
# Create user and database
sudo -u postgres psql << EOF
CREATE USER enock WITH PASSWORD 'admin123' CREATEDB;
CREATE DATABASE "eventKonnect" OWNER enock;
GRANT ALL PRIVILEGES ON DATABASE "eventKonnect" TO enock;
\c eventKonnect
GRANT ALL PRIVILEGES ON SCHEMA public TO enock;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO enock;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO enock;
EOF
```

## After Database Setup

Once the database is created, continue with:

1. Generate Prisma Client:
```bash
cd /home/enock/EventKonnect-be
yarn prisma generate
```

2. Run Database Migrations:
```bash
yarn prisma migrate deploy
```

3. Start the development server:
```bash
yarn start:dev
```

## Troubleshooting

### Issue: "peer authentication failed"
Edit PostgreSQL config to allow password authentication:
```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```
Change the line:
```
local   all             all                                     peer
```
To:
```
local   all             all                                     md5
```
Then restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Issue: "database already exists"
If the database already exists, you can drop it first:
```bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS \"eventKonnect\";"
```

### Issue: "permission denied"
Make sure you're running the commands as the postgres superuser or your user has sufficient privileges.
