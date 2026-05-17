# Service Request Board - Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
PORT=5000
MONGO_URI=mongodb+srv://Sahan:Sahan%4012345@cluster0.hbzyi8n.mongodb.net/service-board
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

- `GET /api/jobs` - List all jobs (supports filters: category, status, search)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job
- `PATCH /api/jobs/:id` - Update job status
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/health` - Health check
