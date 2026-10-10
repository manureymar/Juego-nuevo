import {art} from './art.js';

// The same illustrated coin and pulse emblem appear in every live currency value.
export function pulseCoin(cls='') {
  return `<span class="pulse-coin ${cls}" aria-hidden="true">${art('coin')}<svg viewBox="0 0 100 100"><path d="M23 51h13l7-17 13 33 8-23 6 7h9"/></svg></span>`;
}

// Small, directional tutorial control. It points to the catalogue source, not across the map.
export function guideArrow() {
  return `<svg class="mine-guide-arrow" viewBox="0 0 120 160" aria-hidden="true"><defs><linearGradient id="guide-metal" x2="1" y2="1"><stop stop-color="#e5faff"/><stop offset=".28" stop-color="#48768e"/><stop offset=".55" stop-color="#102b48"/><stop offset="1" stop-color="#70bdd6"/></linearGradient><linearGradient id="guide-light" x2="0" y2="1"><stop stop-color="#a7fcff"/><stop offset=".55" stop-color="#1ac7ec"/><stop offset="1" stop-color="#0783bc"/></linearGradient></defs><path d="M32 7h56v77h26l-54 67L6 84h26z" fill="url(#guide-metal)" stroke="#020f24" stroke-width="7" stroke-linejoin="round"/><path d="M43 18h34v77h18l-35 43-35-43h18z" fill="url(#guide-light)" stroke="#d7ffff" stroke-width="2"/><path d="M49 31h22M49 44h22M49 57h22" stroke="#fff5bd" stroke-width="5"/><path d="m45 108 15 18 15-18" fill="none" stroke="#ebffff" stroke-width="4" stroke-linecap="round"/></svg>`;
}
