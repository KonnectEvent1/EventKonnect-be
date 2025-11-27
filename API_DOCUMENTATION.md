# EventKonnect API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Interactive Documentation
Visit: `http://localhost:5000/api/docs` for Swagger UI with interactive testing

---

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Event Management](#event-management)
4. [Event Attendees (RSVP)](#event-attendees)
5. [Response Format](#response-format)
6. [Error Codes](#error-codes)

---

## Authentication

### 1. Register Vendor
Create a new vendor account for service providers.

**Endpoint:** `POST /api/v1/auth/signup/vendor`

**Request Body:**
```json
{
  "username": "vendor123",
  "email": "vendor@example.com",
  "password": "SecurePass123!",
  "phone": "+250788123456",
  "companyName": "Amazing Events Co.",
  "companyWebsite": "https://amazing-events.com",
  "serviceArea": "Wedding Planning",
  "services": ["Photography", "Catering", "Decoration"],
  "pricing": {
    "basic": 100,
    "standard": 250,
    "premium": 500
  },
  "description": "Professional event services"
}
```

**Response:** `201 Created`
```json
{
  "message": "Vendor account created successfully. Please verify your email.",
  "data": {
    "id": "uuid",
    "email": "vendor@example.com",
    "username": "vendor123",
    "role": "VENDOR"
  }
}
```

---

### 2. Register Organizer
Create a new organizer account for event creators.

**Endpoint:** `POST /api/v1/auth/signup/organiser`

**Request Body:**
```json
{
  "username": "organizer123",
  "email": "organizer@example.com",
  "password": "SecurePass123!",
  "phone": "+250788123456",
  "organisationName": "Event Masters Rwanda",
  "address": "Kigali, Rwanda"
}
```

**Response:** `201 Created`

---

### 3. Register Attendee
Create a new attendee account.

**Endpoint:** `POST /api/v1/auth/signup/attendee`

**Request Body:**
```json
{
  "username": "attendee123",
  "email": "attendee@example.com",
  "password": "SecurePass123!",
  "phone": "+250788123456"
}
```

**Response:** `201 Created`

---

### 4. Email Verification
Verify user email address.

**Endpoint:** `GET /api/v1/auth/verify-email?token={verification_token}`

**Query Parameters:**
- `token` (string, required): Verification token from email

**Response:** `200 OK`
```json
{
  "message": "Email verified successfully",
  "data": {
    "isVerified": true
  }
}
```

---

### 5. Login
Authenticate user and receive JWT token.

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Successfully Signed In",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "user123",
      "role": "ORGANIZER"
    }
  },
  "error": ""
}
```

**Note:** Token is also set as HTTP-only cookie named `token`

---

## User Management

### Authentication Required
All user endpoints require JWT token in Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

### 1. Get Current User Profile
Get logged-in user information.

**Endpoint:** `GET /api/v1/user/me`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:** `200 OK`
```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "username": "user123",
    "email": "user@example.com",
    "phone": "+250788123456",
    "avatar": "https://cloudinary.com/...",
    "role": {
      "id": "uuid",
      "name": "ORGANIZER"
    },
    "isVerified": true,
    "isProfileSet": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Update User Profile
Update current user information.

**Endpoint:** `PUT /api/v1/user/update`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body (all fields optional):**
```json
{
  "username": "newusername",
  "phone": "+250788999888",
  "avatar": "https://cloudinary.com/new-avatar.jpg",
  "address": "New Address",
  "description": "Updated bio",
  "companyName": "New Company Name",
  "services": ["New Service 1", "New Service 2"],
  "pricing": {
    "hourly": 50,
    "daily": 300
  }
}
```

**Response:** `200 OK`
```json
{
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "username": "newusername",
    ...
  }
}
```

---

### 3. Delete User Account
Soft delete user account (marks as deleted, doesn't remove from database).

**Endpoint:** `DELETE /api/v1/user/delete`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:** `200 OK`
```json
{
  "message": "User account deleted successfully",
  "data": null
}
```

---

## Event Management

### Authentication Required
All event endpoints require JWT token.

### 1. Create Event
Create a new event (Organizers and Admins only).

**Endpoint:** `POST /api/v1/events/create`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference featuring industry leaders",
  "location": "Kigali Convention Centre, Rwanda",
  "date": "2025-12-15T09:00:00.000Z",
  "budget": 5000000,
  "images": [
    {
      "url": "https://cloudinary.com/event-banner.jpg",
      "publicId": "event_123_banner"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "message": "Event created successfully",
  "data": {
    "id": "uuid",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference...",
    "location": "Kigali Convention Centre, Rwanda",
    "date": "2025-12-15T09:00:00.000Z",
    "budget": 5000000,
    "status": "active",
    "organizerId": "uuid",
    "images": [...],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Get All Events
Retrieve all events (All authenticated users).

**Endpoint:** `GET /api/v1/events/all`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:** `200 OK`
```json
{
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Tech Conference 2025",
      "description": "...",
      "location": "Kigali Convention Centre",
      "date": "2025-12-15T09:00:00.000Z",
      "budget": 5000000,
      "status": "active",
      "organizerId": "uuid",
      "organizer": {
        "username": "organizer123",
        "email": "organizer@example.com"
      },
      "attendees": [...]
    }
  ]
}
```

---

### 3. Get Event by ID
Get details of a specific event.

**Endpoint:** `GET /api/v1/events/{eventId}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `eventId` (string, required): Event UUID

**Response:** `200 OK`
```json
{
  "message": "Event retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Tech Conference 2025",
    "description": "...",
    "location": "Kigali Convention Centre",
    "date": "2025-12-15T09:00:00.000Z",
    "budget": 5000000,
    "status": "active",
    "organizerId": "uuid",
    "organizer": {
      "username": "organizer123",
      "email": "organizer@example.com",
      "phone": "+250788123456"
    },
    "attendees": [
      {
        "userId": "uuid",
        "status": "CONFIRMED",
        "user": {
          "username": "attendee1",
          "email": "attendee1@example.com"
        }
      }
    ]
  }
}
```

---

### 4. Update Event
Update event details (Owner or Admin only).

**Endpoint:** `PATCH /api/v1/events/update/{eventId}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `eventId` (string, required): Event UUID

**Request Body (all fields optional):**
```json
{
  "title": "Updated Event Title",
  "description": "Updated description",
  "location": "New Location",
  "date": "2025-12-20T10:00:00.000Z",
  "budget": 6000000,
  "images": [...]
}
```

**Response:** `200 OK`

---

### 5. Delete Event
Delete an event (Owner or Admin only).

**Endpoint:** `DELETE /api/v1/events/delete/{eventId}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `eventId` (string, required): Event UUID

**Response:** `200 OK`
```json
{
  "message": "Event deleted successfully",
  "data": null
}
```

---

### 6. Update Event Status
Cancel or postpone an event.

**Endpoint:** `PATCH /api/v1/events/status/{eventId}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `eventId` (string, required): Event UUID

**Request Body:**
```json
{
  "status": "cancelled"
}
```

**Status Options:**
- `active` - Event is active
- `cancelled` - Event is cancelled
- `postponed` - Event is postponed
- `completed` - Event has been completed

**Response:** `200 OK`

---

## Event Attendees (RSVP)

### 1. Register for Event (RSVP)
Register current user as attendee for an event.

**Endpoint:** `POST /api/v1/events/{eventId}/attendees`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `eventId` (string, required): Event UUID

**Response:** `201 Created`
```json
{
  "message": "Successfully registered for event",
  "data": {
    "id": "uuid",
    "eventId": "event_uuid",
    "userId": "user_uuid",
    "status": "PENDING",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Update Attendee Status
Update RSVP status (Organizer or Admin only).

**Endpoint:** `PATCH /api/v1/events/{eventId}/attendees/{userId}/status`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `eventId` (string, required): Event UUID
- `userId` (string, required): User UUID of attendee

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Status Options:**
- `PENDING` - Awaiting confirmation
- `CONFIRMED` - Attendance confirmed
- `CANCELLED` - Attendance cancelled
- `CHECKED_IN` - Attendee has checked in at event

**Response:** `200 OK`
```json
{
  "message": "Attendee status updated successfully",
  "data": {
    "id": "uuid",
    "eventId": "event_uuid",
    "userId": "user_uuid",
    "status": "CONFIRMED",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Get Event Attendees
Get all attendees for an event (Organizer or Admin only).

**Endpoint:** `GET /api/v1/events/{eventId}/attendees`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `eventId` (string, required): Event UUID

**Response:** `200 OK`
```json
{
  "message": "Attendees retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "eventId": "event_uuid",
      "userId": "user_uuid",
      "status": "CONFIRMED",
      "checkedInAt": null,
      "user": {
        "id": "user_uuid",
        "username": "attendee1",
        "email": "attendee1@example.com",
        "phone": "+250788123456"
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {...},
  "error": ""
}
```

### Error Response
```json
{
  "message": "Operation failed",
  "data": null,
  "error": "Error description"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid data provided |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## User Roles and Permissions

### ADMIN
- Full access to all operations
- Can manage all events, users, and attendees

### ORGANIZER
- Create, update, and delete own events
- Manage attendees for own events
- View all events
- Update own profile

### VENDOR
- View all events
- Register as attendee for events
- Update own profile
- Manage own vendor information

### ATTENDEE
- View all events
- Register as attendee for events
- Update own profile

---

## Frontend Integration Examples

### 1. Login Example (JavaScript/Fetch)
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Important for cookies
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token in localStorage or state management
      localStorage.setItem('token', data.data.access_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

---

### 2. Create Event Example (React)
```javascript
const createEvent = async (eventData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:5000/api/v1/events/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create event');
    }
    
    return data;
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};
```

---

### 3. Axios Example with Interceptor
```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;

// Usage:
// const events = await api.get('/events/all');
// const event = await api.post('/events/create', eventData);
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup/organiser \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testorg",
    "email": "test@example.com",
    "password": "Test123!",
    "phone": "+250788123456",
    "organisationName": "Test Org"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Get Events (with token)
```bash
curl -X GET http://localhost:5000/api/v1/events/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notes

1. **Authentication**: Always include the JWT token in the Authorization header for protected routes
2. **CORS**: The API supports CORS for frontend integration
3. **Cookies**: Authentication tokens are also stored in HTTP-only cookies
4. **File Uploads**: Image uploads are handled via Cloudinary integration
5. **Date Format**: All dates should be in ISO 8601 format
6. **Validation**: All requests are validated; invalid data returns 400 error with details

---

## Support

For issues or questions:
- Check interactive docs: http://localhost:5000/api/docs
- Review error messages in response
- Check console logs for detailed error information
