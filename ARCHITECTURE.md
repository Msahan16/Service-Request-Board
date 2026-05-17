# Architecture & Development Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Browser (Client)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS
          ┌───────────┴───────────┐
          ▼                       ▼
    ┌──────────────┐        ┌──────────────┐
    │   Frontend   │        │   Backend    │
    │  (Next.js)   │◄─────► │  (Express)   │
    │   Port 3000  │        │   Port 5000  │
    └──────────────┘        └──────┬───────┘
                                   │
                                   │ Mongoose
                                   ▼
                            ┌──────────────┐
                            │  MongoDB     │
                            │   Atlas      │
                            └──────────────┘
```

## Project Structure

### Backend (`/backend`)

```
backend/
├── config/
│   └── db.js              # MongoDB connection setup
├── models/
│   └── JobRequest.js      # Mongoose schema for jobs
├── routes/
│   └── jobs.js            # RESTful API routes
├── index.js               # Express app entry point
├── seed.js                # Sample data seeder
├── .env                   # Environment variables
├── .env.example           # Example env (for git)
├── .gitignore
├── package.json
└── README.md
```

### Frontend (`/frontend`)

```
frontend/
├── app/                   # Next.js App Router
│   ├── page.js            # Home page (lists jobs)
│   ├── layout.js          # Root layout
│   └── jobs/
│       ├── new/
│       │   └── page.js    # Create new job form
│       └── [id]/
│           └── page.js    # Job detail page
├── components/
│   ├── Header.jsx         # Navigation header
│   ├── Footer.jsx         # Footer component
│   └── JobCard.jsx        # Reusable job card
├── lib/
│   ├── api.js             # API client (axios)
│   ├── alerts.js          # SweetAlert helpers
│   └── utils.js           # Utility functions
├── styles/
│   └── globals.css        # Global Tailwind styles
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript config
├── .env.example
├── .env.local             # Local environment (not in git)
├── package.json
└── README.md
```

## Data Flow

### 1. User Creates a Job

```
Frontend Form Input
        │
        ▼
Client-side Validation
        │
        ▼
API Call (axios.post)
        │
        ▼
Backend Route Handler
        │
        ▼
Server-side Validation
        │
        ▼
MongoDB Mongoose Model
        │
        ▼
Insert to Database
        │
        ▼
JSON Response
        │
        ▼
Frontend Alert & Redirect
```

### 2. User Views Job List

```
Page Load
    │
    ▼
useEffect Hook
    │
    ▼
API Call (getAllJobs)
    │
    ▼
Backend Handler (filters applied)
    │
    ▼
MongoDB Query
    │
    ▼
JSON Response (jobs array)
    │
    ▼
setState (jobs data)
    │
    ▼
Client-side Filtering & Rendering
    │
    ▼
Display Job Cards
```

## API Design

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {},
  "errors": []
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Validation Strategy

### Frontend Validation
- Real-time error feedback
- Character counters
- Email format checking
- Required field validation
- User-friendly error messages

### Backend Validation
- Duplicate all frontend validation
- Additional security validation
- Database constraint validation
- Protect against malicious input

### Validation Flow
```
User Input
    │
    ├─► Frontend Validation (instant feedback)
    │
    ├─► API Submission (if valid)
    │
    └─► Backend Validation (security layer)
```

## State Management

Currently using **React Hooks** (no Redux needed for this scope):

```javascript
// Home page state
const [jobs, setJobs] = useState([]);           // All jobs
const [filteredJobs, setFilteredJobs] = useState([]); // After filters
const [selectedCategory, setSelectedCategory] = useState('All');
const [selectedStatus, setSelectedStatus] = useState('All');
const [searchQuery, setSearchQuery] = useState('');
const [loading, setLoading] = useState(true);
```

### State Update Pattern
```
User Action
    │
    ▼
Handler Function
    │
    ├─► setLoading(true)
    │
    ├─► API Call
    │
    ├─► setLoading(false)
    │
    └─► setState(newData) OR showAlert(error)
```

## Routing Architecture

### Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `page.js` | Job list with filters |
| `/jobs/new` | `new/page.js` | Create new job form |
| `/jobs/[id]` | `[id]/page.js` | Job details & management |

### Backend Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/jobs` | List jobs with filters |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create new job |
| PATCH | `/api/jobs/:id` | Update job status |
| DELETE | `/api/jobs/:id` | Delete job |
| GET | `/api/health` | Health check |

## Styling Strategy

### Tailwind CSS Approach
- Utility-first CSS framework
- Pre-configured color scheme
- Responsive design breakpoints
- Custom component classes

### Responsive Breakpoints
```
Mobile: 375px-640px   (sm)
Tablet: 641px-1024px  (md)
Desktop: 1025px+      (lg)
```

### Color Scheme
```
Primary: #2563eb (Blue)
Secondary: #1e40af (Dark Blue)
Success: #10b981 (Green)
Danger: #ef4444 (Red)
Warning: #f59e0b (Amber)
```

## Database Schema

### JobRequest Collection

```javascript
{
  _id: ObjectId,
  title: String (required, max 100),
  description: String (required, max 1000),
  category: String (enum: [...], default: "Other"),
  location: String (required),
  contactName: String (required),
  contactEmail: String (required, regex validated),
  status: String (enum: ["Open", "In Progress", "Closed"], default: "Open"),
  createdAt: Date (auto-set),
  updatedAt: Date (auto-updated)
}
```

### Indexes
```javascript
// Recommended MongoDB indexes
db.jobrequests.createIndex({ "category": 1 })
db.jobrequests.createIndex({ "status": 1 })
db.jobrequests.createIndex({ "createdAt": -1 })
db.jobrequests.createIndex({ "title": "text", "description": "text" })
```

## Error Handling Strategy

### Frontend Error Handling
```javascript
try {
  // API call
} catch (error) {
  // Extract error message from various sources
  const message = error.response?.data?.message 
                  || error.message 
                  || 'Unknown error';
  showAlert('error', message);
}
```

### Backend Error Handling
```javascript
// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
```

## Performance Considerations

### Frontend Optimization
- Code splitting (automatic with Next.js)
- Image optimization (ready for implementation)
- Client-side filtering for better UX
- Lazy loading of routes

### Backend Optimization
- MongoDB query optimization with indexes
- Connection pooling
- Gzip compression
- Response caching headers

### Database Optimization
- Indexes on frequently queried fields
- Lean queries (exclude unnecessary fields)
- Pagination ready (scalable)

## Security Measures

### Input Validation
- All inputs validated on frontend (UX)
- All inputs validated on backend (security)
- Email regex validation
- String length limits
- Type checking

### API Security
- CORS enabled for development
- No sensitive data in responses
- HTTP status codes for security
- Environment variables for secrets
- No console logging of sensitive data

### Data Protection
- Passwords not stored (not applicable yet)
- Email format validation
- No SQL injection (using MongoDB ODM)
- No XSS (React escapes by default)

## Testing Strategy

### Frontend Testing
- Manual UI testing
- Form validation testing
- Responsive design testing
- Browser compatibility testing

### Backend Testing
- API endpoint testing with Postman
- Validation error testing
- Database CRUD testing
- Error handling testing

### Integration Testing
- Full user workflow testing
- Multi-filter testing
- Error recovery testing

## Development Workflow

### Local Development
```bash
# Terminal 1
cd backend
npm run dev    # Auto-reloads with nodemon

# Terminal 2
cd frontend
npm run dev    # Auto-reloads with Next.js
```

### Code Style
- Use consistent indentation (2 spaces)
- Use meaningful variable names
- Use ES6+ features
- Use functional components (React)
- Add comments for complex logic

### Git Workflow
```bash
git checkout -b feature/feature-name
# Make changes
git add .
git commit -m "feat: description"
git push origin feature/feature-name
# Create PR
```

## Scaling Considerations

### Current Bottlenecks
- Single database node (solved by MongoDB Atlas cluster)
- Backend running on single server
- Frontend CDN (Vercel handles this)

### Scaling Solutions
- Backend: Load balancer with multiple instances
- Database: MongoDB Atlas cluster scaling
- Frontend: Global CDN (Vercel)
- Caching: Redis for frequently accessed data

### Database Scaling
```
Single Collection → Sharding (by location, category, etc.)
```

## Monitoring & Logging

### Development
```javascript
console.log('Msg');      // Info
console.error('Error');  // Errors
console.warn('Warning'); // Warnings
```

### Production
- Sentry for error tracking
- DataDog for monitoring
- LogRocket for frontend analytics
- MongoDB Atlas monitoring tools

## Future Enhancements

### Phase 2: Authentication
- User registration/login
- JWT tokens
- Password hashing (bcrypt)
- Role-based access control

### Phase 3: Advanced Features
- User profiles
- Rating system
- Email notifications
- Image uploads
- Payment processing

### Phase 4: Enterprise
- Admin dashboard
- Analytics
- API rate limiting
- Advanced search with Elasticsearch

## Code Examples

### Creating a Job (Frontend)
```javascript
const response = await jobsAPI.createJob(formData);
if (response.success) {
  await showSuccess('Job created!');
  router.push(`/jobs/${response.data._id}`);
}
```

### Updating Status (Backend)
```javascript
router.patch('/:id',
  body('status').isIn(['Open', 'In Progress', 'Closed']),
  handleValidationErrors,
  async (req, res) => {
    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: job });
  }
);
```

## Deployment Architecture

### Development
```
Localhost:3000 ←→ Localhost:5000 ←→ MongoDB Local/Atlas
```

### Production
```
Vercel (Next.js) ←→ Render/Railway (Express) ←→ MongoDB Atlas
```

## Environment-Specific Configs

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5000
DEBUG=true
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
DEBUG=false
SENTRY_DSN=https://...
```

---

This architecture is designed to be:
- **Simple**: Easy to understand and maintain
- **Scalable**: Ready for growth
- **Secure**: Proper validation at all layers
- **Performant**: Optimized queries and caching
- **Maintainable**: Clear separation of concerns
