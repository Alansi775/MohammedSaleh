/**
 * AI Language Model Service
 * Handles communication with LLM API
 * Fallback: Primary → Secondary
 */

import { logger } from '../utils/logger.js';

const PRIMARY_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const SECONDARY_API_URL = 'https://api.deepseek.com/chat/completions';

// Try Primary LLM first, fallback to Secondary LLM
export const generateResponse = async (message, language = 'en') => {
  try {
    logger.info('Attempting Primary LLM...');
    return await generateFromPrimaryLLM(message, language);
  } catch (error) {
    logger.warn(`Primary LLM failed: ${error.message}. Falling back to Secondary LLM...`);
    logger.info('Attempting Secondary LLM...');
    return await generateFromSecondaryLLM(message, language);
  }
};

// Primary LLM API call
const generateFromPrimaryLLM = async (message, language) => {
  const apiKey = process.env.LLM_API_KEY;
  const systemPrompt = process.env.SYSTEM_PROMPT || 'You are a helpful AI assistant.';

  if (!apiKey) {
    throw new Error('Primary LLM API key not configured');
  }

  const systemMessage = `${systemPrompt}\n\n${language === 'ar' ? 'سؤال المستخدم: ' : 'User question: '}${message}`;

  const response = await fetch(`${PRIMARY_API_URL}?key=${apiKey}`, {
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
    logger.error(`Primary LLM error: ${JSON.stringify(error)}`);
    throw new Error(`Primary LLM: ${response.statusText}`);
  }

  const data = await response.json();
  const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!aiResponse) {
    throw new Error('Invalid response from Primary LLM');
  }

  logger.info(`✓ Response from Primary LLM for: "${message.substring(0, 50)}..."`);
  return aiResponse;
};

// Secondary LLM API call (Fallback)
const generateFromSecondaryLLM = async (message, language) => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const systemPrompt = process.env.SYSTEM_PROMPT || 'You are a helpful AI assistant.';

  if (!apiKey) {
    throw new Error('Secondary LLM API key not configured');
  }

  const systemMessage = `${systemPrompt}\n\n${language === 'ar' ? 'سؤال المستخدم: ' : 'User question: '}${message}`;

  const response = await fetch(SECONDARY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    logger.error(`Secondary LLM error: ${JSON.stringify(error)}`);
    throw new Error(`Secondary LLM: ${response.statusText}`);
  }

  const data = await response.json();
  const aiResponse = data?.choices?.[0]?.message?.content;

  if (!aiResponse) {
    throw new Error('Invalid response from Secondary LLM');
  }

  logger.info(`✓ Response from Secondary LLM for: "${message.substring(0, 50)}..."`);
  return aiResponse;
};
