/**
 * @deprecated — Use imports from '@/infrastructure' instead.
 * This file exists for backward compatibility with pages not yet migrated.
 */
export { db, auth, googleProvider } from '../infrastructure/firebase/firebase.config';
export { handleFirestoreError, OperationType } from '../infrastructure/firebase/firebase.errors';
export type { FirestoreErrorInfo } from '../infrastructure/firebase/firebase.errors';

export {
  collection,
  query,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from '../infrastructure';
export type { User } from 'firebase/auth';
