# EventKonnect API - Quick Reference Card

## 🚀 Start Server
```bash
yarn start:dev
```

## 🌐 URLs
- **Server:** http://localhost:5000
- **API Base:** http://localhost:5000/api/v1
- **Swagger Docs:** http://localhost:5000/api/docs

---

## 🔑 Authentication Examples

### Register Organizer
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup/organiser \
  -H "Content-Type: application/json" \
  -d '{
    "username": "organizer1",
    "email": "organizer@example.com",
    "password": "Pass123!",
    "phone": "+250788123456",
    "organisationName": "Events Ltd"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "Pass123!"
  }'
```

Response includes `access_token` - save this!

---

## 📅 Event Management

### Create Event (requires token)
```bash
curl -X POST http://localhost:5000/api/v1/events/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2025",
    "description": "Annual tech event",
    "location": "Kigali Convention Centre",
    "date": "2025-12-15T09:00:00.000Z",
    "budget": 5000000
  }'
```

### Get All Events
```bash
curl -X GET http://localhost:5000/api/v1/events/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Register for Event (RSVP)
```bash
curl -X POST http://localhost:5000/api/v1/events/{EVENT_ID}/attendees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👤 User Management

### Get Profile
```bash
curl -X GET http://localhost:5000/api/v1/user/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/v1/user/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "phone": "+250788999888"
  }'
```

---

## 📦 JavaScript/Frontend Examples

### Axios Setup
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Login
```javascript
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.data.access_token);
  return data;
};
```

### Get Events
```javascript
const getEvents = async () => {
  const { data } = await api.get('/events/all');
  return data.data; // Array of events
};
```

### Create Event
```javascript
const createEvent = async (eventData) => {
  const { data } = await api.post('/events/create', eventData);
  return data.data;
};
```

---

## 🎭 User Roles

| Role | Can Do |
|------|--------|
| **ADMIN** | Everything |
| **ORGANIZER** | Create/manage events, manage attendees |
| **VENDOR** | View events, register for events |
| **ATTENDEE** | View events, register for events |

---

## 📊 Response Format

### Success
```json
{
  "message": "Operation successful",
  "data": { ... },
  "error": ""
}
```

### Error
```json
{
  "message": "Operation failed",
  "data": null,
  "error": "Error description"
}
```

---

## 🔧 Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Server Error |

---

## 📝 RSVP Statuses

- `PENDING` - Awaiting confirmation
- `CONFIRMED` - Attendance confirmed
- `CANCELLED` - Cancelled by user
- `CHECKED_IN` - User checked in at event

---

## 🎨 Event Statuses

- `active` - Event is active
- `cancelled` - Event cancelled
- `postponed` - Event postponed
- `completed` - Event finished

---

## 🔗 Full Documentation

- **API Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Frontend Guide:** [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)
- **Setup Guide:** [QUICK_START.md](./QUICK_START.md)
- **Interactive Docs:** http://localhost:5000/api/docs

---

## 💡 Pro Tips

1. **Test endpoints** in Swagger UI first
2. **Save your token** after login
3. **Check role permissions** before API calls
4. **Use interceptors** for automatic token handling
5. **Handle 401 errors** by redirecting to login

---

## 🆘 Quick Troubleshooting

**Server won't start?**
- Check if port 5000 is free
- Verify database is running: `pg_isready`
- Check .env configuration

**401 Unauthorized?**
- Token expired or invalid
- Include `Authorization: Bearer {token}` header

**403 Forbidden?**
- User role doesn't have permission
- Check role requirements in API docs

**404 Not Found?**
- Check endpoint URL spelling
- Verify resource exists

---

**Need more help?** Check the full documentation files or visit http://localhost:5000/api/docs
