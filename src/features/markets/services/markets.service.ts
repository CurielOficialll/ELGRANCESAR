import {
  db, handleFirestoreError, OperationType,
  collection, query, onSnapshot, addDoc,
} from '../../../infrastructure';
import type { BettingMarket } from '../types/market.types';

const marketsCollection = collection(db, 'markets');

/**
 * Subscribe to real-time market updates.
 */
export const getMarkets = (callback: (markets: BettingMarket[]) => void) => {
  const q = query(marketsCollection);
  return onSnapshot(q, (snap) => {
    const markets = snap.docs.map(d => ({ id: d.id, ...d.data() } as BettingMarket));
    callback(markets);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'markets');
  });
};

/**
 * Create a new betting market (admin only).
 */
export const createMarket = async (market: Omit<BettingMarket, 'id'>) => {
  try {
    await addDoc(marketsCollection, market);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'markets');
  }
};
