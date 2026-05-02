import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, onAuthStateChanged, signOut } from '../../../infrastructure';
import { getUserProfile, createProfile, syncUserProfile } from '../services/auth.service';
import { UserProfile } from '../types/auth.types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            role: 'STANDARD',
            balance: 1000
          };
          await createProfile(newProfile);
          setUser(newProfile);
        } else {
          setUser(profile);
        }

        const syncUnsub = syncUserProfile(firebaseUser.uid, (updatedProfile) => {
          setUser(updatedProfile);
        });

        setLoading(false);
        return () => syncUnsub();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = () => setIsAuthOpen(true);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAdmin: user?.role === 'ADMIN',
      isAuthOpen,
      setIsAuthOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
