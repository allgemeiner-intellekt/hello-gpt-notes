# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hello, GPT! is an educational web app demonstrating OpenAI API integration with Next.js. It generates variations of "Hello, World!" greetings using GPT-3.5-turbo.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Setup

1. `npm install`
2. `cp .env.sample .env.local`
3. Add your OpenAI API key to `.env.local`: `OPENAI_API_KEY=your-key`

## Architecture

**Stack:** Next.js 13 (App Router), React 18, Tailwind CSS

**Client-Server Pattern:**
- Frontend (`app/page.js`): React client component with useState hooks for reply and loading state
- Backend (`app/api/hello/route.js`): GET endpoint that calls OpenAI API

**Data Flow:**
1. User clicks "Say hello" → frontend fetches `/api/hello`
2. Backend calls OpenAI API with API key from environment variable
3. Backend extracts `choices[0].message.content` and returns as JSON
4. Frontend displays response with loading state handling

**Key Files:**
- `app/page.js` - Single page UI with form and result display
- `app/api/hello/route.js` - OpenAI integration endpoint (extensively commented in Chinese/English)

## Security Note

The OpenAI API key is accessed only server-side via `process.env.OPENAI_API_KEY`. Never expose it to the client.
