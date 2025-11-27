# EventKonnect Backend Setup Guide

## Project Overview
EventKonnect is a NestJS-based event management platform that connects event organizers, vendors, and attendees. It uses PostgreSQL for data storage, Prisma as ORM, and includes features like authentication, event management, and file uploads.

## Prerequisites
- Node.js v18+ (you have v22.16.0 ✓)
- Yarn package manager (you have v1.22.22 ✓)
- PostgreSQL (you have v16.10 ✓)

## Database Setup

### Option 1: Manual Database Creation (Recommended if you have PostgreSQL access)
Run these commands as a PostgreSQL superuser:

```bash
# Connect to PostgreSQL as superuser (e.g., postgres)
sudo -u postgres psql

# Then run these SQL commands:
CREATE DATABASE "eventKonnect";
GRANT ALL PRIVILEGES ON DATABASE "eventKonnect" TO enock;

# Exit psql
\q
```

### Option 2: Using Docker (If you prefer containerized database)
The project includes docker-compose.yml. To use it:

```bash
# Start PostgreSQL container
docker run -d \
  --name eventKonnect-db \
  -e POSTGRES_USER=enock \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=eventKonnect \
  -p 5432:5432 \
  postgres:14

# Or if you have docker-compose v2:
docker compose up db -d
```

## Installation Steps

1. **Install Dependencies** ✓ (Already done)
   ```bash
   yarn install
   ```

2. **Configure Environment**
   Edit `.env` file with your settings:
   - `DATABASE_URL`: Already set to `postgresql://enock:admin123@localhost:5432/eventKonnect`
   - `JWT_SECRET`: Change to a strong random secret
   - `CLOUDINARY_*`: Add your Cloudinary credentials (optional for now)
   - `EMAIL_*`: Add your email credentials (optional for now)

3. **Run Database Migrations**
   ```bash
   yarn prisma migrate deploy
   # Or to reset and apply all migrations:
   yarn prisma migrate reset
   ```

4. **Generate Prisma Client**
   ```bash
   yarn prisma generate
   ```

5. **Start the Development Server**
   ```bash
   yarn start:dev
   ```

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens

### Optional (can be configured later)
- `CLOUDINARY_CLOUD_NAME`: For image uploads
- `CLOUDINARY_API_KEY`: For image uploads
- `CLOUDINARY_API_SECRET`: For image uploads
- `EMAIL_USER`: For sending emails
- `EMAIL_PASS`: App password for email service
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `PORT`: Server port (default: 5000)

## API Documentation
Once the server is running, visit:
- API Docs: http://localhost:5000/api/docs
- Health Check: http://localhost:5000/api/v1

## Database Schema
The application uses the following main models:
- **User**: Event organizers, vendors, and attendees
- **Role**: User roles (admin, organizer, vendor, attendee)
- **Event**: Events created by organizers
- **EventAttendee**: RSVP tracking for events
- **Review**: Vendor reviews and ratings

## Common Commands

```bash
# Development
yarn start:dev           # Start dev server with hot reload
yarn build              # Build for production
yarn start:prod         # Start production server

# Database
yarn prisma migrate dev  # Create and apply new migration
yarn prisma studio      # Open Prisma Studio (DB GUI)
yarn db:dev:restart     # Restart Docker database

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier
yarn test               # Run tests
```

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running: `pg_isready`
2. Check if database exists: `psql -U enock -l`
3. Verify credentials in `.env` file
4. Check if port 5432 is available: `lsof -i :5432`

### Port Already in Use
If port 5000 is taken, change `PORT` in `.env` file

### Migration Errors
Reset database and reapply migrations:
```bash
yarn prisma migrate reset
```

## Next Steps
1. Create database using one of the options above
2. Run migrations
3. Start the development server
4. Configure optional services (Cloudinary, Email) as needed
