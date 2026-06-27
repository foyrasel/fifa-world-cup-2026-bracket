# FIFA World Cup 2026 - Interactive Tournament Bracket

A full-featured, data-driven tournament bracket built with **Next.js 16**, **Prisma ORM**, and **SQLite**.

## Features

- **12 Group Stage Tables** (Groups A-L) with 48 teams, standings, and flag emojis
- **32 Knockout Matches** with full bracket visualization (R32 → Final)
- **Backend API** - all match data served from a real database
- **AI Predictions** - click "Predict with AI" to fill upcoming matches with strength-based predictions
- **Click to Edit** - tap any upcoming match to enter scores, which auto-propagate winners
- **Zoom & Scroll** - horizontal/vertical scrolling with zoom controls
- **Print & Download** - dedicated print button and full HTML download
- **Dark navy/gold theme** matching FIFA branding

## Tech Stack

- **Next.js 16** (App Router)
- **Prisma ORM** with SQLite
- **TypeScript**
- **Tailwind CSS 4**

## Setup

```bash
# Install dependencies
bun install

# Push database schema
bun run db:push

# Seed with tournament data (48 teams, 12 groups, 32 matches)
node prisma/seed.mjs

# Propagate winners from completed matches
node prisma/propagate.mjs

# Start dev server
bun run dev
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tournament` | Fetch all groups, teams, standings, and matches |
| PUT | `/api/matches` | Update a match score (body: `{ matchNo, homeScore, awayScore }`) |
| POST | `/api/predict` | Run AI predictions on all upcoming matches |
| DELETE | `/api/predict` | Clear all predictions and restore completed-only state |

## Live Preview

The app runs on port 3000. Open the preview panel to interact with the bracket.

**Repository:** https://github.com/foyrasel/fifa-world-cup-2026-bracket