import {
  db, handleFirestoreError, OperationType,
  onSnapshot, setDoc, serverTimestamp, doc, getDoc,
} from '../../../infrastructure';
import type { UserProfile } from '../types/auth.types';

/**
 * Get a user profile by UID.
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
