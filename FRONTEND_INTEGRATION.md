# Frontend Integration Guide

## Quick Start for Frontend Developers

### Base Configuration

```javascript
// config/api.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api/v1',
  DOCS_URL: 'http://localhost:5000/api/docs',
  TIMEOUT: 30000,
  FRONTEND_URL: 'http://localhost:5173'
};
```

---

## Setup Axios (Recommended)

### Install Axios
```bash
npm install axios
# or
yarn add axios
```

### Create API Service
```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only data part
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden:', data.error);
          break;
        case 404:
          console.error('Not found:', data.error);
          break;
        case 500:
          console.error('Server error:', data.error);
          break;
        default:
          console.error('Error:', data.error);
      }
      
      return Promise.reject(data);
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## Authentication Service

```javascript
// services/auth.service.js
import api from './api';

class AuthService {
  // Register Organizer
  async registerOrganizer(data) {
    const response = await api.post('/auth/signup/organiser', data);
    return response;
  }

  // Register Vendor
  async registerVendor(data) {
    const response = await api.post('/auth/signup/vendor', data);
    return response;
  }

  // Register Attendee
  async registerAttendee(data) {
    const response = await api.post('/auth/signup/attendee', data);
    return response;
  }

  // Login
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data && response.data.access_token) {
      // Store token and user info
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  // Logout
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Get current user from storage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('accessToken');
  }

  // Verify email
  async verifyEmail(token) {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response;
  }
}

export default new AuthService();
```

---

## User Service

```javascript
// services/user.service.js
import api from './api';

class UserService {
  // Get current user profile
  async getProfile() {
    const response = await api.get('/user/me');
    return response;
  }

  // Update user profile
  async updateProfile(data) {
    const response = await api.put('/user/update', data);
    
    // Update user in localStorage
    if (response.data) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...response.data
      }));
    }
    
    return response;
  }

  // Delete user account
  async deleteAccount() {
    const response = await api.delete('/user/delete');
    
    // Clear storage after deletion
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    return response;
  }
}

export default new UserService();
```

---

## Event Service

```javascript
// services/event.service.js
import api from './api';

class EventService {
  // Get all events
  async getAllEvents() {
    const response = await api.get('/events/all');
    return response;
  }

  // Get event by ID
  async getEventById(eventId) {
    const response = await api.get(`/events/${eventId}`);
    return response;
  }

  // Create event
  async createEvent(eventData) {
    const response = await api.post('/events/create', eventData);
    return response;
  }

  // Update event
  async updateEvent(eventId, eventData) {
    const response = await api.patch(`/events/update/${eventId}`, eventData);
    return response;
  }

  // Delete event
  async deleteEvent(eventId) {
    const response = await api.delete(`/events/delete/${eventId}`);
    return response;
  }

  // Update event status
  async updateEventStatus(eventId, status) {
    const response = await api.patch(`/events/status/${eventId}`, { status });
    return response;
  }

  // Register for event (RSVP)
  async registerForEvent(eventId) {
    const response = await api.post(`/events/${eventId}/attendees`);
    return response;
  }

  // Get event attendees
  async getEventAttendees(eventId) {
    const response = await api.get(`/events/${eventId}/attendees`);
    return response;
  }

  // Update attendee status
  async updateAttendeeStatus(eventId, userId, status) {
    const response = await api.patch(
      `/events/${eventId}/attendees/${userId}/status`,
      { status }
    );
    return response;
  }
}

export default new EventService();
```

---

## React Example Components

### Login Component
```jsx
// components/Login.jsx
import React, { useState } from 'react';
import AuthService from '../services/auth.service';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login(email, password);
      console.log('Login successful:', response);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.error || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to EventKonnect</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
```

---

### Register Component
```jsx
// components/Register.jsx
import React, { useState } from 'react';
import AuthService from '../services/auth.service';

function Register() {
  const [userType, setUserType] = useState('attendee'); // attendee, vendor, organiser
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    // Additional fields based on user type
    organisationName: '',
    companyName: '',
    serviceArea: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      
      switch (userType) {
        case 'organiser':
          response = await AuthService.registerOrganizer(formData);
          break;
        case 'vendor':
          response = await AuthService.registerVendor(formData);
          break;
        case 'attendee':
          response = await AuthService.registerAttendee(formData);
          break;
        default:
          throw new Error('Invalid user type');
      }
      
      setSuccess(true);
      console.log('Registration successful:', response);
      
      // Show success message and redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (err) {
      setError(err.error || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register for EventKonnect</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Registration successful! Please check your email to verify your account.
          Redirecting to login...
        </div>
      )}
      
      <div className="user-type-selector">
        <button 
          className={userType === 'attendee' ? 'active' : ''}
          onClick={() => setUserType('attendee')}
        >
          Attendee
        </button>
        <button 
          className={userType === 'organiser' ? 'active' : ''}
          onClick={() => setUserType('organiser')}
        >
          Organizer
        </button>
        <button 
          className={userType === 'vendor' ? 'active' : ''}
          onClick={() => setUserType('vendor')}
        >
          Vendor
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        
        {userType === 'organiser' && (
          <input
            type="text"
            name="organisationName"
            placeholder="Organisation Name"
            value={formData.organisationName}
            onChange={handleChange}
            required
          />
        )}
        
        {userType === 'vendor' && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="serviceArea"
              placeholder="Service Area"
              value={formData.serviceArea}
              onChange={handleChange}
            />
          </>
        )}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;
```

---

### Events List Component
```jsx
// components/EventsList.jsx
import React, { useState, useEffect } from 'react';
import EventService from '../services/event.service';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await EventService.getAllEvents();
      setEvents(response.data || []);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      await EventService.registerForEvent(eventId);
      alert('Successfully registered for event!');
      loadEvents(); // Reload events
    } catch (err) {
      alert(err.error || 'Failed to register for event');
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-container">
      <h2>Upcoming Events</h2>
      
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            {event.images && event.images[0] && (
              <img src={event.images[0].url} alt={event.title} />
            )}
            
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Budget:</strong> RWF {event.budget.toLocaleString()}</p>
            <p><strong>Status:</strong> {event.status}</p>
            
            <button onClick={() => handleRSVP(event.id)}>
              Register for Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsList;
```

---

## Protected Route Component

```jsx
// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const isLoggedIn = AuthService.isLoggedIn();
  const currentUser = AuthService.getCurrentUser();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;

// Usage in App.js:
// <Route 
//   path="/dashboard" 
//   element={
//     <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
//       <Dashboard />
//     </ProtectedRoute>
//   } 
// />
```

---

## TypeScript Types (Optional)

```typescript
// types/index.ts

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  date: string;
  budget: number;
  status: 'active' | 'cancelled' | 'postponed' | 'completed';
  organizerId: string;
  organizer?: User;
  images?: Array<{ url: string; publicId: string }>;
  attendees?: EventAttendee[];
  createdAt: string;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN';
  user?: User;
  createdAt: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  error: string;
}
```

---

## Environment Variables

Create `.env` file in your frontend project:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_API_DOCS=http://localhost:5000/api/docs
```

---

## Common Issues and Solutions

### 1. CORS Errors
The backend is configured for CORS with these origins:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React/Next.js default)

If you're using a different port, add it in `src/main.ts`:
```typescript
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:YOUR_PORT'],
  credentials: true,
  // ...
});
```

### 2. 401 Unauthorized
- Check if token is being sent in headers
- Verify token is not expired
- Ensure token is stored correctly

### 3. Token Expiry
Implement token refresh logic or redirect to login when token expires (handled in interceptor).

---

## Best Practices

1. **Store tokens securely** - Use localStorage or sessionStorage
2. **Handle errors gracefully** - Show user-friendly error messages
3. **Loading states** - Always show loading indicators
4. **Form validation** - Validate on frontend before API calls
5. **Error boundaries** - Implement React error boundaries
6. **Logout on 401** - Automatically logout when token expires

---

## Testing API

Before integrating, test API endpoints using:
- Swagger UI: http://localhost:5000/api/docs
- Postman
- cURL commands

This ensures the backend is working correctly before frontend integration.
