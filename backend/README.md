# Chatbot Backend

A lightweight, modular Node.js backend for portfolio chatbot integration with Google's Gemini AI API.

## Features

- ✅ Express server with modular architecture
- ✅ Gemini AI integration
- ✅ Secure API key management using environment variables
- ✅ CORS & Helmet security headers
- ✅ Input validation
- ✅ Error handling
- ✅ Bilingual support (English & Arabic)
- ✅ Production-ready

## Project Structure

```
backend/
├── src/
│   ├── server.js               # Main Express app
│   ├── routes/
│   │   └── chat.js             # Chat endpoint
│   ├── services/
│   │   └── geminiService.js    # Gemini API integration
│   └── utils/
│       └── logger.js           # Logging utility
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File

Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
```

**⚠️ IMPORTANT:** Never commit `.env` to GitHub. It's already in `.gitignore`.

### 3. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in `.env`

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### POST `/api/chat`

Send a message to the chatbot.

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
  "response": "I'm Claude, an AI assistant...",
  "language": "en",
  "timestamp": "2026-02-21T10:30:00.000Z"
}
```

**Parameters:**

- `message` (string, required): User's question
- `language` (string, optional): `"en"` or `"ar"` (default: `"en"`)

**Error Response:**

```json
{
  "error": "Message is required and must be a string"
}
```

### GET `/health`

Health check endpoint.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2026-02-21T10:30:00.000Z"
}
```

## Frontend Integration

```javascript
// Example: JavaScript fetch
async function chat(userMessage, language = 'en') {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
      language: language,
    }),
  });

  if (!response.ok) throw new Error('Chat failed');
  return response.json();
}

// Usage
const data = await chat('Hello!', 'en');
console.log(data.response);
```

## Security

- ✅ API key never exposed to frontend
- ✅ Environment variables protect secrets
- ✅ Helmet sets security headers
- ✅ CORS restricted to trusted domains (edit in `server.js`)
- ✅ Input validation on all endpoints
- ✅ `.env` excluded from Git

## Deployment

### Deploy to Render

1. Push code to GitHub (without `.env`)
2. Connect GitHub repo to Render
3. Set environment variable in Render dashboard:
   - Key: `GEMINI_API_KEY`
   - Value: Your actual API key
4. Deploy!

### Deploy to Vercel, Heroku, AWS, etc.

Same process: Set `GEMINI_API_KEY` in the hosting platform's environment variables.

## Troubleshooting

### API Key Error

```
GEMINI_API_KEY is not set in environment variables
```

**Fix:** Ensure `.env` exists and contains your API key.

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:** Update `corsOptions.origin` in `server.js` with your frontend domain.

### 429 Error (Rate Limited)

Gemini API has rate limits. Reduce request frequency or upgrade your plan.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `GEMINI_API_KEY` | Yes | - | Google Gemini API key |
| `NODE_ENV` | No | development | Environment (development/production) |

## Scripts

```bash
npm start    # Start production server
npm run dev  # Start with auto-reload
```

## License

MIT

## Credits

Built with Express, Gemini API, and best practices for security and modularity.
