import { BettingMarket, MarketStatus } from '../types/market.types';

export const mockTrending: BettingMarket[] = [
  {
    id: 'm1',
    name: 'Arsenal vs Chelsea',
    category: 'Premier League',
    startTime: new Date('2024-05-01T20:00:00Z'),
    status: MarketStatus.LIVE,
    liveTime: "68'",
    teams: [
      { name: 'Arsenal', score: 2, odds: 1.45 },
      { name: 'Chelsea', score: 1, odds: 7.50 }
    ],
    drawOdds: 4.20
  }
];

export const mockRacing: BettingMarket[] = [
  {
    id: 'r1',
    name: 'MEYDAN',
    category: 'Race 4 - Group 1 Sprint',
    startTime: new Date('2024-05-01T20:12:00Z'),
    status: MarketStatus.UPCOMING,
    teams: [
      { name: 'Desert Thunder', odds: 3.20 },
      { name: 'Midnight Blue', odds: 4.50 }
    ]
  }
];
