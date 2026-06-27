import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const TEAM_STRENGTH: Record<string, number> = {
  'France': 92, 'England': 90, 'Argentina': 95, 'Brazil': 93, 'Portugal': 88,
  'Spain': 91, 'Germany': 89, 'Netherlands': 87, 'Italy': 88, 'Belgium': 86,
  'Uruguay': 85, 'Denmark': 84, 'Croatia': 83, 'USA': 80, 'Colombia': 82,
  'Switzerland': 83, 'Mexico': 81, 'Poland': 80, 'Wales': 78, 'Ecuador': 77,
  'Senegal': 79, 'Morocco': 78, 'Sweden': 77, 'Serbia': 76, 'Iran': 74,
  'Peru': 73, 'Australia': 72, 'Japan': 78, 'South Korea': 75, 'Canada': 73,
  'Costa Rica': 72, 'Nigeria': 76, 'Chile': 76, 'Tunisia': 71, 'Ghana': 74,
  'Egypt': 73, 'Panama': 68, 'Saudi Arabia': 69, 'Iceland': 70, 'Algeria': 72,
  'New Zealand': 67, 'UAE': 66, 'Honduras': 67, 'Bolivia': 66, 'Qatar': 68,
  'Paraguay': 72, 'Cameroon': 73, 'Jamaica': 65,
}

function predictScore(team1: string, team2: string): { s1: number; s2: number; winner: string } {
  const str1 = TEAM_STRENGTH[team1] || 70
  const str2 = TEAM_STRENGTH[team2] || 70
  const diff = str1 - str2
  const base1 = 1.3 + diff * 0.025
  const base2 = 1.3 - diff * 0.025
  const s1 = Math.max(0, Math.round(base1 + (Math.random() - 0.5) * 1.5))
  const s2 = Math.max(0, Math.round(base2 + (Math.random() - 0.5) * 1.5))
  if (s1 === s2) return s1 >= s2 ? { s1: s1 + 1, s2, winner: team1 } : { s1, s2: s2 + 1, winner: team2 }
  return { s1, s2, winner: s1 > s2 ? team1 : team2 }
}

async function predictAndPropagate(match: MatchData) {
  const home = match.homeTeamName || 'TBD'
  const away = match.awayTeamName || 'TBD'
  const { s1, s2, winner } = predictScore(home, away)
  const loser = s1 > s2 ? away : home

  await db.match.update({
    where: { matchNo: match.matchNo },
    data: {
      predictedHome: home,
      predictedAway: away,
      predictedHomeScore: s1,
      predictedAwayScore: s2,
    },
  })

  // Propagate winner
  if (match.winnerGoesToMatchNo) {
    const data: Record<string, string> = {}
    if (match.winnerGoesToSide === 'home') data.homeTeamName = winner
    else data.awayTeamName = winner
    await db.match.update({ where: { matchNo: match.winnerGoesToMatchNo }, data })
  }

  // Propagate loser
  if (match.loserGoesToMatchNo) {
    const data: Record<string, string> = {}
    if (match.loserGoesToSide === 'home') data.homeTeamName = loser
    else data.awayTeamName = loser
    await db.match.update({ where: { matchNo: match.loserGoesToMatchNo }, data })
  }

  return { matchNo: match.matchNo, homeTeam: home, awayTeam: away, homeScore: s1, awayScore: s2, winner }
}

type MatchData = {
  matchNo: string
  homeTeamName: string
  awayTeamName: string
  homeSeed: string
  awaySeed: string
  winnerGoesToMatchNo: string
  winnerGoesToSide: string
  loserGoesToMatchNo: string
  loserGoesToSide: string
  isEditable: boolean
  predictedHomeScore: number | null
}

export async function POST() {
  try {
    const predictions: Array<{ matchNo: string; homeTeam: string; awayTeam: string; homeScore: number; awayScore: number; winner: string }> = []

    // Multi-pass: predict matches that have team names, propagate, repeat until no more
    let pass = 0
    const MAX_PASSES = 5
    while (pass < MAX_PASSES) {
      const remaining = await db.match.findMany({
        where: { isEditable: true, predictedHomeScore: null },
        orderBy: { matchNo: 'asc' },
      })

      if (remaining.length === 0) break

      // Only predict matches that have actual team names (not TBD)
      const ready = remaining.filter(m => m.homeTeamName && m.awayTeamName && m.homeTeamName !== 'TBD' && m.awayTeamName !== 'TBD')
      if (ready.length === 0) break

      for (const match of ready) {
        const result = await predictAndPropagate(match)
        predictions.push(result)
      }

      pass++
    }

    return NextResponse.json({ success: true, count: predictions.length, predictions })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json({ error: 'Prediction failed' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Clear all predictions
    await db.match.updateMany({
      data: {
        predictedHome: '',
        predictedAway: '',
        predictedHomeScore: null,
        predictedAwayScore: null,
      },
    })

    // Clear team names for editable matches fed by other editable matches
    const editable = await db.match.findMany({ where: { isEditable: true } })
    for (const m of editable) {
      if (m.homeSeed.startsWith('W') || m.homeSeed.startsWith('L')) {
        await db.match.update({
          where: { matchNo: m.matchNo },
          data: { homeTeamName: '', awayTeamName: '' },
        })
      }
    }

    // Re-propagate from completed matches only
    const completed = await db.match.findMany({
      where: { status: 'completed', winnerGoesToMatchNo: { not: '' } },
    })
    for (const m of completed) {
      const winner = m.homeWinner ? m.homeTeamName : m.awayWinner ? m.awayTeamName : ''
      const loser = m.awayWinner ? m.homeTeamName : m.homeWinner ? m.awayTeamName : ''
      if (!winner) continue

      if (m.winnerGoesToMatchNo) {
        const data: Record<string, string> = {}
        if (m.winnerGoesToSide === 'home') data.homeTeamName = winner
        else data.awayTeamName = winner
        await db.match.update({ where: { matchNo: m.winnerGoesToMatchNo }, data })
      }
      if (m.loserGoesToMatchNo && loser) {
        const data: Record<string, string> = {}
        if (m.loserGoesToSide === 'home') data.homeTeamName = loser
        else data.awayTeamName = loser
        await db.match.update({ where: { matchNo: m.loserGoesToMatchNo }, data })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear predictions error:', error)
    return NextResponse.json({ error: 'Failed to clear predictions' }, { status: 500 })
  }
}