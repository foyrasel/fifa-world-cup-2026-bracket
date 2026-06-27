import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const GROUPS = {
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
const STANDINGS = {
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
const FEED = {
  M89:{w:'M97',ws:'home'},M90:{w:'M97',ws:'away'},M91:{w:'M98',ws:'home'},M92:{w:'M98',ws:'away'},
  M93:{w:'M99',ws:'home'},M94:{w:'M99',ws:'away'},M95:{w:'M100',ws:'home'},M96:{w:'M100',ws:'away'},
  M97:{w:'M101',ws:'home'},M98:{w:'M101',ws:'away'},M99:{w:'M102',ws:'home'},M100:{w:'M102',ws:'away'},
  M101:{w:'M104',ws:'home',l:'M103',ls:'home'},M102:{w:'M104',ws:'away',l:'M103',ls:'away'},
}
// [matchNo, home, homeSeed, away, awaySeed, homeScore, awayScore, homeWinner, date, round, venue]
const K = [
  ['M73','France','1A','Paraguay','3B/F',3,0,true,'Jun 28','R32',''],
  ['M74','Poland','1C','Brazil','3D/E',1,2,false,'Jun 28','R32',''],
  ['M75','Spain','1B','Japan','3A/C',2,1,true,'Jun 29','R32',''],
  ['M76','Portugal','1E','Australia','3F/G',4,0,true,'Jun 29','R32',''],
  ['M77','Netherlands','1D','Senegal','3C/E',2,0,true,'Jun 29','R32',''],
  ['M78','Argentina','1F','Morocco','3A/B',3,1,true,'Jun 30','R32',''],
  ['M79','Germany','2A','Sweden','2B',2,2,false,'Jun 30','R32',''],
  ['M80','England','2C','Mexico','2D',1,0,true,'Jun 30','R32',''],
  ['M81','Belgium','1G','Canada','3H/K',2,1,true,'Jul 1','R32',''],
  ['M82','Wales','1H','Croatia','3G/J',0,1,false,'Jul 1','R32',''],
  ['M83','Italy','1J','Qatar','3I/L',3,0,true,'Jul 2','R32',''],
  ['M84','Serbia','1K','Switzerland','3J/K',1,2,false,'Jul 2','R32',''],
  ['M85','Denmark','1L','Egypt','3L/H',1,0,true,'Jul 2','R32',''],
  ['M86','Uruguay','1I','Iran','2G',2,0,true,'Jul 3','R32',''],
  ['M87','Ecuador','2H','Ghana','2L',2,1,true,'Jul 3','R32',''],
  ['M88','Costa Rica','2J','USA','2K',0,3,false,'Jul 3','R32',''],
  ['M89','France','W73','Brazil','W74',2,1,true,'Jul 4','R16',''],
  ['M90','Spain','W75','Portugal','W76',0,1,false,'Jul 5','R16',''],
  ['M91','Netherlands','W77','Argentina','W78',1,2,false,'Jul 5','R16',''],
  ['M92','Germany','W79','England','W80',1,3,false,'Jul 6','R16',''],
  ['M93','Belgium','W81','Croatia','W82',2,0,true,'Jul 6','R16',''],
  ['M94','Italy','W83','Switzerland','W84',1,0,true,'Jul 7','R16',''],
  ['M95','Denmark','W85','Uruguay','W86',3,2,true,'Jul 7','R16',''],
  ['M96','Ecuador','W87','USA','W88',1,2,false,'Jul 7','R16',''],
  ['M97','France','W89','Portugal','W90',3,1,true,'Jul 9','QF',''],
  ['M98','Argentina','W91','England','W92',2,4,false,'Jul 10','QF',''],
  ['M99','Belgium','W93','Italy','W94',1,2,false,'Jul 10','QF',''],
  ['M100','Denmark','W95','USA','W96',0,1,false,'Jul 11','QF',''],
  ['M101','','W97','','W98',null,null,false,'Jul 14','SF',''],
  ['M102','','W99','','W100',null,null,false,'Jul 15','SF',''],
  ['M103','','L101','','L102',null,null,false,'Jul 18','3P','HARD ROCK STADIUM · MIAMI'],
  ['M104','','W101','','W102',null,null,false,'Jul 19','F','METLIFE STADIUM · NEW YORK / NEW JERSEY'],
]
async function seed() {
  console.log('Seeding...')
  for (const [gn, teams] of Object.entries(GROUPS)) {
    const g = await db.group.create({data:{name:gn}})
    for (const t of teams) await db.team.create({data:{name:t.name,code:t.code,flagEmoji:t.emoji,groupId:g.id}})
    for (let i=0;i<STANDINGS[gn].length;i++) {
      const s=STANDINGS[gn][i]
      await db.groupStanding.create({data:{groupId:g.id,teamName:s[0],played:s[1],won:s[2],drawn:s[3],lost:s[4],points:s[5],position:i+1}})
    }
  }
  for (const m of K) {
    const f=FEED[m[0]]||{}
    await db.match.create({data:{
      matchNo:m[0], round:m[9], date:m[8], venue:m[10],
      homeTeamName:m[1], awayTeamName:m[3], homeSeed:m[2], awaySeed:m[4],
      homeScore:m[5], awayScore:m[6],
      status:m[5]!==null?'completed':'upcoming',
      homeWinner:m[5]!==null&&m[6]!==null?m[5]>m[6]:false,
      awayWinner:m[5]!==null&&m[6]!==null?m[6]>m[5]:false,
      isEditable:m[5]===null,
      winnerGoesToMatchNo:f.w||'', winnerGoesToSide:f.ws||'home',
      loserGoesToMatchNo:f.l||'', loserGoesToSide:f.ls||'home',
    }})
  }
  const gc=await db.group.count(), tc=await db.team.count(), mc=await db.match.count()
  console.log('Done! Groups:',gc,'Teams:',tc,'Matches:',mc)
  await db.$disconnect()
}
seed().catch(e=>{console.error(e);process.exit(1)})
