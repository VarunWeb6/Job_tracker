// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please provide role'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview Scheduled', 'Interview Completed', 'Rejected', 'Offer Received', 'Accepted'],
    default: 'Applied'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
  },
  jdText: { // Corresponds to 'description' on the frontend
    type: String,
    default: ''
  },
  jobUrl: {
    type: String,
    default: ''
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: '$' }
  },
  location: {
    type: String,
    default: ''
  },
  workType: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
  },
  notes: {
    type: String,
    default: ''
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);