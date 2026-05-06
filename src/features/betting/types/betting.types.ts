import type { FirebaseTimestamp } from '../../markets/types/market.types';

export interface BetSelection {
  marketId: string;
  marketName: string;
  outcomeName: string;
  odds: number;
  matchup: string;
}

export interface Bet {
  id?: string;
  userId: string;
  type: 'SINGLE' | 'PARLEY';
  selections: BetSelection[];
  stake: number;
  totalOdds: number;
  payout: number | null;
  status: 'WON' | 'PENDING' | 'LOST';
  createdAt: FirebaseTimestamp;
}

export interface Transaction {
  id: string;
  date: string;
  event: string;
  details: string;
  stake: number;
  odds: number;
  payout: number | null;
  status: 'WON' | 'PENDING' | 'LOST';
}
