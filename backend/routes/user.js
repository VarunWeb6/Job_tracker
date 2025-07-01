const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  resume: Joi.string().allow(''),
  preferences: Joi.object({
    emailReminders: Joi.boolean(),
    reminderDays: Joi.number().min(1).max(30)
  })
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, select: '-password' }
    );

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;