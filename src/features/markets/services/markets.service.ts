import {
  db, handleFirestoreError, OperationType,
  collection, query, onSnapshot, addDoc, doc, setDoc,
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
/**
 * Update an existing market or create it if it doesn't exist.
 */
export const upsertMarket = async (market: BettingMarket) => {
  try {
    const { id, ...data } = market;
    const marketRef = doc(marketsCollection, id);
    await setDoc(marketRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'markets');
  }
};
