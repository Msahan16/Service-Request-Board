const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Carpentry', 'Other'],
      default: 'Other'
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    postedBy: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('JobRequest', jobRequestSchema);
