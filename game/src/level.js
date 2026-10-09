export const COLORS = {
  C: { name: 'Cyan', hex: '#2edbff', dark: '#1688b6', symbol: '◆' },
  A: { name: 'Amber', hex: '#ffc443', dark: '#d98719', symbol: '●' },
  P: { name: 'Violet', hex: '#b890ff', dark: '#7252bc', symbol: '✚' },
};

// Original pixel robot, not a copied level. Each letter is a destructible block.
export const LEVEL_ONE = {
  id: 1,
  name: 'First Contact',
  size: 12,
  speed: 5.8,
  beltCapacity: 5,
  parkingCapacity: 5,
  grid: [
    '....AAAA....',
    '.....AA.....',
    '..CCCCCCCC..',
    '.CCCCCCCCCC.',
    '.CCPPCCPPCC.',
    '.CCPPCCPPCC.',
    '.CCCCCCCCCC.',
    '..CCAAAACC..',
    '...CCCCCC...',
    '..CCC..CCC..',
    '..AA....AA..',
    '............',
  ],
  queues: [
    [{ color: 'C', ammo: 14 }, { color: 'P', ammo: 4 }, { color: 'A', ammo: 7 }],
    [{ color: 'C', ammo: 14 }, { color: 'A', ammo: 7 }],
    [{ color: 'P', ammo: 4 }, { color: 'C', ammo: 14 }, { color: 'C', ammo: 14 }],
  ],
};

export function blockCounts(grid) {
  const counts = {};
  for (const row of grid) for (const c of row) if (c && c !== '.') counts[c] = (counts[c] || 0) + 1;
  return counts;
}
