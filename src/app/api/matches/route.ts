import { db, ensureSchema } from '@/lib/db'
import { seedIfEmpty } from '@/lib/seed'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    await ensureSchema()
    await seedIfEmpty()
    const body = await request.json()
    const { matchNo, homeScore, awayScore } = body

    if (!matchNo || homeScore == null || awayScore == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const match = await db.match.findUnique({ where: { matchNo } })
    if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    if (!match.isEditable) return NextResponse.json({ error: 'Match is not editable' }, { status: 403 })

    const homeWinner = homeScore > awayScore
    const awayWinner = awayScore > homeScore

    const updated = await db.match.update({
      where: { matchNo },
      data: { homeScore, awayScore, status: 'completed', homeWinner, awayWinner, isEditable: false },
    })

    // Propagate winner
    if (updated.winnerGoesToMatchNo) {
      const winnerName = homeWinner ? updated.homeTeamName : awayWinner ? updated.awayTeamName : ''
      const loserName = awayWinner ? updated.homeTeamName : homeWinner ? updated.awayTeamName : ''
      if (updated.winnerGoesToMatchNo && winnerName) {
        const data: Record<string, string> = {}
        if (updated.winnerGoesToSide === 'home') data.homeTeamName = winnerName
        else data.awayTeamName = winnerName
        await db.match.update({ where: { matchNo: updated.winnerGoesToMatchNo }, data })
      }
      if (updated.loserGoesToMatchNo && loserName) {
        const data: Record<string, string> = {}
        if (updated.loserGoesToSide === 'home') data.homeTeamName = loserName
        else data.awayTeamName = loserName
        await db.match.update({ where: { matchNo: updated.loserGoesToMatchNo }, data })
      }
    }

    return NextResponse.json({ success: true, match: updated })
  } catch (error) {
    console.error('Match update error:', error)
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 })
  }
}