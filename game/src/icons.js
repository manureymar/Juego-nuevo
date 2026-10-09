const paths = {
  battery: '<rect x="2" y="6" width="17" height="12" rx="3"/><path d="M21 10v4M6 10v4m4-4v4m4-4v4"/>',
  bolt: '<path d="m14 2-9 12h6l-1 8 9-12h-6z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/><path d="m7 13 3-4 3 6 4-5"/>',
  shop: '<path d="m3 7 9-4 9 4v12l-9 3-9-3zM3 7l9 4 9-4M12 11v11M8 5l9 4v6"/>',
  trophy: '<path d="M7 3h10v7a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 15v4m-4 2h8m-7-2h6"/>',
  gear: '<path d="m9 3 1-2h4l1 2 3 2 2 .5 2 3-1 2v3l1 2-2 3-2 .5-3 2-1 2h-4l-1-2-3-2-2-.5-2-3 1-2v-3l-1-2 2-3L6 5z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
  play: '<path d="m8 4 12 8-12 8z"/>',
  pause: '<path d="M8 5v14M16 5v14" stroke-width="4"/>',
  back: '<path d="m14 5-7 7 7 7M7 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  reload: '<path d="M20 7a9 9 0 1 0 1 10M20 2v6h-6"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8C3 9 5 1 8 3c3 1 4 5 4 5s1-4 4-5c3-2 5 6-4 5"/>',
  sound: '<path d="m11 4-6 5H2v6h3l6 5zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  mute: '<path d="m11 4-6 5H2v6h3l6 5zM16 9l6 6m0-6-6 6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v7l4 2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01"/>',
  star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  shield: '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6zM8 12l3 3 5-6"/>',
  cube: '<path d="m12 2 10 6v9l-10 5-10-5V8zM2 8l10 5 10-5M12 13v9"/>',
};

export function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.cube}</svg>`;
}

export function robotIcon(color = '#2edbff', top = false) {
  return `<svg class="robot-icon" viewBox="0 0 100 100" aria-hidden="true" style="--robot-color:${color}">
    <path d="M20 78v13h20V77m22 0v14h20V76" fill="#142b45" stroke="#8194a9" stroke-width="3"/>
    <path d="M20 17V8h9v17" stroke="#253e55" stroke-width="6"/><rect x="17" y="3" width="15" height="15" rx="3" fill="#ffcc54" stroke="#ffe8a3" stroke-width="2"/>
    <path d="M26 18h43l18 18v36L71 87H28L12 70V35z" fill="var(--robot-color)" stroke="#103049" stroke-width="6"/>
    <path d="m26 23 43 0 13 14v31L69 81H30L18 68V37z" fill="none" stroke="#d5f8ff" stroke-opacity=".6" stroke-width="2"/>
    <path d="M33 29h30l11 11v24L62 74H34L25 63V40z" fill="#122238" stroke="#788698" stroke-width="4"/>
    <rect x="35" y="42" width="9" height="17" rx="3" fill="#fff4bc"/><rect x="56" y="42" width="9" height="17" rx="3" fill="#fff4bc"/>
    ${top ? '<path d="M76 10h15v50H76z" fill="#253c57" stroke="#8babbf" stroke-width="3"/><path d="M79 9h9v19h-9z" fill="var(--robot-color)"/><path d="M82 7h4" stroke="#e2faff" stroke-width="3"/>' : '<path d="M8 58h23l6 6v17l-7 5H8l-5-6V64z" fill="#28445c" stroke="#98acba" stroke-width="3"/><rect x="8" y="63" width="17" height="16" rx="3" fill="var(--robot-color)"/><rect x="12" y="67" width="9" height="8" fill="#082038"/>'}
  </svg>`;
}

export function coinStack(tier = 1) {
  let coins = '';
  for (let k = 0; k < Math.min(4, tier + 1); k++) for (let j = 0; j < 2 + Math.min(4, tier + k % 2); j++) {
    const x = 22 + k * 19, y = 81 - j * 8 - (k % 2) * 6;
    coins += `<path d="M${x - 16} ${y}v7c0 9 32 9 32 0v-7" fill="#dd951d" stroke="#ffc748"/><ellipse cx="${x}" cy="${y}" rx="16" ry="6" fill="#ffdb6a" stroke="#fff0b0"/><path d="m${x - 7} ${y} 4-2 4 3 5-2" stroke="#da8d13" fill="none"/>`;
  }
  return `<svg viewBox="0 0 120 104" class="coin-stack" aria-hidden="true">${tier > 2 ? '<path d="m9 44 50-15 48 15v45l-49 12L9 89z" fill="#173751" stroke="#53dbff" stroke-width="2"/>' : ''}${coins}</svg>`;
}
