# Command Center

Personal life OS dashboard with a deep space theme. Combines daily briefs, Indian meal planning, habit tracking, exercise/reading logs, and quick notes.

## Features

- **Briefs** - Morning briefing, tech news digest, evening review (OpenClaw-powered)
- **Meals** - 7 rotating Indian non-veg meal templates, cook's card, meal logging, daily essentials checklist
- **Habits** - Configurable daily habits, exercise logging, reading tracker, streak calendars
- **Notes** - Quick capture for thoughts and ideas
- **Space Theme** - Animated twinkling stars, glass-morphism cards, cosmic glow effects

## Quick Start

```bash
pnpm install
pnpm dev
```

Works immediately with sample data - no Supabase required for local development.

## Setup with Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Optionally run `src/data/seed.sql` for demo data
4. Copy `.env.example` to `.env.local` and fill in your keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deploy to Vercel

1. Import repo at [vercel.com/new](https://vercel.com/new)
2. Add environment variables (Supabase URL + anon key)
3. Deploy

## Keyboard Shortcuts

| Key | Section |
|-----|---------|
| 1   | Today   |
| 2   | Briefs  |
| 3   | Meals   |
| 4   | Habits  |
| 5   | Notes   |

## OpenClaw Webhook

POST to `/api/webhook` with:

```json
{
  "type": "brief",
  "brief_type": "morning_briefing",
  "title": "Your Morning Brief",
  "content": "..."
}
```

## Tech Stack

Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Supabase
