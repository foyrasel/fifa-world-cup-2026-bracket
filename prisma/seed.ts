import { db } from '@/lib/db'

const GROUPS = {
  A: [
    { name: 'France', code: 'FRA', emoji: '🇫🇷' },
    { name: 'Germany', code: 'GER', emoji: '🇩🇪' },
    { name: 'Peru', code: 'PER', emoji: '🇵🇪' },
    { name: 'Jamaica', code: 'JAM', emoji: '🇯🇲' },
  ],
  B: [
    { name: 'Spain', code: 'ESP', emoji: '🇪🇸' },
    { name: 'Sweden', code: 'SWE', emoji: '🇸🇪' },
    { name: 'South Africa', code: 'RSA', emoji: '🇿🇦' },
    { name: 'UAE', code: 'UAE', emoji: '🇦🇪' },
  ],
  C: [
    { name: 'Poland', code: 'POL', emoji: '🇵🇱' },
    { name: 'England', code: 'ENG', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { name: 'Chile', code: 'CHI', emoji: '🇨🇱' },
    { name: 'Cameroon', code: 'CMR', emoji: '🇨🇲' },
  ],
  D: [
    { name: 'Netherlands', code: 'NED', emoji: '🇳🇱' },
    { name: 'Mexico', code: 'MEX', emoji: '🇲🇽' },
    { name: 'Tunisia', code: 'TUN', emoji: '🇹🇳' },
    { name: 'New Zealand', code: 'NZL', emoji: '🇳🇿' },
  ],
  E: [
    { name: 'Portugal', code: 'POR', emoji: '🇵🇹' },
    { name: 'Colombia', code: 'COL', emoji: '🇨🇴' },
    { name: 'Nigeria', code: 'NGA', emoji: '🇳🇬' },
    { name: 'Saudi Arabia', code: 'KSA', emoji: '🇸🇦' },
  ],
  F: [
    { name: 'Argentina', code: 'ARG', emoji: '🇦🇷' },
    { name: 'Morocco', code: 'MAR', emoji: '🇲🇦' },
    { name: 'Paraguay', code: 'PRY', emoji: '🇵🇾' },
    { name: 'South Korea', code: 'KOR', emoji: '🇰🇷' },
  ],
  G: [
    { name: 'Belgium', code: 'BEL', emoji: '🇧🇪' },
    { name: 'Iran', code: 'IRN', emoji: '🇮🇷' },
    { name: 'Australia', code: 'AUS', emoji: '🇦🇺' },
    { name: 'Honduras', code: 'HND', emoji: '🇭🇳' },
  ],
  H: [
    { name: 'Wales', code: 'WAL', emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    { name: 'Ecuador', code: 'ECU', emoji: '🇪🇨' },
    { name: 'Canada', code: 'CAN', emoji: '🇨🇦' },
    { name: 'Iceland', code: 'ISL', emoji: '🇮🇸' },
  ],
  I: [
    { name: 'Uruguay', code: 'URU', emoji: '🇺🇾' },
    { name: 'Senegal', code: 'SEN', emoji: '🇸🇳' },
    { name: 'Japan', code: 'JPN', emoji: '🇯🇵' },
    { name: 'Qatar', code: 'QAT', emoji: '🇶🇦' },
  ],
  J: [
    { name: 'Italy', code: 'ITA', emoji: '🇮🇹' },
    { name: 'Costa Rica', code: 'CRC', emoji: '🇨🇷' },
    { name: 'USA', code: 'USA', emoji: '🇺🇸' },
    { name: 'Algeria', code: 'ALG', emoji: '🇩🇿' },
  ],
  K: [
    { name: 'Switzerland', code: 'SUI', emoji: '🇨🇭' },
    { name: 'Serbia', code: 'SRB', emoji: '🇷🇸' },
    { name: 'Egypt', code: 'EGY', emoji: '🇪🇬' },
    { name: 'Panama', code: 'PAN', emoji: '🇵🇦' },
  ],
  L: [
    { name: 'Denmark', code: 'DEN', emoji: '🇩🇰' },
    { name: 'Croatia', code: 'CRO', emoji: '🇭🇷' },
    { name: 'Ghana', code: 'GHA', emoji: '🇬🇭' },
    { name: 'Bolivia', code: 'BOL', emoji: '🇧🇴' },
  ],
}

// Standings from the HTML: [teamName, P, W, D, L, Pts]
const STANDINGS: Record<string, [string, number, number, number, number, number][]> = {
  A: [['France', 3, 2, 1, 0, 7], ['Germany', 3, 2, 0, 1, 6], ['Peru', 3, 0, 1, 2, 1], ['Jamaica', 3, 0, 0, 3, 0]],
  B: [['Spain', 3, 3, 0, 0, 9], ['Sweden', 3, 1, 1, 1, 4], ['South Africa', 3, 1, 0, 2, 3], ['UAE', 3, 0, 1, 2, 1]],
  C: [['Poland', 3, 2, 1, 0, 7], ['England', 3, 2, 0, 1, 6], ['Chile', 3, 1, 0, 2, 3], ['Cameroon', 3, 0, 1, 2, 1]],
  D: [['Netherlands', 3, 2, 1, 0, 7], ['Mexico', 3, 1, 2, 0, 5], ['Tunisia', 3, 0, 2, 1, 2], ['New Zealand', 3, 0, 1, 2, 1]],
  E: [['Portugal', 3, 2, 1, 0, 7], ['Colombia', 3, 2, 0, 1, 6], ['Nigeria', 3, 1, 0, 2, 3], ['Saudi Arabia', 3, 0, 1, 2, 1]],
  F: [['Argentina', 3, 3, 0, 0, 9], ['Morocco', 3, 2, 0, 1, 6], ['Paraguay', 3, 0, 1, 2, 1], ['South Korea', 3, 0, 1, 2, 1]],
  G: [['Belgium', 3, 2, 1, 0, 7], ['Iran', 3, 1, 1, 1, 4], ['Australia', 3, 1, 0, 2, 3], ['Honduras', 3, 0, 2, 1, 2]],
  H: [['Wales', 3, 2, 0, 1, 6], ['Ecuador', 3, 2, 0, 1, 6], ['Canada', 3, 1, 0, 2, 3], ['Iceland', 3, 0, 0, 3, 0]],
  I: [['Uruguay', 3, 2, 1, 0, 7], ['Senegal', 3, 2, 0, 1, 6], ['Japan', 3, 0, 1, 2, 1], ['Qatar', 3, 0, 0, 3, 0]],
  J: [['Italy', 3, 3, 0, 0, 9], ['Costa Rica', 3, 1, 2, 0, 5], ['USA', 3, 1, 0, 2, 3], ['Algeria', 3, 0, 2, 1, 2]],
  K: [['Switzerland', 3, 2, 1, 0, 7], ['Serbia', 3, 2, 0, 1, 6], ['Egypt', 3, 1, 0, 2, 3], ['Panama', 3, 0, 1, 2, 1]],
  L: [['Denmark', 3, 2, 1, 0, 7], ['Croatia', 3, 1, 2, 0, 5], ['Ghana', 3, 1, 0, 2, 3], ['Bolivia', 3, 0, 1, 2, 1]],
}

// Matches: [matchNo, home, homeSeed, away, awaySeed, homeScore, awayScore, homeWinner, date, round, venue]
type MatchData = [string, string, string, string, string, number | null, number | null, boolean, string, string, string]

const KNOCKOUT_MATCHES: MatchData[] = [
  // LEFT SIDE - Round of 32
  ['M73', 'France', '1A', 'Paraguay', '3B/F', 3, 0, true, 'Jun 28', 'R32', ''],
  ['M74', 'Poland', '1C', 'Brazil', '3D/E', 1, 2, false, 'Jun 28', 'R32', ''],
  ['M75', 'Spain', '1B', 'Japan', '3A/C', 2, 1, true, 'Jun 29', 'R32', ''],
  ['M76', 'Portugal', '1E', 'Australia', '3F/G', 4, 0, true, 'Jun 29', 'R32', ''],
  ['M77', 'Netherlands', '1D', 'Senegal', '3C/E', 2, 0, true, 'Jun 29', 'R32', ''],
  ['M78', 'Argentina', '1F', 'Morocco', '3A/B', 3, 1, true, 'Jun 30', 'R32', ''],
  ['M79', 'Germany', '2A', 'Sweden', '2B', 2, 2, false, 'Jun 30', 'R32', ''],
  ['M80', 'England', '2C', 'Mexico', '2D', 1, 0, true, 'Jun 30', 'R32', ''],

  // RIGHT SIDE - Round of 32
  ['M81', 'Belgium', '1G', 'Canada', '3H/K', 2, 1, true, 'Jul 1', 'R32', ''],
  ['M82', 'Wales', '1H', 'Croatia', '3G/J', 0, 1, false, 'Jul 1', 'R32', ''],
  ['M83', 'Italy', '1J', 'Qatar', '3I/L', 3, 0, true, 'Jul 2', 'R32', ''],
  ['M84', 'Serbia', '1K', 'Switzerland', '3J/K', 1, 2, false, 'Jul 2', 'R32', ''],
  ['M85', 'Denmark', '1L', 'Egypt', '3L/H', 1, 0, true, 'Jul 2', 'R32', ''],
  ['M86', 'Uruguay', '1I', 'Iran', '2G', 2, 0, true, 'Jul 3', 'R32', ''],
  ['M87', 'Ecuador', '2H', 'Ghana', '2L', 2, 1, true, 'Jul 3', 'R32', ''],
  ['M88', 'Costa Rica', '2J', 'USA', '2K', 0, 3, false, 'Jul 3', 'R32', ''],

  // LEFT SIDE - Round of 16
  ['M89', 'France', 'W73', 'Brazil', 'W74', 2, 1, true, 'Jul 4', 'R16', ''],
  ['M90', 'Spain', 'W75', 'Portugal', 'W76', 0, 1, false, 'Jul 5', 'R16', ''],
  ['M91', 'Netherlands', 'W77', 'Argentina', 'W78', 1, 2, false, 'Jul 5', 'R16', ''],
  ['M92', 'Germany', 'W79', 'England', 'W80', 1, 3, false, 'Jul 6', 'R16', ''],

  // RIGHT SIDE - Round of 16
  ['M93', 'Belgium', 'W81', 'Croatia', 'W82', 2, 0, true, 'Jul 6', 'R16', ''],
  ['M94', 'Italy', 'W83', 'Switzerland', 'W84', 1, 0, true, 'Jul 7', 'R16', ''],
  ['M95', 'Denmark', 'W85', 'Uruguay', 'W86', 3, 2, true, 'Jul 7', 'R16', ''],
  ['M96', 'Ecuador', 'W87', 'USA', 'W88', 1, 2, false, 'Jul 7', 'R16', ''],

  // LEFT SIDE - Quarter-Finals
  ['M97', 'France', 'W89', 'Portugal', 'W90', 3, 1, true, 'Jul 9', 'QF', ''],
  ['M98', 'Argentina', 'W91', 'England', 'W92', 2, 4, false, 'Jul 10', 'QF', ''],

  // RIGHT SIDE - Quarter-Finals
  ['M99', 'Belgium', 'W93', 'Italy', 'W94', 1, 2, false, 'Jul 10', 'QF', ''],
  ['M100', 'Denmark', 'W95', 'USA', 'W96', 0, 1, false, 'Jul 11', 'QF', ''],

  // Semi-Finals
  ['M101', '', 'W97', '', 'W98', null, null, false, 'Jul 14', 'SF', ''],
  ['M102', '', 'W99', '', 'W100', null, null, false, 'Jul 15', 'SF', ''],

  // 3rd Place
  ['M103', '', 'L101', '', 'L102', null, null, false, 'Jul 18', '3P', 'HARD ROCK STADIUM · MIAMI'],

  // Final
  ['M104', '', 'W101', '', 'W102', null, null, false, 'Jul 19', 'F', 'METLIFE STADIUM · NEW YORK / NEW JERSEY'],
]

// Define which match winners feed into which next match
const FEED_MAP: Record<string, { winnerMatchNo: string; winnerSide: string; loserMatchNo?: string; loserSide?: string }> = {
  M89: { winnerMatchNo: 'M97', winnerSide: 'home' },
  M90: { winnerMatchNo: 'M97', winnerSide: 'away' },
  M91: { winnerMatchNo: 'M98', winnerSide: 'home' },
  M92: { winnerMatchNo: 'M98', winnerSide: 'away' },
  M93: { winnerMatchNo: 'M99', winnerSide: 'home' },
  M94: { winnerMatchNo: 'M99', winnerSide: 'away' },
  M95: { winnerMatchNo: 'M100', winnerSide: 'home' },
  M96: { winnerMatchNo: 'M100', winnerSide: 'away' },
  M97: { winnerMatchNo: 'M101', winnerSide: 'home' },
  M98: { winnerMatchNo: 'M101', winnerSide: 'away' },
  M99: { winnerMatchNo: 'M102', winnerSide: 'home' },
  M100: { winnerMatchNo: 'M102', winnerSide: 'away' },
  M101: { winnerMatchNo: 'M104', winnerSide: 'home', loserMatchNo: 'M103', loserSide: 'home' },
  M102: { winnerMatchNo: 'M104', winnerSide: 'away', loserMatchNo: 'M103', loserSide: 'away' },
}

async function seed() {
  console.log('Seeding database...')

  // Create groups and teams
  for (const [groupName, teams] of Object.entries(GROUPS)) {
    const group = await db.group.create({ data: { name: groupName } })

    for (let i = 0; i < teams.length; i++) {
      await db.team.create({
        data: {
          name: teams[i].name,
          code: teams[i].code,
          flagEmoji: teams[i].emoji,
          groupId: group.id,
        },
      })
    }

    // Create standings
    const standings = STANDINGS[groupName]
    for (let i = 0; i < standings.length; i++) {
      const [teamName, played, won, drawn, lost, points] = standings[i]
      await db.groupStanding.create({
        data: {
          groupId: group.id,
          teamName,
          played,
          won,
          drawn,
          lost,
          points,
          position: i + 1,
        },
      })
    }
  }

  // Create knockout matches
  for (const [matchNo, home, homeSeed, away, awaySeed, homeScore, awayScore, homeWinner, date, round, venue] of KNOCKOUT_MATCHES) {
    const feed = FEED_MAP[matchNo]
    await db.match.create({
      data: {
        matchNo,
        round,
        date,
        venue,
        homeTeamName: home,
        awayTeamName: away,
        homeSeed,
        awaySeed,
        homeScore: homeScore ?? null,
        awayScore: awayScore ?? null,
        status: homeScore !== null ? 'completed' : 'upcoming',
        homeWinner: homeScore !== null && awayScore !== null ? homeScore > awayScore : false,
        awayWinner: homeScore !== null && awayScore !== null ? awayScore > homeScore : false,
        isEditable: homeScore === null,
        winnerGoesToMatchNo: feed?.winnerMatchNo ?? '',
        winnerGoesToSide: feed?.winnerSide ?? 'home',
        loserGoesToMatchNo: feed?.loserMatchNo ?? '',
        loserGoesToSide: feed?.loserSide ?? 'home',
      },
    })
  }

  console.log('Seed completed!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })