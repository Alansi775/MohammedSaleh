/**
 * Chat Routes
 * Handles POST /api/chat endpoint
 */

import express from 'express';
import { generateResponse } from '../services/aiService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      logger.warn('Invalid chat request: missing or invalid message');
      return res.status(400).json({
        error: 'Message is required and must be a string',
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message cannot be empty',
      });
    }

    // Validate language parameter
    if (!['en', 'ar'].includes(language)) {
      logger.warn(`Invalid language requested: ${language}`);
      return res.status(400).json({
        error: 'Language must be "en" or "ar"',
      });
    }

    // Generate AI response
    const aiResponse = await generateResponse(message, language);

    res.json({
      response: aiResponse,
      language,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Chat endpoint error: ${error.message}`);
    res.status(500).json({
      error: 'Failed to generate response. Please try again later.',
    });
  }
});

export default router;
