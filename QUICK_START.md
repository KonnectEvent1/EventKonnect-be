# 🚀 EventKonnect Backend - Complete Setup Instructions

## ✅ What's Already Done

1. ✓ Dependencies installed (yarn install completed)
2. ✓ Environment file created (.env)
3. ✓ Database URL configured: `postgresql://enock:admin123@localhost:5432/eventKonnect`

## 📋 Step-by-Step Instructions

### STEP 1: Create the Database

Choose ONE of these three methods:

#### **Method A: Automated Script (Easiest)** ⭐ RECOMMENDED

Simply run this single command:

```bash
cd /home/enock/EventKonnect-be
./setup-database.sh
```

This script will automatically:
- Create the PostgreSQL user 'enock' (if it doesn't exist)
- Create the 'eventKonnect' database
- Grant all necessary privileges

---

#### **Method B: Manual SQL Commands**

If the script doesn't work, run these commands:

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Then copy and paste these SQL commands:
CREATE USER enock WITH PASSWORD 'admin123' CREATEDB;
CREATE DATABASE "eventKonnect" OWNER enock;
GRANT ALL PRIVILEGES ON DATABASE "eventKonnect" TO enock;
\c eventKonnect
GRANT ALL PRIVILEGES ON SCHEMA public TO enock;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO enock;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO enock;
\q
```

---

#### **Method C: Using SQL File**

Run the SQL file directly:

```bash
sudo -u postgres psql -f /home/enock/EventKonnect-be/setup-db.sql
```

---

### STEP 2: Generate Prisma Client

```bash
cd /home/enock/EventKonnect-be
yarn prisma generate
```

### STEP 3: Run Database Migrations

```bash
yarn prisma migrate deploy
```

This will create all the necessary tables (User, Role, Event, EventAttendee, Review).

### STEP 4: Start the Application

```bash
yarn start:dev
```

The server will start on http://localhost:5000

---

## 🎯 Quick Test

After starting the server, visit:
- **API Documentation**: http://localhost:5000/api/docs
- **API Base URL**: http://localhost:5000/api/v1

---

## 🔧 Configuration (Optional for now)

The `.env` file has been created with these settings:

```env
DATABASE_URL="postgresql://enock:admin123@localhost:5432/eventKonnect?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=5000
```

**Optional services** (can configure later):
- **Cloudinary**: For image uploads (avatar, event images)
- **Email**: For sending verification emails

---

## 📊 Database Schema Overview

The application includes these tables:

1. **User**: Stores users (organizers, vendors, attendees)
   - Fields: username, email, password, role, profile info, etc.

2. **Role**: User roles (admin, organizer, vendor, attendee)

3. **Event**: Events created by organizers
   - Fields: title, description, location, budget, date, images

4. **EventAttendee**: Tracks RSVPs and attendance
   - Status: PENDING, CONFIRMED, CANCELLED, CHECKED_IN

5. **Review**: Vendor reviews and ratings

---

## 🐛 Troubleshooting

### Issue: "database already exists"
```bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS \"eventKonnect\";"
# Then run setup again
```

### Issue: "role 'enock' does not exist"
```bash
sudo -u postgres psql -c "CREATE USER enock WITH PASSWORD 'admin123' CREATEDB;"
```

### Issue: "peer authentication failed"
Edit PostgreSQL config:
```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```
Change `peer` to `md5` for local connections, then:
```bash
sudo systemctl restart postgresql
```

### Issue: Port 5000 already in use
Change the PORT in `.env` file to another port (e.g., 3000, 8000)

---

## 🎓 Project Structure

```
EventKonnect-be/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── auth/                  # Authentication module
│   ├── user/                  # User management
│   ├── event/                 # Event management
│   ├── event-attendee/        # RSVP management
│   ├── email/                 # Email service
│   ├── config/                # Configuration (Cloudinary, etc.)
│   └── main.ts               # Application entry point
├── .env                       # Environment variables
└── package.json              # Dependencies
```

---

## 📝 Common Commands

```bash
# Development
yarn start:dev              # Start with hot reload
yarn build                  # Build for production
yarn start:prod            # Start production server

# Database
yarn prisma generate        # Generate Prisma client
yarn prisma migrate deploy  # Apply migrations
yarn prisma studio         # Open database GUI
yarn prisma migrate dev    # Create new migration

# Code Quality
yarn lint                  # Run linter
yarn format               # Format code
yarn test                 # Run tests
```

---

## 🎉 Success Checklist

- [ ] Database created successfully
- [ ] Prisma client generated
- [ ] Migrations applied
- [ ] Server starts without errors
- [ ] API docs accessible at http://localhost:5000/api/docs

---

## 📞 Need Help?

If you encounter issues:
1. Check `DATABASE_SETUP.md` for detailed troubleshooting
2. Verify PostgreSQL is running: `pg_isready`
3. Test database connection: `PGPASSWORD=admin123 psql -U enock -d eventKonnect -c "SELECT 1;"`

---

**You're all set! Just run the 4 steps above and your EventKonnect backend will be ready! 🚀**
