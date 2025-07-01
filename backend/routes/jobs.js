const express = require('express');
const Joi = require('joi');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

const jobSchema = Joi.object({
  company: Joi.string().required(),
  role: Joi.string().required(),
  status: Joi.string().valid('Applied', 'Interview Scheduled', 'Interview Completed', 'Rejected', 'Offer Received', 'Accepted'),
  deadline: Joi.date().allow('', null),
  jdText: Joi.string().allow(''),
  jobUrl: Joi.string().allow(''),
  salary: Joi.object({
    min: Joi.number(),
    max: Joi.number(),
    currency: Joi.string()
  }),
  location: Joi.string().allow(''),
  workType: Joi.string().valid('Remote', 'On-site', 'Hybrid'),
  notes: Joi.string().allow(''),
  priority: Joi.string().valid('Low', 'Medium', 'High')
});

// Get all jobs for user
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, sort = '-createdAt' } = req.query;
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

// Update job
router.put('/:id', auth, async (req, res) => {
  try {
    const { error } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
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

// Get job statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Job.countDocuments({ userId: req.user._id });

    res.json({ stats, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;