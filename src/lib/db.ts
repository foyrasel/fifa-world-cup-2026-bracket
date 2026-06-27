import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Schema DDL for auto-creation on Vercel serverless
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "Group" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Group_name_key" ON "Group"("name");

CREATE TABLE IF NOT EXISTS "Team" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "flagEmoji" TEXT NOT NULL DEFAULT '',
  "groupId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Team_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Team_name_key" ON "Team"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Team_code_key" ON "Team"("code");
CREATE INDEX IF NOT EXISTS "Team_groupId_idx" ON "Team"("groupId");

CREATE TABLE IF NOT EXISTS "GroupStanding" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "groupId" TEXT NOT NULL,
  "teamName" TEXT NOT NULL,
  "played" INTEGER NOT NULL DEFAULT 0,
  "won" INTEGER NOT NULL DEFAULT 0,
  "drawn" INTEGER NOT NULL DEFAULT 0,
  "lost" INTEGER NOT NULL DEFAULT 0,
  "points" INTEGER NOT NULL DEFAULT 0,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "GroupStanding_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "GroupStanding_groupId_idx" ON "GroupStanding"("groupId");

CREATE TABLE IF NOT EXISTS "Match" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "matchNo" TEXT NOT NULL,
  "round" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "venue" TEXT NOT NULL DEFAULT '',
  "homeTeamName" TEXT NOT NULL DEFAULT '',
  "awayTeamName" TEXT NOT NULL DEFAULT '',
  "homeSeed" TEXT NOT NULL DEFAULT '',
  "awaySeed" TEXT NOT NULL DEFAULT '',
  "homeScore" INTEGER,
  "awayScore" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'upcoming',
  "homeWinner" BOOLEAN NOT NULL DEFAULT false,
  "awayWinner" BOOLEAN NOT NULL DEFAULT false,
  "predictedHome" TEXT NOT NULL DEFAULT '',
  "predictedAway" TEXT NOT NULL DEFAULT '',
  "predictedHomeScore" INTEGER,
  "predictedAwayScore" INTEGER,
  "winnerGoesToMatchNo" TEXT NOT NULL DEFAULT '',
  "winnerGoesToSide" TEXT NOT NULL DEFAULT 'home',
  "loserGoesToMatchNo" TEXT NOT NULL DEFAULT '',
  "loserGoesToSide" TEXT NOT NULL DEFAULT 'home',
  "groupId" TEXT,
  "isEditable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Match_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Match_matchNo_key" ON "Match"("matchNo");
CREATE INDEX IF NOT EXISTS "Match_groupId_idx" ON "Match"("groupId");
`

let schemaApplied = false

export async function ensureSchema() {
  if (schemaApplied) return
  try {
    for (const stmt of SCHEMA_SQL.split(';').map(s => s.trim()).filter(Boolean)) {
      await db.$executeRawUnsafe(stmt)
    }
    schemaApplied = true
  } catch (e) {
    console.error('Schema apply error:', e)
  }
}