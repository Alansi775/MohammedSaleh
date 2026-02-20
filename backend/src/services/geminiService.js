/**
 * Gemini AI Service
 * Handles communication with Google's Gemini API
 */

import { logger } from '../utils/logger.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateResponse = async (message, language = 'en') => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.error('GEMINI_API_KEY is not set in environment variables');
    throw new Error('API key not configured');
  }

  try {
    const prompt = language === 'ar' 
      ? `أجب على هذا السؤال بشكل موجز: ${message}`
      : `Answer this question concisely: ${message}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error(`Gemini API error: ${JSON.stringify(error)}`);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the response text from Gemini's response structure
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      logger.error('Unexpected response structure from Gemini API');
      throw new Error('Invalid response from AI service');
    }

    logger.info(`Generated response for message: "${message.substring(0, 50)}..."`);
    return aiResponse;
  } catch (error) {
    logger.error(`Gemini service error: ${error.message}`);
    throw error;
  }
};
