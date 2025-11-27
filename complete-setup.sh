#!/bin/bash

# Complete setup script for EventKonnect

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         EventKonnect - Complete Setup Script                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Check Nest CLI
echo -e "${BLUE}Step 1: Checking Nest CLI...${NC}"
if ! yarn nest --version > /dev/null 2>&1; then
    echo -e "${YELLOW}Installing Nest CLI...${NC}"
    yarn add @nestjs/cli --dev
fi
echo -e "${GREEN}✓ Nest CLI is ready${NC}"
echo ""

# Step 2: Database setup instructions
echo -e "${BLUE}Step 2: Database Setup${NC}"
echo ""
echo -e "${YELLOW}Please run these commands in a separate terminal:${NC}"
echo ""
echo "  sudo -u postgres psql"
echo ""
echo "Then paste:"
echo ""
echo "  CREATE USER enock WITH PASSWORD 'admin123' CREATEDB;"
echo "  CREATE DATABASE \"eventKonnect\" OWNER enock;"
echo "  GRANT ALL PRIVILEGES ON DATABASE \"eventKonnect\" TO enock;"
echo "  \\c eventKonnect"
echo "  GRANT ALL PRIVILEGES ON SCHEMA public TO enock;"
echo "  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO enock;"
echo "  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO enock;"
echo "  \\q"
echo ""
read -p "Press Enter after you've created the database..."

# Step 3: Test database connection
echo ""
echo -e "${BLUE}Step 3: Testing database connection...${NC}"
PGPASSWORD=admin123 psql -U enock -d eventKonnect -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database connection successful${NC}"
else
    echo -e "${RED}✗ Cannot connect to database. Please check your setup.${NC}"
    exit 1
fi

# Step 4: Generate Prisma Client
echo ""
echo -e "${BLUE}Step 4: Generating Prisma Client...${NC}"
yarn prisma generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma Client generated${NC}"
else
    echo -e "${RED}✗ Failed to generate Prisma Client${NC}"
    exit 1
fi

# Step 5: Run migrations
echo ""
echo -e "${BLUE}Step 5: Running database migrations...${NC}"
yarn prisma migrate deploy
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations applied${NC}"
else
    echo -e "${RED}✗ Failed to apply migrations${NC}"
    exit 1
fi

# Success
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Setup Complete! 🎉                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "To start the development server:"
echo -e "${YELLOW}  yarn start:dev${NC}"
echo ""
echo "Then visit:"
echo "  • API Docs: http://localhost:5000/api/docs"
echo "  • API Base: http://localhost:5000/api/v1"
echo ""
