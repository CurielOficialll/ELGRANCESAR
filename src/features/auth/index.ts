export { AuthModal } from './components/AuthModal';
export { useAuth, AuthProvider } from './context/AuthContext';
export { getUserProfile, syncUserProfile, createProfile } from './services/auth.service';
export type { UserProfile } from './types/auth.types';
