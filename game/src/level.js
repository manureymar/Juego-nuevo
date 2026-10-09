export const COLORS = {
  C: { name: 'Cyan', hex: '#2edbff', dark: '#1688b6', symbol: '◆' },
  A: { name: 'Amber', hex: '#ffc443', dark: '#d98719', symbol: '●' },
  P: { name: 'Violet', hex: '#b890ff', dark: '#7252bc', symbol: '✚' },
};

// Original pixel robot, not a copied level. Each letter is a destructible block.
export const LEVEL_ONE = {
  id: 1,
  revision: 3,
  name: 'First Contact',
  size: 9,
  speed: 5.8,
  beltCapacity: 5,
  parkingCapacity: 5,
  grid: [
    '....P....',
    '...PPP...',
    '..CCCCC..',
    '.CCCCCCC.',
    'PCAA.AACP',
    'PCAA.AACP',
    '.CCCCCCC.',
    '...CCC...',
    '.........',
  ],
  queues: [
    [{ color: 'C', ammo: 7 }, { color: 'A', ammo: 3 }, { color: 'C', ammo: 6 }],
    [{ color: 'A', ammo: 3 }, { color: 'C', ammo: 7 }, { color: 'P', ammo: 4 }],
    [{ color: 'P', ammo: 4 }, { color: 'C', ammo: 6 }, { color: 'A', ammo: 2 }],
  ],
};

export function blockCounts(grid) {
  const counts = {};
  for (const row of grid) for (const c of row) if (c && c !== '.') counts[c] = (counts[c] || 0) + 1;
  return counts;
}
