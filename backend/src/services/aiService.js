/**
 * AI Language Model Service
 * Handles communication with LLM APIs
 * Fallback: Primary (Groq) → Secondary (Gemini) → Tertiary (DeepSeek)
 */

import { logger } from '../utils/logger.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// Main export: Try Groq → Gemini → DeepSeek
export const generateResponse = async (message, language = 'en') => {
  try {
    logger.info('🔵 Attempting Primary LLM (Groq)...');
    return await generateFromGroq(message, language);
  } catch (error) {
    logger.warn(`❌ Primary LLM (Groq) failed: ${error.message}`);
    logger.info('🟡 Attempting Secondary LLM (Gemini)...');
    try {
      return await generateFromGemini(message, language);
    } catch (secondaryError) {
      logger.warn(`❌ Secondary LLM (Gemini) failed: ${secondaryError.message}`);
      logger.info('🟠 Attempting Tertiary LLM (DeepSeek)...');
      try {
        return await generateFromDeepSeek(message, language);
      } catch (tertiaryError) {
        logger.error(`❌ Tertiary LLM (DeepSeek) also failed: ${tertiaryError.message}`);
        throw new Error(
          `All LLM services failed. Groq: ${error.message} | Gemini: ${secondaryError.message} | DeepSeek: ${tertiaryError.message}`
        );
      }
    }
  }
};

// Primary LLM: Groq
const generateFromGroq = async (message, language) => {
  const apiKey = process.env.GROQ_API_KEY;
  const systemPrompt = process.env.SYSTEM_PROMPT || 'You are a helpful AI assistant.';

  if (!apiKey) {
    logger.error('⚠️ Primary LLM (Groq): API key not configured!');
    throw new Error('Groq API key not configured');
  }

  logger.info('📡 Primary LLM (Groq): Sending request...');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
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
    const statusCode = response.status;
    logger.error(`Primary LLM (Groq) error (${statusCode}): ${JSON.stringify(error)}`);
    
    if (statusCode === 429) {
      throw new Error(`Groq rate limit (429): ${error?.error?.message || 'Too many requests'}`);
    }
    if (statusCode >= 500) {
      throw new Error(`Groq server error (${statusCode}): ${error?.error?.message || response.statusText}`);
    }
    throw new Error(`Groq error: ${response.statusText}`);
  }

  const data = await response.json();
  const aiResponse = data?.choices?.[0]?.message?.content;

  if (!aiResponse) {
    throw new Error('Invalid response from Groq');
  }

  logger.info(`✅ Response from Primary LLM (Groq) for: "${message.substring(0, 50)}..."`);
  return aiResponse;
};

// Secondary LLM: Gemini
const generateFromGemini = async (message, language) => {
  const apiKey = process.env.LLM_API_KEY;
  const systemPrompt = process.env.SYSTEM_PROMPT || 'You are a helpful AI assistant.';

  if (!apiKey) {
    logger.error('⚠️ Secondary LLM (Gemini): API key not configured!');
    throw new Error('Gemini API key not configured');
  }

  logger.info('📡 Secondary LLM (Gemini): Sending request...');

  const systemMessage = `${systemPrompt}\n\n${language === 'ar' ? 'سؤال المستخدم: ' : 'User question: '}${message}`;

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
    const statusCode = response.status;
    logger.error(`Secondary LLM (Gemini) error (${statusCode}): ${JSON.stringify(error)}`);
    
    if (statusCode === 429) {
      throw new Error(`Gemini rate limit (429): ${error?.error?.message || 'Resource exhausted'}`);
    }
    if (statusCode >= 500) {
      throw new Error(`Gemini server error (${statusCode}): ${error?.error?.message || response.statusText}`);
    }
    throw new Error(`Gemini error: ${response.statusText}`);
  }

  const data = await response.json();
  const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!aiResponse) {
    throw new Error('Invalid response from Gemini');
  }

  logger.info(`✅ Response from Secondary LLM (Gemini) for: "${message.substring(0, 50)}..."`);
  return aiResponse;
};

// Tertiary LLM: DeepSeek
const generateFromDeepSeek = async (message, language) => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const systemPrompt = process.env.SYSTEM_PROMPT || 'You are a helpful AI assistant.';

  if (!apiKey) {
    logger.error('⚠️ Tertiary LLM (DeepSeek): API key not configured in Render environment!');
    throw new Error('DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to Render environment variables.');
  }

  logger.info('📡 Tertiary LLM (DeepSeek): Sending request...');

  const response = await fetch(DEEPSEEK_API_URL, {
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
    const statusCode = response.status;
    logger.error(`Tertiary LLM (DeepSeek) error (${statusCode}): ${JSON.stringify(error)}`);
    
    if (statusCode === 429) {
      throw new Error(`DeepSeek rate limit (429): ${error?.error?.message || 'Too many requests'}`);
    }
    if (statusCode >= 500) {
      throw new Error(`DeepSeek server error (${statusCode}): ${error?.error?.message || response.statusText}`);
    }
    throw new Error(`DeepSeek error: ${response.statusText}`);
  }

  const data = await response.json();
  const aiResponse = data?.choices?.[0]?.message?.content;

  if (!aiResponse) {
    throw new Error('Invalid response from DeepSeek');
  }

  logger.info(`✅ Response from Tertiary LLM (DeepSeek) for: "${message.substring(0, 50)}..."`);
  return aiResponse;
};
