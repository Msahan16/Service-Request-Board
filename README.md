# Service Request Board

A modern, full-stack web application for managing home service requests. Built as a technical assessment with Next.js, Express, and MongoDB.

## Overview

Service Request Board allows homeowners to post service requests (e.g., "Need a plumber for a leaking tap") and tradespeople can browse available requests, view details, and manage job statuses.

## Features

### Core Features ✅
- **Browse Service Requests**: List all available jobs with modern card-based UI
- **Advanced Filtering**: Filter by category, status, and keyword search
- **Post New Requests**: Easy-to-use form with validation
- **View Details**: Comprehensive job detail page with contact information
- **Manage Status**: Update job status (Open → In Progress → Closed)
- **Delete Jobs**: Remove jobs when needed
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Professional UI**: Modern, clean interface with SweetAlert notifications

### Additional Features
- Client-side form validation with real-time error feedback
- Global error handling with user-friendly messages
- RESTful API with proper HTTP status codes
- MongoDB integration with Mongoose ODM
- Reusable components and utility functions

## Tech Stack

### Frontend
- **Next.js 14** - App Router for routing
- **React 18** - UI components
- **Tailwind CSS** - Responsive styling
- **Axios** - HTTP client
- **SweetAlert2** - Beautiful alerts & confirmations

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **express-validator** - Input validation
- **CORS** - Cross-origin support

### Database
- **MongoDB Atlas** - Cloud database (free tier)

## Project Structure

```
Service Request Board/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── JobRequest.js      # Mongoose schema
│   ├── routes/
│   │   └── jobs.js            # API routes
│   ├── index.js               # Server entry
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── page.js            # Home/list page
│   │   ├── layout.js          # Root layout
│   │   └── jobs/
│   │       ├── new/page.js    # New job form
│   │       └── [id]/page.js   # Job detail
│   ├── components/
│   │   ├── Header.jsx         # Navigation
│   │   ├── Footer.jsx         # Footer
│   │   └── JobCard.jsx        # Job card component
│   ├── lib/
│   │   ├── api.js             # API client
│   │   ├── alerts.js          # Alert functions
│   │   └── utils.js           # Helper functions
│   ├── styles/
│   │   └── globals.css        # Global styles
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://Sahan:Sahan%4012345@cluster0.hbzyi8n.mongodb.net/service-board
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Documentation

Base URL: `http://localhost:5000/api`

### Endpoints

#### Get All Jobs
```
GET /jobs
Query Parameters:
  - category: string (e.g., "Plumbing")
  - status: "Open" | "In Progress" | "Closed"
  - search: string (searches title & description)
```

#### Get Single Job
```
GET /jobs/:id
```

#### Create Job
```
POST /jobs
Body: {
  title: string (required, max 100 chars),
  description: string (required, max 1000 chars),
  category: string (optional),
  location: string (required),
  contactName: string (required),
  contactEmail: string (required, valid email),
  status: "Open" | "In Progress" | "Closed" (optional, default: "Open")
}
```

#### Update Job Status
```
PATCH /jobs/:id
Body: {
  status: "Open" | "In Progress" | "Closed" (required)
}
```

#### Delete Job
```
DELETE /jobs/:id
```

## UI/UX Features

### Home Page
- Grid layout of job cards (responsive)
- Search bar for keyword search
- Category dropdown filter
- Status dropdown filter
- Job counter showing filtered results
- Loading state with spinner
- Empty state with helpful message

### New Job Form
- Multi-field form with validation
- Real-time character counters
- Error messages below fields
- Required field indicators
- Submit and cancel buttons
- SweetAlert for success/error feedback

### Job Detail Page
- Full job information display
- Status color coding
- Category and location badges
- Contact information section
- Status update dropdown
- Delete button with confirmation
- Job ID copy-to-clipboard feature
- Back navigation

## Validation

### Frontend Validation
- Title: Required, max 100 characters
- Description: Required, max 1000 characters
- Location: Required
- Contact Name: Required
- Contact Email: Required, valid email format

### Backend Validation
- All field validations repeated server-side
- Email format validation with regex
- Enum validation for status and category
- Length and format constraints

## Error Handling

- Global error handler in Express backend
- Consistent JSON error responses
- User-friendly alert messages
- 404 handling for missing resources
- Validation error details returned to frontend

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Responsive grid layouts
- Mobile navigation menu
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## Styling

- Tailwind CSS for utility-first styling
- Custom color scheme (blue primary, green success, red danger)
- Consistent spacing and typography
- Hover effects and transitions
- Color-coded status badges
- Shadow effects for depth

## Alerts & Notifications

Using SweetAlert2 for:
- Success messages after job creation
- Error notifications
- Delete confirmation dialogs
- Loading indicators
- Info messages

## Future Enhancements (Bonus Features)

- JWT authentication for secure operations
- User registration and login
- Tradesperson profiles
- Job acceptance system
- Rating and review system
- Email notifications
- Unit tests with Jest/Vitest
- Seed script for sample data
- Vercel/Render deployment
- Advanced search with filters
- Job history and archives

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

- No external state management needed (local useState)
- Modular component structure for scalability
- Reusable API client functions
- Utility functions for common operations
- Environment-based configuration
- RESTful API design principles

## Performance Considerations

- Next.js automatic code splitting
- Image optimization ready
- API call optimization with filters
- Client-side filtering for UX
- Responsive loading states

## Security

- Input validation on frontend and backend
- Email format validation
- CORS enabled for development
- No sensitive data in client code
- Environment variables for secrets

## Testing

To test the application:

1. Create multiple job requests from the form
2. Filter by different categories
3. Search by keywords
4. Update job statuses
5. Delete a job
6. Test form validation with invalid data
7. Test responsive design on mobile

## Contributing

This is an assessment project. For modifications:
1. Ensure validation on both frontend and backend
2. Maintain consistent UI/UX
3. Follow existing code patterns
4. Test all CRUD operations

## License

N/A - Technical Assessment

---

**Created for GlobalTNA Full-Stack Developer Intern Assessment**
#   S e r v i c e - R e q u e s t - B o a r d  
 