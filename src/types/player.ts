export interface Player {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar: string;
  funnyTitle?: string;
  isCurrentPlayer?: boolean;
}

export interface LeaderboardEntry extends Player {
  previousRank?: number;
  rankChange?: 'up' | 'down' | 'same';
  isNew?: boolean;
}

export const FUNNY_TITLES: Record<number, string> = {
  1: 'THE FINAL SCROLL BOSS',
  2: 'CERTIFIED SCROLL ADDICT',
  3: 'PROFESSIONAL TIME WASTER',
  4: 'CASUAL DOOM SCROLLER',
  5: 'WEEKEND WARRIOR',
  6: 'SCROLLING ENTHUSIAST',
  7: 'ASPIRING TIME WASTER',
};

export const CHAMPION_DESCRIPTIONS: Record<number, string> = {
  1: 'Absolutely consumed by the infinite feed. Sleep is optional.',
  2: 'Officially diagnosed with scrollitis. Still going.',
  3: 'Started scrolling as a hobby. It became a lifestyle.',
};
