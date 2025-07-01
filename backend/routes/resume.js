const express = require('express');
const axios = require('axios');
const Joi = require('joi');
const auth = require('../middleware/auth');
const Job = require('../models/Job');

const router = express.Router();

const suggestSchema = Joi.object({
  resumeText: Joi.string().required(),
  jobId: Joi.string().required()
});

// Get AI resume suggestions
router.post('/suggest', auth, async (req, res) => {
  try {
    const { error } = suggestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { resumeText, jobId } = req.body;

    const job = await Job.findOne({ _id: jobId, userId: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OpenAI API key not configured' });
    }

    const prompt = `Given the resume:
${resumeText}

and the job description:
${job.jdText}

Provide specific, actionable suggestions to improve the resume to better match this job. Focus on:
1. Keywords to add or emphasize
2. Skills to highlight
3. Experience to restructure or emphasize
4. Sections to add or improve

Provide the response in a structured format with clear recommendations.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume consultant. Provide specific, actionable advice to help job seekers improve their resumes.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const suggestions = response.data.choices[0].message.content;

    // Save suggestions to job
    job.aiSuggestions = suggestions;
    await job.save();

    res.json({ suggestions });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to get AI suggestions',
      error: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;