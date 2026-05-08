# Trajectory

A conversational AI journal that talks to you about your goals and habits, retrieves context from your full history, and gives evidence-based progress verdicts with full Decision Architecture transparency.

## Setup

```bash
npm install
cp .env.local.example .env.local   # fill in keys
npm run dev
```

The app runs **without any keys** — Supabase, Claude, and Pinecone are all optional at boot. You'll get a fully-working local UI backed by Zustand persistence (localStorage). Add keys to enable real AI and cross-device sync.

## Required env vars (when going live)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX=trajectory-entries
```

Run the migration in `supabase/migrations/001_initial_schema.sql` against a fresh Supabase project. Configure Google OAuth and add `http://localhost:3000/api/auth/callback` (and your prod URL) as a redirect.

## Architecture

- **Next.js 14** App Router · TypeScript · React 18
- **Zustand** for all client state (persisted via localStorage)
- **Supabase** Postgres + Google OAuth + RLS
- **Claude Sonnet** for chat + reports · **OpenAI text-embedding-3-small** for vectors · **Pinecone** for retrieval
- **Inline styles** with design tokens — Tailwind only for layout utilities

See `CLAUDE.md` (in the parent directory) for the full spec.

## Build order checklist

The skeleton ships Phase 1–6. Phase 7 polish (mood-decline detection, missed-day handling, PWA service worker) is left to you.
