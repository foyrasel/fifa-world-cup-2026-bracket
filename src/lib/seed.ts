import { db } from '@/lib/db'

const GROUPS: Record<string, {name:string,code:string,emoji:string}[]> = {
  A: [{name:'France',code:'FRA',emoji:'🇫🇷'},{name:'Germany',code:'GER',emoji:'🇩🇪'},{name:'Peru',code:'PER',emoji:'🇵🇪'},{name:'Jamaica',code:'JAM',emoji:'🇯🇲'}],
  B: [{name:'Spain',code:'ESP',emoji:'🇪🇸'},{name:'Sweden',code:'SWE',emoji:'🇸🇪'},{name:'South Africa',code:'RSA',emoji:'🇿🇦'},{name:'UAE',code:'UAE',emoji:'🇦🇪'}],
  C: [{name:'Poland',code:'POL',emoji:'🇵🇱'},{name:'England',code:'ENG',emoji:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'},{name:'Chile',code:'CHI',emoji:'🇨🇱'},{name:'Cameroon',code:'CMR',emoji:'🇨🇲'}],
  D: [{name:'Netherlands',code:'NED',emoji:'🇳🇱'},{name:'Mexico',code:'MEX',emoji:'🇲🇽'},{name:'Tunisia',code:'TUN',emoji:'🇹🇳'},{name:'New Zealand',code:'NZL',emoji:'🇳🇿'}],
  E: [{name:'Portugal',code:'POR',emoji:'🇵🇹'},{name:'Colombia',code:'COL',emoji:'🇨🇴'},{name:'Nigeria',code:'NGA',emoji:'🇳🇬'},{name:'Saudi Arabia',code:'KSA',emoji:'🇸🇦'}],
  F: [{name:'Argentina',code:'ARG',emoji:'🇦🇷'},{name:'Morocco',code:'MAR',emoji:'🇲🇦'},{name:'Paraguay',code:'PRY',emoji:'🇵🇾'},{name:'South Korea',code:'KOR',emoji:'🇰🇷'}],
  G: [{name:'Belgium',code:'BEL',emoji:'🇧🇪'},{name:'Iran',code:'IRN',emoji:'🇮🇷'},{name:'Australia',code:'AUS',emoji:'🇦🇺'},{name:'Honduras',code:'HND',emoji:'🇭🇳'}],
  H: [{name:'Wales',code:'WAL',emoji:'🏴󠁧󠁢󠁷󠁬󠁳󠁿'},{name:'Ecuador',code:'ECU',emoji:'🇪🇨'},{name:'Canada',code:'CAN',emoji:'🇨🇦'},{name:'Iceland',code:'ISL',emoji:'🇮🇸'}],
  I: [{name:'Uruguay',code:'URU',emoji:'🇺🇾'},{name:'Senegal',code:'SEN',emoji:'🇸🇳'},{name:'Japan',code:'JPN',emoji:'🇯🇵'},{name:'Qatar',code:'QAT',emoji:'🇶🇦'}],
  J: [{name:'Italy',code:'ITA',emoji:'🇮🇹'},{name:'Costa Rica',code:'CRC',emoji:'🇨🇷'},{name:'USA',code:'USA',emoji:'🇺🇸'},{name:'Algeria',code:'ALG',emoji:'🇩🇿'}],
  K: [{name:'Switzerland',code:'SUI',emoji:'🇨🇭'},{name:'Serbia',code:'SRB',emoji:'🇷🇸'},{name:'Egypt',code:'EGY',emoji:'🇪🇬'},{name:'Panama',code:'PAN',emoji:'🇵🇦'}],
  L: [{name:'Denmark',code:'DEN',emoji:'🇩🇰'},{name:'Croatia',code:'CRO',emoji:'🇭🇷'},{name:'Ghana',code:'GHA',emoji:'🇬🇭'},{name:'Bolivia',code:'BOL',emoji:'🇧🇴'}],
}
const STANDINGS: Record<string, [string,number,number,number,number,number][]> = {
  A:[['France',3,2,1,0,7],['Germany',3,2,0,1,6],['Peru',3,0,1,2,1],['Jamaica',3,0,0,3,0]],
  B:[['Spain',3,3,0,0,9],['Sweden',3,1,1,1,4],['South Africa',3,1,0,2,3],['UAE',3,0,1,2,1]],
  C:[['Poland',3,2,1,0,7],['England',3,2,0,1,6],['Chile',3,1,0,2,3],['Cameroon',3,0,1,2,1]],
  D:[['Netherlands',3,2,1,0,7],['Mexico',3,1,2,0,5],['Tunisia',3,0,2,1,2],['New Zealand',3,0,1,2,1]],
  E:[['Portugal',3,2,1,0,7],['Colombia',3,2,0,1,6],['Nigeria',3,1,0,2,3],['Saudi Arabia',3,0,1,2,1]],
  F:[['Argentina',3,3,0,0,9],['Morocco',3,2,0,1,6],['Paraguay',3,0,1,2,1],['South Korea',3,0,1,2,1]],
  G:[['Belgium',3,2,1,0,7],['Iran',3,1,1,1,4],['Australia',3,1,0,2,3],['Honduras',3,0,2,1,2]],
  H:[['Wales',3,2,0,1,6],['Ecuador',3,2,0,1,6],['Canada',3,1,0,2,3],['Iceland',3,0,0,3,0]],
  I:[['Uruguay',3,2,1,0,7],['Senegal',3,2,0,1,6],['Japan',3,0,1,2,1],['Qatar',3,0,0,3,0]],
  J:[['Italy',3,3,0,0,9],['Costa Rica',3,1,2,0,5],['USA',3,1,0,2,3],['Algeria',3,0,2,1,2]],
  K:[['Switzerland',3,2,1,0,7],['Serbia',3,2,0,1,6],['Egypt',3,1,0,2,3],['Panama',3,0,1,2,1]],
  L:[['Denmark',3,2,1,0,7],['Croatia',3,1,2,0,5],['Ghana',3,1,0,2,3],['Bolivia',3,0,1,2,1]],
}
const FEED: Record<string, {w?:string;ws?:string;l?:string;ls?:string}> = {
  M73:{w:'M89',ws:'home'},M74:{w:'M89',ws:'away'},
  M75:{w:'M90',ws:'home'},M76:{w:'M90',ws:'away'},
  M77:{w:'M91',ws:'home'},M78:{w:'M91',ws:'away'},
  M79:{w:'M92',ws:'home'},M80:{w:'M92',ws:'away'},
  M81:{w:'M93',ws:'home'},M82:{w:'M93',ws:'away'},
  M83:{w:'M94',ws:'home'},M84:{w:'M94',ws:'away'},
  M85:{w:'M95',ws:'home'},M86:{w:'M95',ws:'away'},
  M87:{w:'M96',ws:'home'},M88:{w:'M96',ws:'away'},
  M89:{w:'M97',ws:'home'},M90:{w:'M97',ws:'away'},M91:{w:'M98',ws:'home'},M92:{w:'M98',ws:'away'},
  M93:{w:'M99',ws:'home'},M94:{w:'M99',ws:'away'},M95:{w:'M100',ws:'home'},M96:{w:'M100',ws:'away'},
  M97:{w:'M101',ws:'home'},M98:{w:'M101',ws:'away'},M99:{w:'M102',ws:'home'},M100:{w:'M102',ws:'away'},
  M101:{w:'M104',ws:'home',l:'M103',ls:'home'},M102:{w:'M104',ws:'away',l:'M103',ls:'away'},
}
// [matchNo, homeTeam, homeSeed, awayTeam, awaySeed, date, round, venue]
const K = [
  ['M73','France','1A','South Africa','3B','Jun 28','R32',''],
  ['M74','Poland','1C','Nigeria','3E','Jun 28','R32',''],
  ['M75','Spain','1B','Chile','3A/C','Jun 29','R32',''],
  ['M76','Portugal','1E','Australia','3G','Jun 29','R32',''],
  ['M77','Netherlands','1D','Ghana','3L','Jun 29','R32',''],
  ['M78','Argentina','1F','Canada','3H','Jun 30','R32',''],
  ['M79','Germany','2A','Sweden','2B','Jun 30','R32',''],
  ['M80','England','2C','Mexico','2D','Jun 30','R32',''],
  ['M81','Belgium','1G','Egypt','3K','Jul 1','R32',''],
  ['M82','Wales','1H','Algeria','3J','Jul 1','R32',''],
  ['M83','Italy','1J','Qatar','3I/L','Jul 2','R32',''],
  ['M84','Serbia','1K','Croatia','3D','Jul 2','R32',''],
  ['M85','Denmark','1L','Iran','2G','Jul 2','R32',''],
  ['M86','Uruguay','1I','Colombia','2E','Jul 3','R32',''],
  ['M87','Ecuador','2H','Costa Rica','2J','Jul 3','R32',''],
  ['M88','USA','2K','Switzerland','2L','Jul 3','R32',''],
  ['M89','','W73','','W74','Jul 4','R16',''],
  ['M90','','W75','','W76','Jul 5','R16',''],
  ['M91','','W77','','W78','Jul 5','R16',''],
  ['M92','','W79','','W80','Jul 6','R16',''],
  ['M93','','W81','','W82','Jul 6','R16',''],
  ['M94','','W83','','W84','Jul 7','R16',''],
  ['M95','','W85','','W86','Jul 7','R16',''],
  ['M96','','W87','','W88','Jul 7','R16',''],
  ['M97','','W89','','W90','Jul 9','QF',''],
  ['M98','','W91','','W92','Jul 10','QF',''],
  ['M99','','W93','','W94','Jul 10','QF',''],
  ['M100','','W95','','W96','Jul 11','QF',''],
  ['M101','','W97','','W98','Jul 14','SF',''],
  ['M102','','W99','','W100','Jul 15','SF',''],
  ['M103','','L101','','L102','Jul 18','3P','HARD ROCK STADIUM · MIAMI'],
  ['M104','','W101','','W102','Jul 19','F','METLIFE STADIUM · NEW YORK / NEW JERSEY'],
]

let seeded = false

export async function seedIfEmpty() {
  if (seeded) return
  try {
    const count = await db.group.count()
    if (count > 0) { seeded = true; return }

    for (const [gn, teams] of Object.entries(GROUPS)) {
      const g = await db.group.create({ data: { name: gn } })
      for (const t of teams) await db.team.create({ data: { name: t.name, code: t.code, flagEmoji: t.emoji, groupId: g.id } })
      for (let i = 0; i < (STANDINGS[gn] || []).length; i++) {
        const s = STANDINGS[gn][i]
        await db.groupStanding.create({ data: { groupId: g.id, teamName: s[0], played: s[1], won: s[2], drawn: s[3], lost: s[4], points: s[5], position: i + 1 } })
      }
    }
    for (const m of K) {
      const f = FEED[m[0]] || {}
      await db.match.create({
        data: {
          matchNo: m[0], round: m[6], date: m[5], venue: m[7] || '',
          homeTeamName: m[1], awayTeamName: m[3], homeSeed: m[2], awaySeed: m[4],
          homeScore: null, awayScore: null, status: 'upcoming', homeWinner: false, awayWinner: false, isEditable: true,
          winnerGoesToMatchNo: f.w || '', winnerGoesToSide: f.ws || 'home',
          loserGoesToMatchNo: f.l || '', loserGoesToSide: f.ls || 'home',
        }
      })
    }
    seeded = true
    console.log('Auto-seed complete!')
  } catch (e) {
    console.error('Auto-seed failed:', e)
  }
}