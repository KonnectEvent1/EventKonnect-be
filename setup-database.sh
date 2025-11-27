#!/bin/bash

# EventKonnect Database Setup Script
# This script sets up the PostgreSQL database for EventKonnect

echo "======================================"
echo "EventKonnect Database Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running. Please start PostgreSQL first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL is running${NC}"
echo ""

# Database configuration
DB_NAME="eventKonnect"
DB_USER="enock"
DB_PASSWORD="admin123"

echo "This script will create:"
echo "  - User: $DB_USER"
echo "  - Database: $DB_NAME"
echo "  - Grant all privileges to $DB_USER"
echo ""
echo -e "${YELLOW}You will be prompted for the PostgreSQL superuser (postgres) password.${NC}"
echo ""

# Create user if doesn't exist
echo "Creating PostgreSQL user '$DB_USER'..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
sudo -u postgres psql << EOF
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD' CREATEDB;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ User '$DB_USER' created/verified${NC}"
else
    echo -e "${RED}❌ Failed to create user${NC}"
    exit 1
fi

# Create database if doesn't exist
echo "Creating database '$DB_NAME'..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql << EOF
CREATE DATABASE "$DB_NAME" OWNER $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database '$DB_NAME' created/verified${NC}"
else
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
fi

# Grant privileges
echo "Granting privileges..."
sudo -u postgres psql << EOF
GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO $DB_USER;
\c $DB_NAME
GRANT ALL PRIVILEGES ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Privileges granted${NC}"
else
    echo -e "${YELLOW}⚠ Warning: Some privileges might not have been granted${NC}"
fi

echo ""
echo -e "${GREEN}======================================"
echo "✓ Database setup completed!"
echo "======================================${NC}"
echo ""
echo "Connection details:"
echo "  Database URL: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
echo "Next steps:"
echo "  1. Run: yarn prisma generate"
echo "  2. Run: yarn prisma migrate deploy"
echo "  3. Run: yarn start:dev"
echo ""

# Test connection
echo "Testing database connection..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Connection test successful!${NC}"
else
    echo -e "${YELLOW}⚠ Connection test failed. You may need to configure pg_hba.conf${NC}"
    echo "  See DATABASE_SETUP.md for troubleshooting."
fi
