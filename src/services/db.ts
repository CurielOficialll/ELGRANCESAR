import { 
  db, 
  handleFirestoreError, 
  OperationType, 
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  serverTimestamp,
  doc
} from '../lib/firebase';
import { getDoc, runTransaction } from 'firebase/firestore';
import { UserProfile, BettingMarket, Bet } from '../types';

export const usersCollection = collection(db, 'users');
export const marketsCollection = collection(db, 'markets');

/**
 * Get a user profile by UID using direct document read (not query).
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

/**
 * Subscribe to real-time updates on a user profile.
 */
export const syncUserProfile = (uid: string, callback: (profile: UserProfile | null) => void) => {
  const userRef = doc(db, 'users', uid);
  return onSnapshot(userRef, (snap) => {
    if (!snap.exists()) {
      callback(null);
    } else {
      callback(snap.data() as UserProfile);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  });
};

/**
 * Create a new user profile document.
 */
export const createProfile = async (profile: UserProfile) => {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

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
  const q = query(collection(db, 'users', userId, 'bets'));
  return onSnapshot(q, (snap) => {
    const bets = snap.docs.map(d => ({ id: d.id, ...d.data() } as Bet));
    callback(bets);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `users/${userId}/bets`);
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
