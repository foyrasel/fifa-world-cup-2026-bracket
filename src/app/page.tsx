'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Types
interface Standing {
  id: string
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  points: number
  position: number
}

interface GroupData {
  id: string
  name: string
  teams: { id: string; name: string; code: string; flagEmoji: string }[]
  standings: Standing[]
}

interface MatchData {
  id: string
  matchNo: string
  round: string
  date: string
  venue: string
  homeTeamName: string
  awayTeamName: string
  homeSeed: string
  awaySeed: string
  homeScore: number | null
  awayScore: number | null
  status: string
  homeWinner: boolean
  awayWinner: boolean
  isEditable: boolean
  predictedHome: string
  predictedAway: string
  predictedHomeScore: number | null
  predictedAwayScore: number | null
  winnerGoesToMatchNo: string
  winnerGoesToSide: string
}

interface TournamentData {
  groups: GroupData[]
  matches: MatchData[]
}

const ROUND_LABELS: Record<string, string> = {
  R32: 'Round of 32',
  R16: 'Round of 16',
  QF: 'Quarter-Final',
  SF: 'Semi-Final',
  F: 'Final',
  '3P': 'Third Place',
}

const ROUND_DATES: Record<string, string> = {
  R32: 'JUN 28 – JUL 3',
  R16: 'JUL 4 – 7',
  QF: 'JUL 9 – 11',
  SF: 'JUL 14 – 15',
  F: 'JUL 19',
  '3P': 'JUL 18',
}

// Get matches by round and side
function getMatchesByRound(matches: MatchData[], round: string): MatchData[] {
  return matches.filter((m) => m.round === round)
}

function getLeftMatches(matches: MatchData[], round: string): MatchData[] {
  const leftNos: Record<string, string[]> = {
    R32: ['M73', 'M74', 'M75', 'M76', 'M77', 'M78', 'M79', 'M80'],
    R16: ['M89', 'M90', 'M91', 'M92'],
    QF: ['M97', 'M98'],
    SF: ['M101'],
  }
  const nos = leftNos[round] || []
  return matches.filter((m) => nos.includes(m.matchNo))
}

function getRightMatches(matches: MatchData[], round: string): MatchData[] {
  const rightNos: Record<string, string[]> = {
    R32: ['M81', 'M82', 'M83', 'M84', 'M85', 'M86', 'M87', 'M88'],
    R16: ['M93', 'M94', 'M95', 'M96'],
    QF: ['M99', 'M100'],
    SF: ['M102'],
  }
  const nos = rightNos[round] || []
  return matches.filter((m) => nos.includes(m.matchNo))
}

function chunkPairs(matches: MatchData[]): MatchData[][] {
  const pairs: MatchData[][] = []
  for (let i = 0; i < matches.length; i += 2) {
    pairs.push(matches.slice(i, i + 2))
  }
  return pairs
}

// Match Card Component
function MatchCard({ match, onEdit }: { match: MatchData; onEdit: (m: MatchData) => void }) {
  const hasPrediction = match.predictedHomeScore !== null
  const isCompleted = match.status === 'completed'

  const getHomeClass = () => {
    if (isCompleted && match.homeWinner) return 'winner'
    if (hasPrediction && match.predictedHomeScore !== null) return 'predicted'
    return ''
  }
  const getAwayClass = () => {
    if (isCompleted && match.awayWinner) return 'winner'
    if (hasPrediction && match.predictedAwayScore !== null) return 'predicted'
    return ''
  }
  const getHomeScoreClass = () => {
    if (isCompleted && match.homeWinner) return 'winner-score'
    if (hasPrediction) return 'predicted-score'
    return ''
  }
  const getAwayScoreClass = () => {
    if (isCompleted && match.awayWinner) return 'winner-score'
    if (hasPrediction) return 'predicted-score'
    return ''
  }

  const displayHomeName = hasPrediction ? match.predictedHome : match.homeTeamName
  const displayAwayName = hasPrediction ? match.predictedAway : match.awayTeamName
  const displayHomeScore = hasPrediction ? match.predictedHomeScore : match.homeScore
  const displayAwayScore = hasPrediction ? match.predictedAwayScore : match.awayScore

  return (
    <div
      className={`match bg-white border-[1.5px] border-[#cdd5de] rounded-lg p-1.5 relative shadow-sm min-h-[48px] hover:border-[#0a1f3c] transition-colors ${match.isEditable ? 'cursor-pointer' : ''}`}
      onClick={() => match.isEditable && onEdit(match)}
    >
      <div className="match-head flex justify-between items-center mb-0.5 pb-0.5 border-b border-dotted border-[#d8dee5]">
        <span className="match-no bg-[#0a1f3c] text-[#d4af37] text-[8px] font-extrabold px-1.5 py-0.5 rounded-[3px]">
          {match.matchNo}
        </span>
        <span className="match-date text-[8px] text-[#888] font-semibold">{match.date}</span>
      </div>
      <div className="slot flex items-center gap-1 py-0.5 border-b border-dotted border-[#e3e8ee] min-h-[18px]">
        <span className="team-src text-[7px] text-[#b0b8c4] font-bold w-6 shrink-0">{match.homeSeed}</span>
        <span className={`team-name flex-1 text-[11px] font-semibold text-[#1a2332] min-h-[14px] ${getHomeClass()}`}>
          {displayHomeName || 'TBD'}
        </span>
        <span className={`score w-5 h-[18px] border border-[#cdd5de] rounded-[3px] bg-[#f7f9fb] shrink-0 flex items-center justify-center text-[10px] font-bold text-[#0a1f3c] ${getHomeScoreClass()}`}>
          {displayHomeScore ?? ''}
        </span>
      </div>
      <div className="slot flex items-center gap-1 py-0.5 min-h-[18px]">
        <span className="team-src text-[7px] text-[#b0b8c4] font-bold w-6 shrink-0">{match.awaySeed}</span>
        <span className={`team-name flex-1 text-[11px] font-semibold text-[#1a2332] min-h-[14px] ${getAwayClass()}`}>
          {displayAwayName || 'TBD'}
        </span>
        <span className={`score w-5 h-[18px] border border-[#cdd5de] rounded-[3px] bg-[#f7f9fb] shrink-0 flex items-center justify-center text-[10px] font-bold text-[#0a1f3c] ${getAwayScoreClass()}`}>
          {displayAwayScore ?? ''}
        </span>
      </div>
    </div>
  )
}

// Group Card Component
function GroupCard({ group }: { group: GroupData }) {
  return (
    <div className="group-card border border-[#e0e5eb] rounded-lg overflow-hidden">
      <div className="group-head bg-[#0a1f3c] text-white px-2.5 py-1.5 text-xs font-extrabold tracking-wider">
        GROUP {group.name}
      </div>
      <table className="group-table w-full border-collapse text-[10px]">
        <thead>
          <tr className="bg-[#f7f9fb]">
            <th className="px-1 py-1 text-left text-[8px] text-[#6b7785] uppercase border-b border-[#e0e5eb]">Team</th>
            <th className="px-1 py-1 text-center text-[8px] text-[#6b7785] uppercase border-b border-[#e0e5eb]">P</th>
            <th className="px-1 py-1 text-center text-[8px] text-[#6b7785] uppercase border-b border-[#e0e5eb]">W</th>
            <th className="px-1 py-1 text-center text-[8px] text-[#6b7785] uppercase border-b border-[#e0e5eb]">D</th>
            <th className="px-1 py-1 text-center text-[8px] text-[#6b7785] uppercase border-b border-[#e0e5eb]">L</th>
            <th className="px-1 py-1 text-center text-[8px] text-[#6b7785] uppercase border-b border-[#e0e5eb]">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map((s) => (
            <tr key={s.id} className={s.position <= 2 ? 'bg-[#e6f5ec] font-bold' : ''}>
              <td className="px-1.5 py-1 border-b border-[#eef2f7]">
                {group.teams.find((t) => t.name === s.teamName)?.flagEmoji} {s.teamName}
              </td>
              <td className="px-1 py-1 text-center border-b border-[#eef2f7]">{s.played}</td>
              <td className="px-1 py-1 text-center border-b border-[#eef2f7]">{s.won}</td>
              <td className="px-1 py-1 text-center border-b border-[#eef2f7]">{s.drawn}</td>
              <td className="px-1 py-1 text-center border-b border-[#eef2f7]">{s.lost}</td>
              <td className="px-1 py-1 text-center border-b border-[#eef2f7]">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Score Edit Dialog
function ScoreDialog({
  match,
  onSave,
  onCancel,
}: {
  match: MatchData
  onSave: (matchNo: string, homeScore: number, awayScore: number) => void
  onCancel: () => void
}) {
  const [homeScore, setHomeScore] = useState('')
  const [awayScore, setAwayScore] = useState('')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-xl p-6 shadow-2xl min-w-[320px]">
        <h3 className="text-lg font-bold text-[#0a1f3c] mb-1">Edit Match {match.matchNo}</h3>
        <p className="text-sm text-[#888] mb-4">{match.date}</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold w-32 text-right">{match.homeTeamName || 'TBD'}</span>
            <input
              type="number"
              min="0"
              max="20"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="w-16 h-10 text-center border border-[#cdd5de] rounded-lg text-lg font-bold focus:border-[#d4af37] focus:outline-none"
              placeholder="-"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold w-32 text-right">{match.awayTeamName || 'TBD'}</span>
            <input
              type="number"
              min="0"
              max="20"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="w-16 h-10 text-center border border-[#cdd5de] rounded-lg text-lg font-bold focus:border-[#d4af37] focus:outline-none"
              placeholder="-"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5 justify-end">
          <Button variant="outline" onClick={onCancel} className="rounded-lg">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (homeScore !== '' && awayScore !== '') {
                onSave(match.matchNo, parseInt(homeScore), parseInt(awayScore))
              }
            }}
            className="bg-[#0a1f3c] hover:bg-[#1a3a6c] text-white rounded-lg"
          >
            Save Result
          </Button>
        </div>
      </div>
    </div>
  )
}

// Knockout Column
function KnockoutColumn({
  title,
  dateRange,
  matches,
  side,
  onEdit,
  isSpecial,
  specialType,
}: {
  title: string
  dateRange: string
  matches: MatchData[]
  side: 'left' | 'right' | 'center'
  onEdit: (m: MatchData) => void
  isSpecial?: boolean
  specialType?: 'final' | 'third'
}) {
  if (isSpecial && specialType === 'final') {
    const match = matches.find((m) => m.round === 'F')
    if (!match) return null
    const hasPrediction = match.predictedHomeScore !== null
    const isCompleted = match.status === 'completed'

    const getHomeClass = () => {
      if (isCompleted && match.homeWinner) return 'winner'
      if (hasPrediction) return 'predicted'
      return ''
    }
    const getAwayClass = () => {
      if (isCompleted && match.awayWinner) return 'winner'
      if (hasPrediction) return 'predicted'
      return ''
    }
    const getHomeScoreClass = () => {
      if (isCompleted && match.homeWinner) return 'winner-score'
      if (hasPrediction) return 'predicted-score'
      return ''
    }
    const getAwayScoreClass = () => {
      if (isCompleted && match.awayWinner) return 'winner-score'
      if (hasPrediction) return 'predicted-score'
      return ''
    }

    const displayHomeName = hasPrediction ? match.predictedHome : match.homeTeamName
    const displayAwayName = hasPrediction ? match.predictedAway : match.awayTeamName
    const displayHomeScore = hasPrediction ? match.predictedHomeScore : match.homeScore
    const displayAwayScore = hasPrediction ? match.predictedAwayScore : match.awayScore

    const championName =
      isCompleted
        ? match.homeWinner
          ? match.homeTeamName
          : match.awayTeamName
        : hasPrediction
          ? (match.predictedHomeScore ?? 0) > (match.predictedAwayScore ?? 0)
            ? match.predictedHome
            : match.predictedAway
          : ''

    return (
      <div className="flex flex-col relative">
        <div className="col-header text-center mb-4 pb-2 relative">
          <div className="name text-[13px] font-extrabold tracking-[2px] text-[#0a1f3c] uppercase">{title}</div>
          <div className="date text-[9px] text-[#888] mt-1 font-semibold">{dateRange}</div>
          <div className="absolute left-[30%] right-[30%] bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#c8102e] to-transparent" />
        </div>
        <div className="matches relative flex-1">
          <div className="trophy-icon absolute top-[10%] left-0 right-0 text-center text-[40px] pointer-events-none drop-shadow-lg">🏆</div>

          <div className="final-card absolute top-1/2 left-[-10px] right-[-10px] -translate-y-1/2 bg-gradient-to-br from-[#0a1f3c] via-[#1a3a6c] to-[#0a1f3c] border-[3px] border-[#d4af37] rounded-xl px-3.5 py-3 shadow-xl">
            <div className="final-label text-center text-[13px] font-black tracking-[6px] text-[#d4af37] mb-1.5 uppercase">Final</div>
            <div className="match-head flex justify-between items-center mb-0.5 pb-0.5 border-b border-[rgba(212,175,55,0.4)]">
              <span className="match-no bg-[#d4af37] text-[#0a1f3c] text-[8px] font-extrabold px-1.5 py-0.5 rounded-[3px]">
                {match.matchNo}
              </span>
              <span className="match-date text-[8px] text-[#d4af37] font-semibold">{match.date}</span>
            </div>
            <div className="slot flex items-center gap-1 py-0.5 border-b border-[rgba(255,255,255,0.15)]">
              <span className="team-src text-[7px] text-[rgba(255,255,255,0.5)] font-bold w-6 shrink-0">{match.homeSeed}</span>
              <span className={`team-name flex-1 text-[11px] font-semibold text-white min-h-[14px] ${getHomeClass()}`}>
                {displayHomeName || 'TBD'}
              </span>
              <span className={`score w-5 h-[18px] border border-[rgba(212,175,55,0.5)] rounded-[3px] bg-[rgba(255,255,255,0.1)] shrink-0 flex items-center justify-center text-[10px] font-bold text-[#d4af37] ${getHomeScoreClass()}`}>
                {displayHomeScore ?? ''}
              </span>
            </div>
            <div className="slot flex items-center gap-1 py-0.5">
              <span className="team-src text-[7px] text-[rgba(255,255,255,0.5)] font-bold w-6 shrink-0">{match.awaySeed}</span>
              <span className={`team-name flex-1 text-[11px] font-semibold text-white min-h-[14px] ${getAwayClass()}`}>
                {displayAwayName || 'TBD'}
              </span>
              <span className={`score w-5 h-[18px] border border-[rgba(212,175,55,0.5)] rounded-[3px] bg-[rgba(255,255,255,0.1)] shrink-0 flex items-center justify-center text-[10px] font-bold text-[#d4af37] ${getAwayScoreClass()}`}>
                {displayAwayScore ?? ''}
              </span>
            </div>
            <div className="final-venue text-center text-[8px] text-[rgba(255,255,255,0.8)] mt-1.5 tracking-wider font-semibold">
              <strong className="text-[#d4af37]">METLIFE STADIUM</strong> · NEW YORK / NEW JERSEY
            </div>
          </div>

          <div className="champion-box absolute top-1/2 left-[5%] right-[5%] translate-y-[100px] text-center p-2 border-2 border-[#d4af37] rounded-lg bg-[rgba(212,175,55,0.1)]">
            <div className="label text-[9px] text-[#6b7785] tracking-[4px] uppercase mb-0.5 font-bold">★ Champion 2026 ★</div>
            <div className={`name text-base font-extrabold text-[#0a1f3c] border-b-2 border-[#d4af37] pb-0.5 min-h-[22px] ${hasPrediction && !isCompleted ? 'predicted' : ''}`}>
              {championName || ''}
            </div>
          </div>

          {/* Third Place Match */}
          {(() => {
            const thirdMatch = matches.find((m) => m.round === '3P')
            if (!thirdMatch) return null
            const hasPred = thirdMatch.predictedHomeScore !== null
            const isComp = thirdMatch.status === 'completed'
            return (
              <div className="third-card absolute top-1/2 left-0 right-0 translate-y-[170px] bg-white border-2 border-dashed border-[#c8102e] rounded-lg px-2.5 py-2">
                <div className="third-label text-center text-[10px] font-extrabold text-[#c8102e] tracking-[2px] mb-1 uppercase">Third Place</div>
                <div className="match-head flex justify-between items-center mb-0.5 pb-0.5 border-b border-dotted border-[#d8dee5]">
                  <span className="match-no bg-[#c8102e] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-[3px]">
                    {thirdMatch.matchNo}
                  </span>
                  <span className="match-date text-[8px] text-[#888] font-semibold">{thirdMatch.date}</span>
                </div>
                <div className="slot flex items-center gap-1 py-0.5 border-b border-dotted border-[#e3e8ee]">
                  <span className="team-src text-[7px] text-[#b0b8c4] font-bold w-6 shrink-0">{thirdMatch.homeSeed}</span>
                  <span className={`team-name flex-1 text-[11px] font-semibold text-[#1a2332] min-h-[14px] ${isComp && thirdMatch.homeWinner ? 'winner' : hasPred ? 'predicted' : ''}`}>
                    {hasPred ? thirdMatch.predictedHome : thirdMatch.homeTeamName || 'TBD'}
                  </span>
                  <span className={`score w-5 h-[18px] border border-[#cdd5de] rounded-[3px] bg-[#f7f9fb] shrink-0 flex items-center justify-center text-[10px] font-bold ${isComp && thirdMatch.homeWinner ? 'winner-score' : hasPred ? 'predicted-score' : ''}`}>
                    {hasPred ? thirdMatch.predictedHomeScore : thirdMatch.homeScore ?? ''}
                  </span>
                </div>
                <div className="slot flex items-center gap-1 py-0.5">
                  <span className="team-src text-[7px] text-[#b0b8c4] font-bold w-6 shrink-0">{thirdMatch.awaySeed}</span>
                  <span className={`team-name flex-1 text-[11px] font-semibold text-[#1a2332] min-h-[14px] ${isComp && thirdMatch.awayWinner ? 'winner' : hasPred ? 'predicted' : ''}`}>
                    {hasPred ? thirdMatch.predictedAway : thirdMatch.awayTeamName || 'TBD'}
                  </span>
                  <span className={`score w-5 h-[18px] border border-[#cdd5de] rounded-[3px] bg-[#f7f9fb] shrink-0 flex items-center justify-center text-[10px] font-bold ${isComp && thirdMatch.awayWinner ? 'winner-score' : hasPred ? 'predicted-score' : ''}`}>
                    {hasPred ? thirdMatch.predictedAwayScore : thirdMatch.awayScore ?? ''}
                  </span>
                </div>
                <div className="third-venue text-center text-[8px] text-[#888] tracking-wider mt-1">HARD ROCK STADIUM · MIAMI</div>
              </div>
            )
          })()}
        </div>
      </div>
    )
  }

  const pairs = chunkPairs(matches)
  const sideClass = side === 'left' ? 'r32-l' : side === 'right' ? 'r32-r' : ''

  return (
    <div className={`col ${sideClass} flex flex-col relative`}>
      <div className="col-header text-center mb-4 pb-2 relative">
        <div className="name text-[13px] font-extrabold tracking-[2px] text-[#0a1f3c] uppercase">{title}</div>
        <div className="date text-[9px] text-[#888] mt-1 font-semibold">{dateRange}</div>
        <div className="absolute left-[30%] right-[30%] bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#c8102e] to-transparent" />
      </div>
      <div className="matches flex-1 flex flex-col justify-around relative">
        {pairs.map((pair, idx) => (
          <div key={idx} className="pair flex flex-col justify-around relative">
            {pair.map((match) => (
              <MatchCard key={match.matchNo} match={match} onEdit={onEdit} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TournamentPage() {
  const [data, setData] = useState<TournamentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [editingMatch, setEditingMatch] = useState<MatchData | null>(null)
  const [predicting, setPredicting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/tournament')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('Failed to fetch:', err)
      toast.error('Failed to load tournament data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSaveScore = async (matchNo: string, homeScore: number, awayScore: number) => {
    try {
      const res = await fetch('/api/matches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchNo, homeScore, awayScore }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success(`Match ${matchNo} updated!`)
        setEditingMatch(null)
        await fetchData()
      } else {
        toast.error(json.error || 'Failed to update')
      }
    } catch {
      toast.error('Failed to update match')
    }
  }

  const handlePredict = async () => {
    setPredicting(true)
    try {
      const res = await fetch('/api/predict', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        toast.success(`AI predicted ${json.count} upcoming matches!`)
        await fetchData()
      } else {
        toast.error(json.error || 'Prediction failed')
      }
    } catch {
      toast.error('Prediction failed')
    } finally {
      setPredicting(false)
    }
  }

  const handleDownload = () => {
    const html = document.documentElement.outerHTML
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'FIFA_2026_Bracket.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e9eef3]">
        <div className="text-center">
          <div className="text-4xl mb-4">⚽</div>
          <div className="text-[#0a1f3c] font-bold text-lg">Loading Tournament...</div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { groups, matches } = data

  return (
    <div className="min-h-screen bg-[#e9eef3] text-[#0a1f3c]" style={{ overflow: 'hidden', height: '100vh' }}>
      {/* Toolbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a1f3c] text-white flex justify-between items-center px-6 z-[1000] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3a6c] to-[#0a1f3c] border-2 border-[#d4af37] flex items-center justify-center font-black text-[#d4af37] text-base">
            26
          </div>
          <div>
            <h1 className="text-base font-extrabold leading-tight">FIFA World Cup 2026</h1>
            <p className="text-[11px] text-[#8ba1bd] tracking-[2px] mt-0.5 uppercase">Full Tournament Bracket</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(Math.max(z - 0.1, 0.4), 2.0))}
            className="bg-white/10 text-white border border-white/20 h-10 min-w-10 px-3 rounded-lg cursor-pointer text-base font-bold flex items-center justify-center hover:bg-white/20 transition-all"
          >
            −
          </button>
          <span className="text-xs text-[#8ba1bd] w-12 text-center font-bold">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel(1)}
            className="bg-white/10 text-white border border-white/20 h-10 min-w-10 px-3 rounded-lg cursor-pointer text-base font-bold flex items-center justify-center hover:bg-white/20 transition-all"
            title="Reset Zoom"
          >
            ⟲
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(Math.max(z + 0.1, 0.4), 2.0))}
            className="bg-white/10 text-white border border-white/20 h-10 min-w-10 px-3 rounded-lg cursor-pointer text-base font-bold flex items-center justify-center hover:bg-white/20 transition-all"
          >
            +
          </button>
          <button
            onClick={handlePredict}
            disabled={predicting}
            className="bg-gradient-to-r from-[#4a90e2] to-[#1a3a6c] border border-[#4a90e2] h-10 px-3 rounded-lg cursor-pointer text-[13px] font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-50"
          >
            <span>✨</span> {predicting ? 'Predicting...' : 'Predict with AI'}
          </button>
          <button
            onClick={handleDownload}
            className="bg-[#1a3a6c] border border-[#1a3a6c] h-10 px-3 rounded-lg cursor-pointer text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#2a4a7c] transition-all"
          >
            <span>⬇</span> Download
          </button>
          <button
            onClick={() => window.print()}
            className="bg-[#c8102e] border border-[#c8102e] h-10 px-3 rounded-lg cursor-pointer text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#a00d24] transition-all"
          >
            <span>🖨</span> Print
          </button>
        </div>
      </header>

      {/* Scroll Area */}
      <div className="absolute top-16 left-0 right-0 bottom-0 overflow-auto bg-[#d9dee5]" style={{ backgroundImage: 'radial-gradient(#c5cdd6 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div
          className="w-[1800px] p-10"
          style={{ transformOrigin: 'top left', transform: `scale(${zoomLevel})` }}
        >
          <main className="bg-white w-full rounded-xl shadow-xl p-8 relative">
            {/* Group Stage */}
            <section className="grid grid-cols-4 gap-5 mb-10" aria-label="Group Stage">
              {groups.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </section>

            {/* Knockout Bracket */}
            <section className="bracket-container grid grid-cols-9 gap-5 relative" aria-label="Knockout Stage">
              {/* Left: R32 */}
              <KnockoutColumn
                title="Round of 32"
                dateRange="JUN 28 – JUL 3"
                matches={getLeftMatches(matches, 'R32')}
                side="left"
                onEdit={setEditingMatch}
              />
              {/* Left: R16 */}
              <KnockoutColumn
                title="Round of 16"
                dateRange="JUL 4 – 7"
                matches={getLeftMatches(matches, 'R16')}
                side="left"
                onEdit={setEditingMatch}
              />
              {/* Left: QF */}
              <KnockoutColumn
                title="Quarter-Final"
                dateRange="JUL 9 – 10"
                matches={getLeftMatches(matches, 'QF')}
                side="left"
                onEdit={setEditingMatch}
              />
              {/* Left: SF */}
              <KnockoutColumn
                title="Semi-Final"
                dateRange="JUL 14"
                matches={getLeftMatches(matches, 'SF')}
                side="left"
                onEdit={setEditingMatch}
              />
              {/* Center: Final + 3rd Place */}
              <KnockoutColumn
                title="Final"
                dateRange="JUL 19"
                matches={matches.filter((m) => m.round === 'F' || m.round === '3P')}
                side="center"
                onEdit={setEditingMatch}
                isSpecial
                specialType="final"
              />
              {/* Right: SF */}
              <KnockoutColumn
                title="Semi-Final"
                dateRange="JUL 15"
                matches={getRightMatches(matches, 'SF')}
                side="right"
                onEdit={setEditingMatch}
              />
              {/* Right: QF */}
              <KnockoutColumn
                title="Quarter-Final"
                dateRange="JUL 10 – 11"
                matches={getRightMatches(matches, 'QF')}
                side="right"
                onEdit={setEditingMatch}
              />
              {/* Right: R16 */}
              <KnockoutColumn
                title="Round of 16"
                dateRange="JUL 4 – 7"
                matches={getRightMatches(matches, 'R16')}
                side="right"
                onEdit={setEditingMatch}
              />
              {/* Right: R32 */}
              <KnockoutColumn
                title="Round of 32"
                dateRange="JUN 28 – JUL 3"
                matches={getRightMatches(matches, 'R32')}
                side="right"
                onEdit={setEditingMatch}
              />
            </section>

            {/* Footer */}
            <footer className="mt-8 pt-3 border-t-2 border-[#0a1f3c] flex justify-between items-center text-[11px] text-[#6b7785]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#0a1f3c] to-[#c8102e] rounded-lg flex items-center justify-center text-[#d4af37] font-black text-base">T</div>
                <div>
                  <div className="text-[13px] font-extrabold text-[#0a1f3c]">FIFA World Cup 2026 Tracker</div>
                  <div className="text-[9px]">Full tournament bracket with AI predictions</div>
                </div>
              </div>
              <div className="text-[9px]">Data loaded from backend API • Click editable matches to update scores</div>
            </footer>
          </main>
        </div>
      </div>

      {/* Score Edit Dialog */}
      {editingMatch && (
        <ScoreDialog
          match={editingMatch}
          onSave={handleSaveScore}
          onCancel={() => setEditingMatch(null)}
        />
      )}

      <style jsx global>{`
        .team-name.winner {
          color: #0a7b3e !important;
          font-weight: 800;
        }
        .team-name.winner::before {
          content: '★ ';
          color: #d4af37;
          font-size: 9px;
        }
        .team-name.predicted {
          color: #1a73e8 !important;
          font-weight: 800;
        }
        .team-name.predicted::before {
          content: '🤖 ';
          font-size: 9px;
        }
        .score.winner-score {
          background: #e6f5ec !important;
          border-color: #0a7b3e !important;
          color: #0a7b3e !important;
        }
        .score.predicted-score {
          background: #e8f0fe !important;
          border-color: #1a73e8 !important;
          color: #1a73e8 !important;
        }

        /* Bracket connectors */
        .r32-l .pair::after,
        .r16-l .pair::after,
        .qf-l .pair::after {
          content: '';
          position: absolute;
          right: -10px;
          top: 25%;
          bottom: 25%;
          width: 10px;
          border: solid #b8c2cc;
          border-width: 0 2px 2px 0;
          border-radius: 0 0 8px 0;
        }
        .r32-l .pair::before,
        .r16-l .pair::before,
        .qf-l .pair::before {
          content: '';
          position: absolute;
          right: -20px;
          top: 50%;
          width: 10px;
          height: 2px;
          background: #b8c2cc;
        }
        .sf-l .match::after {
          content: '';
          position: absolute;
          right: -20px;
          top: 50%;
          width: 20px;
          height: 2px;
          background: #b8c2cc;
        }
        .r32-r .pair::after,
        .r16-r .pair::after,
        .qf-r .pair::after {
          content: '';
          position: absolute;
          left: -10px;
          top: 25%;
          bottom: 25%;
          width: 10px;
          border: solid #b8c2cc;
          border-width: 0 0 2px 2px;
          border-radius: 0 0 0 8px;
        }
        .r32-r .pair::before,
        .r16-r .pair::before,
        .qf-r .pair::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 50%;
          width: 10px;
          height: 2px;
          background: #b8c2cc;
        }
        .sf-r .match::after {
          content: '';
          position: absolute;
          left: -20px;
          top: 50%;
          width: 20px;
          height: 2px;
          background: #b8c2cc;
        }
        .sf-l .matches,
        .sf-r .matches {
          justify-content: center;
        }

        @media print {
          header { display: none !important; }
          .absolute.top-16 { position: static !important; overflow: visible !important; background: white !important; background-image: none !important; }
          [style*="transform: scale"] { transform: none !important; width: 100% !important; padding: 0 !important; }
          main { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>
    </div>
  )
}