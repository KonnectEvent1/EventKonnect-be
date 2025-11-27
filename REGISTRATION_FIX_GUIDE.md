# Fixing Registration Errors - EventKonnect

## The Problem

You're getting a **400 Bad Request** error when trying to register an attendee. This happens when the data sent from your frontend doesn't match what the backend expects.

---

## ✅ Correct Registration Data Formats

### 1. Register Attendee

**Required Fields:**
- `username` (string) - Must not be empty
- `email` (string) - Must be valid email format
- `password` (string) - Must be at least 8 characters AND contain at least one special character (!@#$%^&*(),.?":{}|<>)
- `phone` (string, optional) - Phone number

**Optional Fields:**
- `ticketType` (string, optional) - Must be one of: "VIP", "Regular", "Early Bird", "Student"

**Correct Example:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "phone": "+250788123456",
  "ticketType": "Regular"
}
```

---

### 2. Register Organizer

**Required Fields:**
- `username` (string)
- `email` (string) - Valid email
- `password` (string) - 8+ chars with special character
- `phone` (string, optional)

**Additional Fields:**
- `organisationName` (string) - Name of organization
- `address` (string, optional) - Physical address

**Correct Example:**
```json
{
  "username": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass@123",
  "phone": "+250788123456",
  "organisationName": "Event Masters Rwanda",
  "address": "Kigali, Rwanda"
}
```

---

### 3. Register Vendor

**Required Fields:**
- `username` (string)
- `email` (string) - Valid email
- `password` (string) - 8+ chars with special character
- `phone` (string, optional)

**Additional Fields:**
- `companyName` (string) - Company name
- `companyWebsite` (string, optional) - Website URL
- `serviceArea` (string, optional) - Service category
- `description` (string, optional) - Company description
- `services` (array of strings, optional) - List of services
- `pricing` (object, optional) - Pricing information

**Correct Example:**
```json
{
  "username": "Vendor Name",
  "email": "vendor@example.com",
  "password": "SecurePass@123",
  "phone": "+250788123456",
  "companyName": "Amazing Events Co.",
  "companyWebsite": "https://amazing-events.com",
  "serviceArea": "Catering & Food Services",
  "description": "Professional event catering services",
  "services": ["Catering", "Decoration", "Photography"],
  "pricing": {
    "basic": 100,
    "standard": 250,
    "premium": 500
  }
}
```

---

## 🔍 Common Validation Errors

### 1. Password Issues

❌ **Wrong:**
```json
{
  "password": "password"  // Too short, no special character
}
```

✅ **Correct:**
```json
{
  "password": "Password@123"  // 8+ characters, has special character
}
```

### 2. Email Issues

❌ **Wrong:**
```json
{
  "email": "notanemail"  // Invalid email format
}
```

✅ **Correct:**
```json
{
  "email": "user@example.com"
}
```

### 3. Username Issues

❌ **Wrong:**
```json
{
  "username": ""  // Empty string
}
```

✅ **Correct:**
```json
{
  "username": "John Doe"
}
```

### 4. TicketType Issues (Attendee only)

❌ **Wrong:**
```json
{
  "ticketType": "Premium"  // Invalid type
}
```

✅ **Correct:**
```json
{
  "ticketType": "VIP"  // Must be: VIP, Regular, Early Bird, or Student
}
```

---

## 🛠️ Frontend Fix - React Component

Update your registration component to ensure validation:

```jsx
// src/components/Register.jsx
import { useState } from 'react';
import api from '../services/api';

function Register() {
  const [userType, setUserType] = useState('attendee');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    // Attendee
    ticketType: 'Regular',
    // Organizer
    organisationName: '',
    address: '',
    // Vendor
    companyName: '',
    companyWebsite: '',
    serviceArea: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    // Check required fields
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Validate password
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    // Check for special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(formData.password)) {
      setError('Password must contain at least one special character');
      return false;
    }
    
    // User type specific validation
    if (userType === 'organiser' && !formData.organisationName.trim()) {
      setError('Organisation name is required for organizers');
      return false;
    }
    
    if (userType === 'vendor' && !formData.companyName.trim()) {
      setError('Company name is required for vendors');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      let endpoint = '';
      let payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
      };

      // Add user type specific fields
      switch (userType) {
        case 'attendee':
          endpoint = '/auth/signup/attendee';
          if (formData.ticketType) {
            payload.ticketType = formData.ticketType;
          }
          break;
          
        case 'organiser':
          endpoint = '/auth/signup/organiser';
          payload.organisationName = formData.organisationName.trim();
          if (formData.address.trim()) {
            payload.address = formData.address.trim();
          }
          break;
          
        case 'vendor':
          endpoint = '/auth/signup/vendor';
          payload.companyName = formData.companyName.trim();
          if (formData.companyWebsite.trim()) {
            payload.companyWebsite = formData.companyWebsite.trim();
          }
          if (formData.serviceArea.trim()) {
            payload.serviceArea = formData.serviceArea.trim();
          }
          break;
      }

      console.log('Sending registration data:', payload); // Debug log
      
      const response = await api.post(endpoint, payload);
      
      alert('Registration successful! Please check your email to verify your account.');
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different error types
      if (err.message) {
        setError(err.message);
      } else if (err.error) {
        setError(err.error);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Registration failed. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-container">
      <h2>Register for EventKonnect</h2>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          marginBottom: '15px',
          color: '#c33'
        }}>
          {error}
        </div>
      )}
      
      {/* User Type Selector */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          type="button"
          onClick={() => setUserType('attendee')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: userType === 'attendee' ? '#007bff' : '#e0e0e0',
            color: userType === 'attendee' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Attendee
        </button>
        <button 
          type="button"
          onClick={() => setUserType('organiser')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: userType === 'organiser' ? '#007bff' : '#e0e0e0',
            color: userType === 'organiser' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Organizer
        </button>
        <button 
          type="button"
          onClick={() => setUserType('vendor')}
          style={{
            padding: '10px 20px',
            backgroundColor: userType === 'vendor' ? '#007bff' : '#e0e0e0',
            color: userType === 'vendor' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Vendor
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Common Fields */}
        <input
          type="text"
          name="username"
          placeholder="Full Name *"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password (min 8 chars, include special char) *"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <small style={{ display: 'block', marginBottom: '10px', color: '#666' }}>
          Password must be at least 8 characters and contain a special character (!@#$%^&*)
        </small>
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        {/* Attendee Specific */}
        {userType === 'attendee' && (
          <select
            name="ticketType"
            value={formData.ticketType}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
          >
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
            <option value="Early Bird">Early Bird</option>
            <option value="Student">Student</option>
          </select>
        )}

        {/* Organizer Specific */}
        {userType === 'organiser' && (
          <>
            <input
              type="text"
              name="organisationName"
              placeholder="Organisation Name *"
              value={formData.organisationName}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <input
              type="text"
              name="address"
              placeholder="Address (optional)"
              value={formData.address}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
            />
          </>
        )}

        {/* Vendor Specific */}
        {userType === 'vendor' && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name *"
              value={formData.companyName}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <input
              type="url"
              name="companyWebsite"
              placeholder="Company Website (optional)"
              value={formData.companyWebsite}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <select
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }}
            >
              <option value="">Select Service Area (optional)</option>
              <option value="Catering & Food Services">Catering & Food Services</option>
              <option value="Venue Providers">Venue Providers</option>
              <option value="Decor & Design">Decor & Design</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Photography & Videography">Photography & Videography</option>
              <option value="Logistics & Rentals">Logistics & Rentals</option>
              <option value="Fashion & Beauty">Fashion & Beauty</option>
              <option value="Printing & Branding">Printing & Branding</option>
              <option value="Technology & Services">Technology & Services</option>
              <option value="Security & Safety">Security & Safety</option>
              <option value="Others">Others</option>
            </select>
          </>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;
```

---

## 🧪 Test with cURL

Test your endpoint directly:

```bash
# Test Attendee Registration
curl -X POST http://localhost:5000/api/v1/auth/signup/attendee \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Test User",
    "email": "test@example.com",
    "password": "Password@123",
    "phone": "+250788123456",
    "ticketType": "Regular"
  }'
```

If this works but your frontend doesn't, the issue is in your frontend code.

---

## 📝 Debugging Tips

1. **Check Browser Console** - Look for the actual error response
2. **Check Network Tab** - See what data is actually being sent
3. **Add Console Logs** - Log the payload before sending:
   ```javascript
   console.log('Sending:', payload);
   ```

4. **Check Backend Logs** - The backend should show validation errors

---

## ⚠️ Common Mistakes

1. Sending empty strings instead of omitting optional fields
2. Wrong password format (too short or no special character)
3. Invalid email format
4. Wrong ticketType value
5. Missing required fields for specific user types

---

**Need more help?** Share your frontend registration code and I can help fix the specific issue!
