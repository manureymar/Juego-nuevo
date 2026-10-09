// Atlas coordinates are design pixels. Source PNG pixels are never resampled or
// destructively cut: CSS clips the reusable controls and character sprites.
const home = 'home-layer', rank = 'leaderboard-layer';
const region = (file,x,y,w,h,width=887,height=1774) => ({file,x,y,w,h,width,height});
export const MENU_ART = {
  avatar: region(home,34,15,126,120),
  energy: region(home,192,38,263,76),
  currency: region(home,464,35,266,82),
  settings: region(home,752,24,108,104),
  battery: region(home,196,39,102,71),
  'shop-idle': region(home,0,1573,302,201),
  'shop-active': region('nav-layer',0,1573,302,201),
  'home-idle': region(rank,302,1573,287,201),
  'home-active': region(home,302,1573,287,201),
  'leaderboard-idle': region(home,589,1573,298,201),
  'leaderboard-active': region(rank,589,1573,298,201),
  'tab-active': region(rank,76,382,375,89),
  'tab-idle': region(rank,451,382,363,89),
  'region-active': region(rank,76,482,216,62),
  'region-idle': region(rank,292,482,201,62),
  'level-locked': region(home,363,393,166,163),
  'level-active': region(home,347,801,193,187),
  'upgrade-cube': region(home,73,408,191,205),
  'upgrade-cannon': region(home,624,407,194,207),
  'upgrade-shield': region(home,73,658,191,207),
  'upgrade-coins': region(home,624,658,194,207),
  'play': region(home,163,1360,568,194),
  'rank-row': region(rank,46,1080,794,106),
  'player-row': region(rank,41,1398,804,125),
  'podium-gold': region(rank,299,776,287,280),
  'podium-silver': region(rank,39,834,272,225),
  'podium-bronze': region(rank,580,845,271,217),
  'crown': region(rank,402,543,81,64),
  'robot-cyan': region('robots',29,37,475,421,1536,1024),
  'robot-violet': region('robots',528,41,472,417,1536,1024),
  'robot-amber': region('robots',1027,39,472,419,1536,1024),
  'robot-red': region('robots',29,545,475,418,1536,1024),
  'robot-green': region('robots',526,547,475,416,1536,1024),
  'robot-silver': region('robots',1027,546,476,418,1536,1024),
};

export function menuArt(name, cls='') {
  const a=MENU_ART[name];
  if(!a)throw new Error(`Unknown menu sprite: ${name}`);
  return `<span class="ui-sprite ${cls}" aria-hidden="true"><img src="assets/ui-v3/${a.file}.png" alt="" draggable="false" style="left:${-100*a.x/a.w}%;top:${-100*a.y/a.h}%;width:${100*a.width/a.w}%;height:${100*a.height/a.h}%"></span>`;
}

export function pilotArt(skin='cyan',cls='') {
  return menuArt('robot-'+(MENU_ART['robot-'+skin]?skin:'cyan'),cls);
}
