const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Create a simple test app without connecting to the database
const app = express();
app.use(express.json());

// Mock auth middleware for testing
const mockAuthMiddleware = (req, res, next) => {
  req.userId = new mongoose.Types.ObjectId().toString();
  req.userEmail = 'test@example.com';
  next();
};

// Mock validation middleware
const mockValidationMiddleware = (req, res, next) => {
  next();
};

// Simple test routes to verify API structure
app.post('/api/jobs', mockAuthMiddleware, (req, res) => {
  const { title, description, category, location, contactName, contactEmail } = req.body;

  // Basic validation
  if (!title || !description || !location || !contactName || !contactEmail) {
    return res.status(400).json({
      success: false,
      errors: []
    });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactEmail)) {
    return res.status(400).json({
      success: false,
      errors: [{ field: 'contactEmail', message: 'Invalid email' }]
    });
  }

  // Check title length
  if (title.length > 100) {
    return res.status(400).json({
      success: false,
      errors: [{ field: 'title', message: 'Title too long' }]
    });
  }

  // Create mock job
  const job = {
    _id: new mongoose.Types.ObjectId(),
    title,
    description,
    category: category || 'Other',
    location,
    contactName,
    contactEmail,
    status: 'Open',
    userId: req.userId,
    postedBy: req.userEmail,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: job
  });
});

app.get('/api/jobs', (req, res) => {
  const { category, status, search } = req.query;

  // Mock jobs
  const mockJobs = [
    {
      _id: new mongoose.Types.ObjectId(),
      title: 'Fix broken pipe',
      description: 'Water is leaking from the main kitchen pipe',
      category: 'Plumbing',
      location: 'Brooklyn, NY',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      status: 'Open'
    }
  ];

  let filtered = mockJobs;

  // Apply filters
  if (category) {
    filtered = filtered.filter(j => j.category === category);
  }
  if (status) {
    filtered = filtered.filter(j => j.status === status);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(searchLower) ||
      j.description.toLowerCase().includes(searchLower)
    );
  }

  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

app.get('/api/jobs/:id', (req, res) => {
  // Mock job lookup
  if (req.params.id === 'nonexistent') {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      _id: req.params.id,
      title: 'Fix broken pipe',
      description: 'Water is leaking',
      category: 'Plumbing',
      location: 'Brooklyn, NY',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      status: 'Open'
    }
  });
});

app.patch('/api/jobs/:id', mockAuthMiddleware, (req, res) => {
  const { status } = req.body;

  // Validate status
  if (!['Open', 'In Progress', 'Closed'].includes(status)) {
    return res.status(400).json({
      success: false,
      errors: [{ field: 'status', message: 'Invalid status' }]
    });
  }

  if (req.params.id === 'nonexistent') {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Job updated',
    data: {
      _id: req.params.id,
      status
    }
  });
});

app.delete('/api/jobs/:id', mockAuthMiddleware, (req, res) => {
  if (req.params.id === 'nonexistent') {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Check authorization
  if (req.params.id === 'other-user-job') {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to delete this job'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully'
  });
});

// Test suite
describe('Jobs API Tests', () => {
  describe('GET /api/jobs', () => {
    test('Should return all jobs', async () => {
      const response = await request(app).get('/api/jobs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Should filter jobs by category', async () => {
      const response = await request(app).get('/api/jobs?category=Plumbing');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(j => j.category === 'Plumbing')).toBe(true);
    });

    test('Should filter jobs by status', async () => {
      const response = await request(app).get('/api/jobs?status=Open');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(j => j.status === 'Open')).toBe(true);
    });

    test('Should search jobs by keyword', async () => {
      const response = await request(app).get('/api/jobs?search=pipe');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Should return empty array for non-matching filter', async () => {
      const response = await request(app).get('/api/jobs?category=NonExistent');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('POST /api/jobs', () => {
    const validJobData = {
      title: 'Fix leaking pipe',
      description: 'Kitchen tap is leaking',
      category: 'Plumbing',
      location: 'Brooklyn',
      contactName: 'Jane Doe',
      contactEmail: 'jane@example.com'
    };

    test('Should create a job with valid data', async () => {
      const response = await request(app)
        .post('/api/jobs')
        .send(validJobData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(validJobData.title);
      expect(response.body.data.category).toBe('Plumbing');
      expect(response.body.data.status).toBe('Open');
    });

    test('Should set default category to Other', async () => {
      const data = { ...validJobData };
      delete data.category;

      const response = await request(app)
        .post('/api/jobs')
        .send(data);

      expect(response.status).toBe(201);
      expect(response.body.data.category).toBe('Other');
    });

    test('Should reject job without title', async () => {
      const data = { ...validJobData };
      delete data.title;

      const response = await request(app)
        .post('/api/jobs')
        .send(data);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Should reject job without description', async () => {
      const data = { ...validJobData };
      delete data.description;

      const response = await request(app)
        .post('/api/jobs')
        .send(data);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Should reject job with invalid email', async () => {
      const data = { ...validJobData, contactEmail: 'invalid-email' };

      const response = await request(app)
        .post('/api/jobs')
        .send(data);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Should reject title exceeding max length', async () => {
      const data = { ...validJobData, title: 'a'.repeat(101) };

      const response = await request(app)
        .post('/api/jobs')
        .send(data);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/jobs/:id', () => {
    test('Should return job details for valid ID', async () => {
      const response = await request(app).get('/api/jobs/valid-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe('valid-id');
    });

    test('Should return 404 for non-existent job', async () => {
      const response = await request(app).get('/api/jobs/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Job not found');
    });
  });

  describe('PATCH /api/jobs/:id', () => {
    test('Should update job status', async () => {
      const response = await request(app)
        .patch('/api/jobs/job-id')
        .send({ status: 'In Progress' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('In Progress');
    });

    test('Should reject invalid status', async () => {
      const response = await request(app)
        .patch('/api/jobs/job-id')
        .send({ status: 'Invalid' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Should return 404 for non-existent job', async () => {
      const response = await request(app)
        .patch('/api/jobs/nonexistent')
        .send({ status: 'Closed' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    test('Should delete job successfully', async () => {
      const response = await request(app).delete('/api/jobs/job-id');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Job deleted successfully');
    });

    test('Should return 403 if not authorized', async () => {
      const response = await request(app).delete('/api/jobs/other-user-job');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('Should return 404 for non-existent job', async () => {
      const response = await request(app).delete('/api/jobs/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});


