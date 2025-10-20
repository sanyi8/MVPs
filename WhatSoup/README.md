
# WhatSoup? - Recipe Generator

A soup recipe generator application powered by OpenAI.

## Setup Instructions

### Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your credentials to `.env`:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `OPENAI_API_KEY`: Your OpenAI API key

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Database Migration

```bash
npm run db:push
```

## Security Notes

- Never commit `.env` file to version control
- Use Replit Secrets for sensitive data when deploying on Replit
- The `.env.example` file shows required environment variables without exposing actual values
