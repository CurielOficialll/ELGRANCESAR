/**
 * @deprecated — Use imports from feature services instead.
 * e.g. import { getUserProfile } from '@/features/auth';
 */
export { getUserProfile, syncUserProfile, createProfile } from '../features/auth/services/auth.service';
export { getMarkets, createMarket } from '../features/markets/services/markets.service';
export { placeBet, getBets, settleBet } from '../features/betting/services/bets.service';
