import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { matchNo, homeScore, awayScore, homeTeamName, awayTeamName } = body

    if (!matchNo || homeScore == null || awayScore == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const match = await db.match.findUnique({ where: { matchNo } })
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }
    if (!match.isEditable) {
      return NextResponse.json({ error: 'Match is not editable' }, { status: 403 })
    }

    const homeWinner = homeScore > awayScore
    const awayWinner = awayScore > homeScore
    const isDraw = homeScore === awayScore

    const updated = await db.match.update({
      where: { matchNo },
      data: {
        homeScore,
        awayScore,
        homeTeamName: homeTeamName || match.homeTeamName,
        awayTeamName: awayTeamName || match.awayTeamName,
        status: 'completed',
        homeWinner,
        awayWinner,
        isEditable: false,
      },
    })

    // Propagate winner to next match
    if (updated.winnerGoesToMatchNo) {
      const winnerName = homeWinner
        ? updated.homeTeamName
        : awayWinner
          ? updated.awayTeamName
          : ''
      const loserName = awayWinner
        ? updated.homeTeamName
        : homeWinner
          ? updated.awayTeamName
          : ''

      if (updated.winnerGoesToMatchNo) {
        const nextMatch = await db.match.findUnique({
          where: { matchNo: updated.winnerGoesToMatchNo },
        })
        if (nextMatch) {
          const updateData: Record<string, string> = {}
          if (updated.winnerGoesToSide === 'home') {
            updateData.homeTeamName = winnerName
          } else {
            updateData.awayTeamName = winnerName
          }
          await db.match.update({
            where: { matchNo: updated.winnerGoesToMatchNo },
            data: updateData,
          })
        }
      }

      // Propagate loser to 3rd place match
      if (updated.loserGoesToMatchNo && loserName) {
        const loserMatch = await db.match.findUnique({
          where: { matchNo: updated.loserGoesToMatchNo },
        })
        if (loserMatch) {
          const updateData: Record<string, string> = {}
          if (updated.loserGoesToSide === 'home') {
            updateData.homeTeamName = loserName
          } else {
            updateData.awayTeamName = loserName
          }
          await db.match.update({
            where: { matchNo: updated.loserGoesToMatchNo },
            data: updateData,
          })
        }
      }
    }

    return NextResponse.json({ success: true, match: updated })
  } catch (error) {
    console.error('Match update error:', error)
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 })
  }
}
