# QUICK START GUIDE

Get the Service Request Board running in 5 minutes!

## Prerequisites

- **Node.js 16+** ([Download](https://nodejs.org/))
- **MongoDB** ([Free Atlas account](https://mongodb.com/cloud/atlas) or local install)
- A code editor (VS Code recommended)

## Step 1: Extract & Navigate

```bash
cd "Service Request Board"
```

## Step 2: Backend Setup

```bash
cd backend
npm install
```

Create/verify `.env` file with:
```
PORT=5000
MONGO_URI=
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

You should see: `Server running on port 5000`

## Step 3: Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

You should see: `ready - started server on 0.0.0.0:3000`

## Step 4: Open Application

Open your browser and go to:
```
http://localhost:3000
```

## Step 5: Seed Sample Data (Optional)

In another terminal:
```bash
cd backend
node seed.js
```

This creates 8 sample jobs for testing.

---

## What You Can Do

✅ **Browse Jobs** - See all service requests on the home page
✅ **Search & Filter** - Find jobs by keyword, category, or status
✅ **Post a Job** - Create new service requests
✅ **View Details** - See full information about each job
✅ **Update Status** - Change job status (Open → In Progress → Closed)
✅ **Delete Jobs** - Remove jobs you no longer need

---

## Troubleshooting

**Port already in use?**
```bash
# Change PORT in backend .env to 5001
# Or kill the process using port 5000
```

**MongoDB connection error?**
- Verify `MONGO_URI` in `.env`
- Check internet connection
- Verify MongoDB credentials

**Frontend can't reach backend?**
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**Dependencies install failing?**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node version: `node --version`

---

## File Structure

```
Service Request Board/
├── backend/          ← Express API
│   ├── models/       
│   ├── routes/
│   ├── config/
│   └── index.js
├── frontend/         ← Next.js web app
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── styles/
└── README.md
```

---

## Testing Features

### Create a Job
1. Click "Post a Job" in header
2. Fill in all fields
3. Click "Post Request"

### Filter Jobs
1. Use category dropdown to filter
2. Use status dropdown to filter
3. Type in search box for keyword search

### Update Job
1. Click on any job card
2. Change status in dropdown
3. Click delete to remove

### Form Validation
- Try leaving fields empty
- Try invalid email
- Try text over character limit
- See error messages in real-time

---

## API Endpoints

All run on `http://localhost:5000/api`

```
GET    /jobs                  - List all jobs
GET    /jobs/:id              - Get single job
POST   /jobs                  - Create job
PATCH  /jobs/:id              - Update status
DELETE /jobs/:id              - Delete job
GET    /health                - Health check
```

---

## Documentation

- **[README.md](./README.md)** - Full project overview
- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production
- **[backend/README.md](./backend/README.md)** - Backend API docs
- **[frontend/README.md](./frontend/README.md)** - Frontend docs

---

## Features

### Core ✅
- Full CRUD for service requests
- Advanced filtering (category, status, search)
- Form validation with error messages
- SweetAlert notifications
- Responsive mobile-first design

### Tech Stack 🚀
- **Frontend**: Next.js, React, Tailwind CSS, SweetAlert2
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas

### Bonus Features (Easy to add)
- JWT authentication
- User profiles
- Email notifications
- Unit tests
- Deployment guides

---

## Keyboard Shortcuts

| Action | Windows | Mac |
|--------|---------|-----|
| Go to home | `Ctrl+Home` | `Cmd+Home` |
| Focus search | `Ctrl+/` | `Cmd+/` |
| Open dev tools | `F12` | `F12` |

---

## Need Help?

1. **Check logs** - Look at terminal output for errors
2. **Read docs** - See README.md and other guides
3. **Inspect element** - Right-click → Inspect in browser
4. **Check network** - DevTools → Network tab to see API calls

---

## Next Steps

After testing locally:

1. **Deploy to Production** - See [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Add Authentication** - Implement JWT login
3. **Add Email Notifications** - Send emails to tradespeople
4. **Deploy Database** - Set up MongoDB Atlas
5. **Collect Feedback** - User test and iterate

---

**Happy testing! 🎉**
