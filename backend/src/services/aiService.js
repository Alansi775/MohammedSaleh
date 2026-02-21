/**
 * AI Language Model Service
 * Handles communication with LLM API
 */

import { logger } from '../utils/logger.js';

const LLM_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateResponse = async (message, language = 'en') => {
  const apiKey = process.env.LLM_API_KEY;
  const systemPrompt = process.env.SYSTEM_PROMPT || 'You are a helpful AI assistant.';

  if (!apiKey) {
    logger.error('LLM_API_KEY is not set in environment variables');
    throw new Error('API key not configured');
  }

  try {
    const systemMessage = `${systemPrompt}\n\n${language === 'ar' ? 'سؤال المستخدم: ' : 'User question: '}${message}`;

    const response = await fetch(`${LLM_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemMessage,
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
      logger.error(`LLM API error: ${JSON.stringify(error)}`);
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the response text from API response structure
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      logger.error('Unexpected response structure from LLM API');
      throw new Error('Invalid response from AI service');
    }

    logger.info(`Generated response for message: "${message.substring(0, 50)}..."`);
    return aiResponse;
  } catch (error) {
    logger.error(`AI service error: ${error.message}`);
    throw error;
  }
};
