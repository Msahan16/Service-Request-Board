# Authentication & Authorization Guide

## Overview

The Service Request Board now includes JWT-based authentication to secure critical endpoints. Only logged-in users can create or delete service requests, while job listings remain publicly accessible.

## Authentication Architecture

### Technology Stack
- **JWT (JSON Web Tokens)**: Secure token-based authentication
- **bcryptjs**: Password hashing with salt rounds (10)
- **Middleware**: Custom authentication middleware for protected routes

### Flow Diagram

```
Frontend                          Backend
   |                               |
   +--Login/Register Request-----> |
   |                          +----+----+
   |                          | Validate|
   |                          | & Hash  |
   |                          +----+----+
   |                               |
   | <-------JWT Token-----------  |
   |  (stored in localStorage)     |
   |                               |
   +--API Request              (Attach Token)
   |  + Header:                    |
   |  Authorization: Bearer JWT    |
   |                               |
   |                          +----+----+
   |                          | Verify  |
   |                          | Token   |
   |                          +----+----+
   |                               |
   | <------API Response-----------+
```

## API Endpoints

### Authentication Routes

#### Register User
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**Validation Rules:**
- Email must be valid format
- Password must be at least 6 characters
- Name is required

---

#### Login User
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Protected Routes

#### Create Job (Protected)
**Endpoint:** `POST /api/jobs`

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Fix leaking tap",
  "description": "Kitchen tap has been leaking for days",
  "category": "Plumbing",
  "location": "London",
  "contactName": "Jane Smith",
  "contactEmail": "jane@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Fix leaking tap",
    "description": "Kitchen tap has been leaking for days",
    "category": "Plumbing",
    "location": "London",
    "contactName": "Jane Smith",
    "contactEmail": "jane@example.com",
    "status": "Open",
    "userId": "507f1f77bcf86cd799439011",
    "postedBy": "user@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided. Please log in."
}
```

**Response (Error - Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid or expired token. Please log in again."
}
```

---

#### Delete Job (Protected)
**Endpoint:** `DELETE /api/jobs/:id`

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

**Response (Error - Not Owner):**
```json
{
  "success": false,
  "message": "You are not authorized to delete this job"
}
```

---

## Frontend Integration

### Login/Register Pages

The application now includes two new pages:

#### `/login`
- Email and password login form
- Form validation
- Error handling
- Link to sign up page

#### `/register`
- Full registration form (name, email, password, confirm password)
- Password matching validation
- Form validation
- Link to login page

### Token Management

The frontend automatically:
1. Stores JWT token in `localStorage` after login
2. Retrieves token from `localStorage` for API requests
3. Includes token in `Authorization` header as `Bearer <token>`
4. Clears token on logout

### Usage in Components

```javascript
import { authAPI } from '@/lib/api';

// Check if user is authenticated
if (authAPI.isAuthenticated()) {
  // User is logged in
}

// Get current user info
const user = authAPI.getCurrentUser();
console.log(user.name);

// Logout
authAPI.logout();
```

### Protected Routes

The "Post a Job" page (`/jobs/new`) now checks authentication:
- Redirects to login if not authenticated
- Shows loading spinner during auth check
- Displays form only if user is logged in

---

## Security Features

### Password Security
- **Hashing Algorithm**: bcryptjs with 10 salt rounds
- Passwords are hashed before storing in database
- Never stored or transmitted in plain text

### Token Security
- **Algorithm**: HS256 (HMAC SHA-256)
- **Expiration**: 7 days
- **Secret**: Configured via `JWT_SECRET` environment variable
- Tokens include user ID and email

### Protected Endpoints
- `POST /api/jobs` - Create job (requires auth)
- `DELETE /api/jobs/:id` - Delete job (requires auth + ownership)
- `PATCH /api/jobs/:id` - Update job (requires auth)
- `GET /api/jobs` - List jobs (public)
- `GET /api/jobs/:id` - Get job details (public)

---

## Environment Variables

Required in `.env`:

```
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/service-board

# Server
PORT=5000
NODE_ENV=development
```

### Important Security Note
- **Never commit `.env` with real secrets**
- Change `JWT_SECRET` in production to a long, random string
- Use strong passwords in MongoDB URI
- Store secrets in environment variables or secure vaults

---

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | Request completed successfully |
| 201 | Created | Job or user created successfully |
| 400 | Bad Request | Check request data validation |
| 401 | Unauthorized | Login required or token invalid |
| 403 | Forbidden | Not authorized for this action |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Server-side error occurred |

---

## Testing Authentication

### Manual Testing Steps

1. **Register New User**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

2. **Login with Credentials**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Create Job with Token**
   ```bash
   curl -X POST http://localhost:5000/api/jobs \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{"title":"Fix pipe","description":"Leaking","category":"Plumbing","location":"London","contactName":"John","contactEmail":"john@example.com"}'
   ```

---

## Troubleshooting

### "Invalid or expired token"
- Token may have expired (7 days)
- Solution: Login again to get new token

### "No token provided"
- Token not sent in Authorization header
- Solution: Include `Authorization: Bearer <token>` header

### "You are not authorized to delete this job"
- You don't own this job
- Solution: Only delete jobs you created

### Password hashing fails
- bcryptjs not installed
- Solution: Run `npm install bcryptjs` in backend

---

## Next Steps

1. Deploy backend with production JWT secret
2. Set up MongoDB Atlas with authentication
3. Configure CORS for frontend domain
4. Enable HTTPS in production
5. Monitor authentication logs
6. Implement token refresh mechanism (optional)
7. Add two-factor authentication (optional)

---

For more information, see [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md)
