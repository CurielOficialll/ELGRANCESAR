/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BettingSlip from './components/BettingSlip';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/Wallet';
import AdminPage from './pages/Admin';
import { BettingMarket, BetSelection, UserProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { auth, onAuthStateChanged, signOut } from './lib/firebase';
import { getUserProfile, createProfile, syncUserProfile, placeBet } from './services/db';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if profile exists
        const profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            role: 'STANDARD',
            balance: 1000 // Initial bonus balance for demo
          };
          await createProfile(newProfile);
          setUser(newProfile);
        } else {
          setUser(profile);
        }

        // Sync profile changes (balance, etc)
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

  const handleLogin = async () => {
    setIsAuthOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSelectBet = (market: BettingMarket, outcomeName: string, odds: number) => {
    const selectionId = market.id + outcomeName;
    if (selections.find(s => s.marketId + s.outcomeName === selectionId)) {
      setSelections(prev => prev.filter(s => s.marketId + s.outcomeName !== selectionId));
    } else {
      const newSelection: BetSelection = {
        marketId: market.id,
        marketName: market.name,
        outcomeName,
        odds,
        matchup: market.status === 'LIVE' ? `${market.teams[0].name} vs ${market.teams[1].name}` : market.name
      };
      setSelections(prev => [...prev, newSelection]);
    }
  };

  const handleRemoveBet = (marketId: string) => {
    setSelections(prev => prev.filter(s => s.marketId !== marketId));
  };

  const handlePlaceBet = async (stake: number) => {
    if (!user) {
      alert('Por favor, inicia sesión para realizar una apuesta');
      return;
    }

    if (user.balance >= stake) {
      try {
        // Build and place bets (simplified here as one bet per selection)
        for (const sel of selections) {
          await placeBet(user.uid, {
            marketId: sel.marketId,
            marketName: sel.marketName,
            outcomeName: sel.outcomeName,
            stake: stake / selections.length,
            odds: sel.odds
          });
        }
        setSelections([]);
        alert('¡Apuestas realizadas con éxito!');
      } catch (error) {
        console.error('Error al realizar apuesta:', error);
      }
    } else {
      alert('Saldo insuficiente');
    }
  };

  useEffect(() => {
    document.body.classList.add('mobile-native-shell');
    return () => {
      document.body.classList.remove('mobile-native-shell');
    };
  }, []);

  const activeBetIds = selections.map(s => s.marketId + s.outcomeName);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dim flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-dim selection:bg-secondary selection:text-on-secondary relative overflow-x-hidden pb-16 md:pb-0">
      {/* Background Logo Watermark */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/logo.png" 
          alt="" 
          className="w-[80vw] sm:w-[70vw] max-w-[800px] h-auto opacity-15 object-contain logo-rotate-y"
        />
      </div>



      <Header 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
      />

      <div className="flex-grow flex justify-center w-full">
        <div className={`w-full flex ${currentPage === 'admin' ? '' : 'max-w-[1440px] px-4 md:px-8 py-10'} gap-10`}>
          <main className="flex-grow flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {currentPage === 'home' && <Home onSelectBet={handleSelectBet} onLogin={handleLogin} />}
                {currentPage === 'sports' && <Dashboard onSelectBet={handleSelectBet} activeBetIds={activeBetIds} />}
                {currentPage === 'live' && <Dashboard onSelectBet={handleSelectBet} activeBetIds={activeBetIds} />}
                {currentPage === 'racing' && <Home onSelectBet={handleSelectBet} onLogin={handleLogin} />}
                {currentPage === 'wallet' && <WalletPage user={user} onLogin={handleLogin} />}
                {currentPage === 'admin' && <AdminPage />}
              </motion.div>
            </AnimatePresence>
          </main>

          {['home', 'sports', 'live', 'racing'].includes(currentPage) && (
            <div className="hidden lg:block">
              <BettingSlip 
                selections={selections} 
                onRemove={handleRemoveBet} 
                onPlaceBet={handlePlaceBet}
                user={user}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Mobile Bottom Nav - Material 3 Style */}
      <nav className="md:hidden bg-surface-container-low/95 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 border-t border-outline-variant/30 px-2 pb-safe">
        {[
          { id: 'home', icon: 'home', label: 'Inicio' },
          { id: 'sports', icon: 'sports_soccer', label: 'Deportes' },
          { id: 'racing', icon: 'sports', label: 'Hípica' },
          { id: 'live', icon: 'podcasts', label: 'En Vivo' },
          { id: 'wallet', icon: 'wallet', label: 'Billetera' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 group"
          >
            <div className={`relative px-5 py-1 rounded-full transition-all duration-300 ${
              currentPage === item.id 
                ? 'bg-secondary/20 text-secondary' 
                : 'text-on-surface-variant group-hover:bg-surface-container-highest/50'
            }`}>
              <span className={`material-symbols-outlined text-2xl transition-transform ${
                currentPage === item.id ? 'scale-110 icon-fill' : ''
              }`}>
                {item.icon}
              </span>
            </div>
            <span className={`font-sans text-[11px] font-medium mt-1 transition-all ${
              currentPage === item.id ? 'text-on-surface font-bold' : 'text-on-surface-variant'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

