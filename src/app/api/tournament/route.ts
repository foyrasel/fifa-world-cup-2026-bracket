import { db, ensureSchema } from '@/lib/db'
import { seedIfEmpty } from '@/lib/seed'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await ensureSchema()
    await seedIfEmpty()
    const groups = await db.group.findMany({
      orderBy: { name: 'asc' },
      include: { teams: true, standings: { orderBy: { position: 'asc' } } },
    })
    const matches = await db.match.findMany({ orderBy: { matchNo: 'asc' } })
    return NextResponse.json({ groups, matches })
  } catch (error) {
    console.error('Tournament API error:', error)
    return NextResponse.json({ error: 'Failed to fetch tournament data' }, { status: 500 })
  }
}