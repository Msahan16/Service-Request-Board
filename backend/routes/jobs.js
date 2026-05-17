const express = require('express');
const { body, validationResult, query } = require('express-validator');
const JobRequest = require('../models/JobRequest');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

// GET /api/jobs - List all jobs with filters
router.get(
  '/',
  [
    query('category').optional().isString(),
    query('status').optional().isIn(['Open', 'In Progress', 'Closed']),
    query('search').optional().isString()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { category, status, search } = req.query;
      let filter = {};

      if (category) {
        filter.category = category;
      }

      if (status) {
        filter.status = status;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching jobs',
        error: error.message
      });
    }
  }
);

// GET /api/jobs/:id - Get a single job
router.get('/:id', async (req, res) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
});

// POST /api/jobs - Create a new job (Requires Authentication)
router.post(
  '/',
  authMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('category').optional().isIn(['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Carpentry', 'Other']),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('contactName').trim().notEmpty().withMessage('Contact name is required'),
    body('contactEmail').trim().isEmail().withMessage('Valid email is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, category, location, contactName, contactEmail, status } = req.body;

      const job = await JobRequest.create({
        title,
        description,
        category: category || 'Other',
        location,
        contactName,
        contactEmail,
        status: status || 'Open',
        userId: req.userId, // Associate job with user
        postedBy: req.userEmail
      });

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error creating job',
        error: error.message
      });
    }
  }
);

// PATCH /api/jobs/:id - Update job status
router.patch(
  '/:id',
  [
    body('status').isIn(['Open', 'In Progress', 'Closed']).withMessage('Invalid status')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { status } = req.body;

      const job = await JobRequest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Job status updated successfully',
        data: job
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating job',
        error: error.message
      });
    }
  }
);

// DELETE /api/jobs/:id - Delete a job (Requires Authentication)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Only allow user who created the job to delete it
    if (job.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job'
      });
    }

    await JobRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
});

module.exports = router;
