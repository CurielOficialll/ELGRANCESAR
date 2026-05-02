import type { Timestamp, FieldValue } from 'firebase/firestore';

/** Firebase Timestamp, Date, or FieldValue (for serverTimestamp) */
export type FirebaseTimestamp = Timestamp | Date | FieldValue;

export enum MarketStatus {
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
  SETTLED = 'SETTLED',
  SUSPENDED = 'SUSPENDED',
}

export interface TeamInfo {
  name: string;
  score?: number;
  odds: number;
  logo?: string;
}

export interface BettingMarket {
  id: string;
  name: string;
  category: string;
  startTime: FirebaseTimestamp;
  status: MarketStatus;
  teams: TeamInfo[];
  drawOdds?: number;
  liveTime?: string;
}
