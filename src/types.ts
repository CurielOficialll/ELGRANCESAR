/**
 * Central type re-exports for backward compatibility.
 * Prefer importing directly from feature types in new code.
 */
export type { UserProfile } from './features/auth/types/auth.types';
export type { BettingMarket, TeamInfo, FirebaseTimestamp } from './features/markets/types/market.types';
export { MarketStatus } from './features/markets/types/market.types';
export type { Bet, BetSelection, Transaction } from './features/betting/types/betting.types';
