# Mohammed Saleh AI Chatbot Backend

Backend API server for the AI chatbot integrated with portfolio website.

## Features

- ✅ LLM API Integration with fallback system
- ✅ Multi-language support (English, Arabic, Turkish)
- ✅ CORS configured for frontend
- ✅ Error handling and logging
- ✅ Environment variable security

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=production

# Primary LLM API Key
LLM_API_KEY=your_primary_api_key_here

# Secondary LLM API Key (Fallback)
DEEPSEEK_API_KEY=your_secondary_api_key_here

# System Prompt
SYSTEM_PROMPT=You are an AI assistant...
```

### 3. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:3000` (local) or specified Render URL (production)

## API Endpoints

### POST /api/chat
Send a message to the AI.

**Request:**
```json
{
  "message": "What is your name?",
  "language": "en"
}
```

**Response:**
```json
{
  "response": "I am Mohammed Saleh AI...",
  "language": "en",
  "timestamp": "2026-02-21T..."
}
```

## Deployment

Deployed on [Render](https://render.com/)
- Auto-rebuilds on git push
- Environment variables configured in Render dashboard
- Set both API keys for fallback functionality

## Security

- ✅ API keys stored in environment variables (.env in .gitignore)
- ✅ Helmet middleware for security headers
- ✅ CORS whitelisting for specific origins
- ✅ Input validation on chat endpoint

## Fallback System

If the primary LLM fails:
1. Automatic switch to secondary LLM
2. Seamless for user (they don't see the switch)
3. Logged for debugging
4. Both APIs configured with same system prompt
