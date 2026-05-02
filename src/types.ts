/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Timestamp, FieldValue } from 'firebase/firestore';

/** Firebase Timestamp, Date, or FieldValue (for serverTimestamp) */
type FirebaseTimestamp = Timestamp | Date | FieldValue;

export enum MarketStatus {
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
  SETTLED = 'SETTLED',
  SUSPENDED = 'SUSPENDED',
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  role: 'STANDARD' | 'VIP' | 'ADMIN';
  balance: number;
  cedula?: string;
  phone?: string;
  birthDate?: string;
}

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
  marketId: string;
  marketName: string;
  outcomeName: string;
  stake: number;
  odds: number;
  payout: number | null;
  status: 'WON' | 'PENDING' | 'LOST';
  createdAt: FirebaseTimestamp;
}

export interface BettingMarket {
  id: string;
  name: string;
  category: string;
  startTime: FirebaseTimestamp;
  status: MarketStatus;
  teams: {
    name: string;
    score?: number;
    odds: number;
    logo?: string;
  }[];
  drawOdds?: number;
  liveTime?: string;
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
