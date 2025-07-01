const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview Scheduled', 'Interview Completed', 'Rejected', 'Offer Received', 'Accepted'],
    default: 'Applied'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date
  },
  jdText: {
    type: String,
    default: ''
  },
  jobUrl: {
    type: String,
    default: ''
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  location: {
    type: String,
    default: ''
  },
  workType: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    default: 'Remote'
  },
  notes: {
    type: String,
    default: ''
  },
  aiSuggestions: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);