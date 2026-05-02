import {
  db, handleFirestoreError, OperationType,
  collection, onSnapshot, serverTimestamp, doc, runTransaction,
} from '../../../infrastructure';
import type { Bet } from '../types/betting.types';

/**
 * Place a bet using an atomic Firestore transaction.
 * Prevents race conditions on balance by reading and writing in a single transaction.
 */
export const placeBet = async (userId: string, bet: Omit<Bet, 'userId' | 'createdAt' | 'status' | 'payout'>) => {
  const path = `users/${userId}/bets`;
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Read current balance atomically
      const userRef = doc(db, 'users', userId);
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        throw new Error('Usuario no encontrado');
      }

      const currentBalance = userSnap.data().balance as number;

      if (currentBalance < bet.stake) {
        throw new Error('Saldo insuficiente');
      }

      // 2. Create the bet document
      const betRef = doc(collection(db, 'users', userId, 'bets'));
      const betData: Bet = {
        ...bet,
        userId,
        status: 'PENDING',
        payout: null,
        createdAt: serverTimestamp()
      };
      transaction.set(betRef, betData);

      // 3. Deduct stake from balance atomically
      transaction.update(userRef, {
        balance: currentBalance - bet.stake
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

/**
 * Subscribe to a user's bet history in real-time.
 */
export const getBets = (userId: string, callback: (bets: Bet[]) => void) => {
  const q = collection(db, 'users', userId, 'bets');
  return onSnapshot(q, (snap) => {
    const bets = snap.docs.map(d => ({ id: d.id, ...d.data() } as Bet));
    callback(bets);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `users/${userId}/bets`);
  });
};

/**
 * Settle a bet using an atomic Firestore transaction.
 * If the bet is WON, the payout is credited to the user's balance atomically.
 */
export const settleBet = async (userId: string, betId: string, status: 'WON' | 'LOST', payout: number) => {
  try {
    await runTransaction(db, async (transaction) => {
      const betRef = doc(db, 'users', userId, 'bets', betId);
      const userRef = doc(db, 'users', userId);

      // Read bet to ensure it exists and is still PENDING
      const betSnap = await transaction.get(betRef);
      if (!betSnap.exists()) {
        throw new Error('Apuesta no encontrada');
      }
      if (betSnap.data().status !== 'PENDING') {
        throw new Error('La apuesta ya fue liquidada');
      }

      // Update bet status
      transaction.update(betRef, { status, payout });

      // If WON, credit payout to user balance atomically
      if (status === 'WON') {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) {
          throw new Error('Usuario no encontrado');
        }
        const currentBalance = userSnap.data().balance as number;
        transaction.update(userRef, {
          balance: currentBalance + payout
        });
      }
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/bets/${betId}`);
  }
};
