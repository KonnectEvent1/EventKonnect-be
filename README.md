## Event Konnect Backend API

## Description

Event Konnect is a Rwanda-based innovative digital platform that simplifies and centralizes the event planning process. We provide a one-stop solution that helps planners, vendors, and clients connect, collaborate, and execute events efficiently.

### Features
- 🔐 JWT-based authentication
- 👥 Multiple user roles (Organizer, Vendor, Attendee, Admin)
- 📅 Event management system
- ✅ RSVP and attendance tracking
- ⭐ Vendor reviews and ratings
- 📧 Email verification
- 🖼️ Image upload via Cloudinary
- 📚 Interactive API documentation (Swagger)

## Prerequisites
- Node.js v18+ (tested with v22.16.0)
- Yarn package manager
- PostgreSQL 14+
- NestJS Framework

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Josiane705/Event-Konnect-be.git
cd Event-Konnect-be
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Setup Database
```bash
# Run the automated setup script
./complete-setup.sh

# OR manually create database (see DATABASE_SETUP.md)
sudo -u postgres psql
CREATE USER enock WITH PASSWORD 'admin123' CREATEDB;
CREATE DATABASE "eventKonnect" OWNER enock;
\q
```

### 4. Configure Environment
Edit `.env` file with your settings (already created with defaults)

### 5. Run Migrations
```bash
yarn prisma generate
yarn prisma migrate deploy
```

### 6. Start the Development Server
```bash
yarn start:dev
```

**🎉 Server will start on:** http://localhost:5000

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Complete setup guide for new users
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Full API reference with examples
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Frontend integration guide with React examples
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Detailed database setup instructions
- **[Interactive API Docs](http://localhost:5000/api/docs)** - Swagger UI (after starting server)

---

## Available Scripts

### Development
```bash
yarn start:dev      # Start with hot reload
yarn start:debug    # Start in debug mode
yarn build          # Build for production
yarn start:prod     # Start production server
```

### Database
```bash
yarn prisma generate       # Generate Prisma client
yarn prisma migrate deploy # Apply migrations
yarn prisma migrate dev    # Create new migration
yarn prisma studio        # Open Prisma Studio (GUI)
yarn db:dev:restart       # Restart Docker database
```

### Code Quality
```bash
yarn lint          # Run ESLint
yarn format        # Format code with Prettier
yarn test          # Run tests
yarn test:watch    # Run tests in watch mode
yarn test:cov      # Generate coverage report
```

---

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/signup/vendor` - Register as vendor
- `POST /api/v1/auth/signup/organiser` - Register as organizer
- `POST /api/v1/auth/signup/attendee` - Register as attendee
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/verify-email` - Verify email

### User Management
- `GET /api/v1/user/me` - Get current user
- `PUT /api/v1/user/update` - Update profile
- `DELETE /api/v1/user/delete` - Delete account

### Events
- `POST /api/v1/events/create` - Create event
- `GET /api/v1/events/all` - Get all events
- `GET /api/v1/events/:id` - Get event by ID
- `PATCH /api/v1/events/update/:id` - Update event
- `DELETE /api/v1/events/delete/:id` - Delete event
- `PATCH /api/v1/events/status/:id` - Update event status

### Event Attendees (RSVP)
- `POST /api/v1/events/:eventId/attendees` - Register for event
- `GET /api/v1/events/:eventId/attendees` - Get event attendees
- `PATCH /api/v1/events/:eventId/attendees/:userId/status` - Update RSVP status

See **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** for complete details.

---

## Technology Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with Passport
- **File Upload:** Cloudinary
- **Email:** Nodemailer
- **API Docs:** Swagger/OpenAPI
- **Validation:** class-validator, class-transformer

---

## Project Structure

```
EventKonnect-be/
├── src/
│   ├── auth/              # Authentication module
│   ├── user/              # User management
│   ├── event/             # Event management
│   ├── event-attendee/    # RSVP management
│   ├── role/              # Role-based access control
│   ├── email/             # Email service
│   ├── config/            # Configuration (Cloudinary, etc.)
│   ├── utils/             # DTOs, decorators, helpers
│   │   ├── dtos/          # Data Transfer Objects
│   │   ├── enums/         # Enums (roles, statuses)
│   │   └── response/      # Response formatters
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── .env                   # Environment variables
└── package.json           # Dependencies
```

---

## Environment Variables

Required variables in `.env`:
```env
DATABASE_URL=postgresql://enock:admin123@localhost:5432/eventKonnect
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

Optional (configure as needed):
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

---

## User Roles

1. **ADMIN** - Full system access
2. **ORGANIZER** - Create and manage events
3. **VENDOR** - Provide services, view events
4. **ATTENDEE** - Register for events

---

## Contributing

1. Fork the Repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request to `develop` branch

### Code Style
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

---

## Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

---

## Troubleshooting

### Port 5000 already in use
Change `PORT` in `.env` file

### Database connection failed
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -U enock -l`

### Nest CLI not found
```bash
yarn add @nestjs/cli --dev
```

See **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** for more troubleshooting.

---

## Support & Resources

- 📖 [Full API Documentation](./API_DOCUMENTATION.md)
- 🚀 [Quick Start Guide](./QUICK_START.md)
- 💻 [Frontend Integration](./FRONTEND_INTEGRATION.md)
- 🌐 [Swagger Docs](http://localhost:5000/api/docs) (when server is running)

---

## License

MIT License © 2025 Event Konnect Rwanda

---

## Maintainers

Event Konnect Team

For issues or questions, please open an issue on GitHub.