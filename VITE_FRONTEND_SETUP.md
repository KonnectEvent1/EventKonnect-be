# Connecting Vite Frontend to EventKonnect Backend

## ✅ CORS is Now Enabled!

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React/Next.js default)

---

## Quick Setup for Vite + React

### 1. Install Axios in your frontend
```bash
npm install axios
# or
yarn add axios
```

### 2. Create API Service (`src/services/api.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Important for cookies!
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to all requests
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

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

---

### 3. Create Auth Service (`src/services/auth.service.js`)

```javascript
import api from './api';

export const authService = {
  // Login
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Register Organizer
  async registerOrganizer(data) {
    return await api.post('/auth/signup/organiser', data);
  },

  // Register Vendor
  async registerVendor(data) {
    return await api.post('/auth/signup/vendor', data);
  },

  // Register Attendee
  async registerAttendee(data) {
    return await api.post('/auth/signup/attendee', data);
  },

  // Logout
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if logged in
  isLoggedIn() {
    return !!localStorage.getItem('accessToken');
  }
};
```

---

### 4. Test Connection (Quick Test Component)

```jsx
// src/components/TestConnection.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

function TestConnection() {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to fetch from backend
        const response = await fetch('http://localhost:5000/api/v1');
        if (response.ok) {
          setStatus('✅ Backend is connected!');
        } else {
          setStatus('⚠️ Backend responded but with an error');
        }
      } catch (err) {
        setError('❌ Cannot connect to backend. Is it running?');
        console.error('Connection error:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px' }}>
      <h2>Backend Connection Test</h2>
      <p>{error || status}</p>
      <small>Backend URL: http://localhost:5000/api/v1</small>
    </div>
  );
}

export default TestConnection;
```

---

### 5. Example Login Component

```jsx
// src/components/Login.jsx
import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/dashboard'); // Redirect after login
    } catch (err) {
      setError(err.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Login to EventKonnect</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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

### 6. Example Events List Component

```jsx
// src/components/EventsList.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get('/events/all');
      setEvents(response.data || []);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/attendees`);
      alert('Successfully registered!');
      loadEvents();
    } catch (err) {
      alert(err.error || 'Failed to register');
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-list">
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Budget:</strong> RWF {event.budget.toLocaleString()}</p>
              <button onClick={() => handleRSVP(event.id)}>
                Register
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsList;
```

---

## 🔒 Protected Routes Setup

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

function ProtectedRoute({ children }) {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
```

**Usage in App.jsx:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EventsList from './components/EventsList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events" 
          element={
            <ProtectedRoute>
              <EventsList />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🧪 Testing the Connection

### Option 1: Browser Console
```javascript
// Open browser console and run:
fetch('http://localhost:5000/api/v1')
  .then(res => console.log('Connected!', res))
  .catch(err => console.error('Error:', err));
```

### Option 2: Test Login
```bash
# From terminal
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

---

## 🔧 Environment Variables (Optional)

Create `.env` file in your Vite project:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_DOCS=http://localhost:5000/api/docs
```

Then use it in your code:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
```

---

## ⚠️ Common Issues

### 1. CORS Error
**Symptom:** "Access-Control-Allow-Origin" error in console

**Solution:** 
- Backend is already configured for `http://localhost:5173`
- Make sure backend is running
- Check browser console for exact error

### 2. Connection Refused
**Symptom:** "ERR_CONNECTION_REFUSED"

**Solution:**
- Start the backend: `cd EventKonnect-be && yarn start:dev`
- Verify it's running on port 5000

### 3. 401 Unauthorized
**Symptom:** All requests return 401

**Solution:**
- Make sure you're logged in
- Check if token is in localStorage
- Token might be expired - login again

---

## 📚 More Examples

For complete examples, see:
- [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) - Full integration guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md) - Quick snippets

---

## 🚀 Start Both Projects

**Terminal 1 (Backend):**
```bash
cd EventKonnect-be
yarn start:dev
```

**Terminal 2 (Frontend):**
```bash
cd your-vite-project
npm run dev
# or
yarn dev
```

Now your frontend at `http://localhost:5173` can connect to backend at `http://localhost:5000`! 🎉

---

## 🆘 Need Help?

1. Check backend is running: Visit http://localhost:5000/api/docs
2. Check frontend console for errors (F12)
3. Verify token is being sent in Network tab
4. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details

