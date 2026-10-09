// Offline fixtures only. A remote ranking service can replace the fixtures
// without changing the artwork, semantic controls or score persistence.
export function monthKey(now=Date.now()) {
  return new Date(now).toISOString().slice(0,7);
}

export function monthRemaining(now=Date.now()) {
  const date=new Date(now);
  const end=Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,1);
  const hours=Math.max(0,Math.ceil((end-now)/3600000));
  return `${Math.floor(hours/24)}d ${hours%24}h`;
}

export function leaderboardRows(profile,tab,region,you='You',now=Date.now()) {
  const pilots=region==='global'
    ? [['NOVA',1520,'cyan'],['VOLT',1390,'violet'],['ECHO',1320,'amber'],['AXEL',1240,'red'],['LUNA',1180,'green'],['ORION',1120,'silver']]
    : [['NOVA',1420,'cyan'],['AXEL',1290,'red'],['LUNA',1180,'green'],['ECHO',1120,'amber'],['VOLT',1060,'violet'],['ORION',990,'silver']];
  const score=tab==='master'?profile.bestScore:(profile.monthlyKey===monthKey(now)?profile.monthlyScore:0);
  return [...pilots.map(([name,points,skin])=>({name,score:points+(tab==='master'?240:0),skin,player:false})),
    {name:you,score:score||0,skin:profile.skin,player:true}]
    .sort((a,b)=>b.score-a.score||Number(b.player)-Number(a.player))
    .map((row,index)=>({...row,rank:index+1}));
}

// Demonstration archive. Dates move with the calendar; these are not live results.
export function historyMonths(page=0,language='en',now=Date.now()){
  const current=new Date(now);
  return Array.from({length:2},(_,i)=>{
    const date=new Date(Date.UTC(current.getUTCFullYear(),current.getUTCMonth()-1-page*2-i,1));
    return {key:date.toISOString().slice(0,7),label:new Intl.DateTimeFormat(language,{month:'long',year:'numeric',timeZone:'UTC'}).format(date),pilots:[
      {name:i?'VOLT':'NOVA',skin:i?'violet':'cyan',score:1820-i*110},
      {name:i?'LUNA':'ECHO',skin:i?'green':'amber',score:1630-i*90},
      {name:'AXEL',skin:'red',score:1470-i*80}
    ]};
  });
}
