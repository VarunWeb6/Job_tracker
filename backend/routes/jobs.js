const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose'); // Import mongoose for the stats route
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// MODIFIED: Updated schema to match frontend data and be more flexible
const jobSchema = Joi.object({
  company: Joi.string().required(),
  role: Joi.string().required(),
  status: Joi.string().valid('Applied', 'Interview Scheduled', 'Interview Completed', 'Rejected', 'Offer Received', 'Accepted'),
  applicationDate: Joi.date().allow('', null), // ADDED THIS
  deadline: Joi.date().allow('', null),
  jdText: Joi.string().allow(''),
  jobUrl: Joi.string().allow(''),
  salary: Joi.object({
    min: Joi.number().allow(null, ''), // Allow null for flexibility
    max: Joi.number().allow(null, ''),
    currency: Joi.string().allow('')
  }).allow(null),
  location: Joi.string().allow(''),
  workType: Joi.string().valid('Remote', 'On-site', 'Hybrid').allow('', null),
  notes: Joi.string().allow(''),
  priority: Joi.string().valid('Low', 'Medium', 'High')
});

// Get all jobs for user
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, sort = '-applicationDate' } = req.query; // Default sort by most recent
    const filter = { userId: req.user._id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const jobs = await Job.find(filter).sort(sort);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single job
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create job
router.post('/', auth, async (req, res) => {
  try {
    const { error } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const job = new Job({
      ...req.body,
      userId: req.user._id
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// MODIFIED: Update job logic to handle partial updates (e.g., just status)
router.put('/:id', auth, async (req, res) => {
  try {
    // We don't use Joi here because a PUT request might only contain one field to update.
    // Mongoose's schema validation will handle type checking on the fields provided.
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body }, // Use $set to update only the provided fields
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// MODIFIED: Get job statistics in a clean, frontend-ready format
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const statsResult = await Job.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Transform the array into a simple key-value object
    const stats = statsResult.reduce((acc, item) => {
        const key = item._id; // "Applied", "Rejected", etc.
        acc[key] = item.count;
        return acc;
    }, {});

    const total = await Job.countDocuments({ userId: req.user._id });

    // Format the final object for the dashboard
    const formattedStats = {
        total: total,
        applied: stats['Applied'] || 0,
        interviews: (stats['Interview Scheduled'] || 0) + (stats['Interview Completed'] || 0),
        offers: (stats['Offer Received'] || 0) + (stats['Accepted'] || 0),
        rejected: stats['Rejected'] || 0,
    };

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;