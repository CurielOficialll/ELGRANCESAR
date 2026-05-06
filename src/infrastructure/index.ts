/**
 * Infrastructure barrel file.
 * Central re-exports for Firebase SDK and utilities.
 */
export { db, auth, googleProvider } from './firebase/firebase.config';
export { handleFirestoreError, OperationType } from './firebase/firebase.errors';
export type { FirestoreErrorInfo } from './firebase/firebase.errors';

// Firebase Auth re-exports
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
export type { User } from 'firebase/auth';

// Firestore re-exports
export {
  collection,
  query,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  where,
  orderBy,
  limit,
  collectionGroup,
  runTransaction,
} from 'firebase/firestore';
