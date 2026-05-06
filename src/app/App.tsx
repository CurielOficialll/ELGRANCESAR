/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header, Footer } from '../shared/components';
import { BettingSlip } from '../features/betting';
import { Home, Dashboard } from '../features/markets';
import { WalletPage } from '../features/wallet';
import { AdminPage } from '../features/admin';
import { BettingMarket, BetSelection, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../infrastructure';
import { useAuth, AuthModal } from '../features/auth';
import { placeBet } from '../features/betting';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading, login, logout, isAuthOpen, setIsAuthOpen } = useAuth();
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [isMobileSlipOpen, setIsMobileSlipOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('overview');


  const handleLogin = async () => {
    login();
  };

  const handleLogout = async () => {
    try {
      await logout();
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

  const handlePlaceBet = async (stake: number, type: 'SINGLE' | 'PARLEY', totalOdds: number) => {
    if (!user) {
      alert('Por favor, inicia sesión para realizar una apuesta');
      return;
    }

    if (user.balance >= stake) {
      try {
        if (type === 'PARLEY') {
          await placeBet(user.uid, {
            type: 'PARLEY',
            selections: selections,
            stake: stake,
            totalOdds: totalOdds
          });
        } else {
          // Individual single bets
          for (const sel of selections) {
            await placeBet(user.uid, {
              type: 'SINGLE',
              selections: [sel],
              stake: stake / selections.length,
              totalOdds: sel.odds
            });
          }
        }
        setSelections([]);
        alert('¡Apuestas realizadas con éxito!');
      } catch (error) {
        console.error('Error al realizar apuesta:', error);
        alert('Error al procesar la apuesta');
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
    <div className="min-h-screen flex flex-col bg-surface-dim selection:bg-secondary selection:text-on-secondary relative overflow-x-hidden pb-24 md:pb-0">
      {/* Background Logo Watermark */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/logo.png" 
          alt="" 
          className="w-[80vw] sm:w-[70vw] max-w-[800px] h-auto opacity-15 object-contain logo-rotate-y"
        />
      </div>



      {currentPage !== 'admin' && (
        <Header 
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onNavigate={setCurrentPage} 
          currentPage={currentPage} 
        />
      )}

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
                {currentPage === 'admin' && (
                  <AdminPage 
                    activeTab={activeAdminTab as any} 
                    onTabChange={(tab) => setActiveAdminTab(tab)} 
                    onExit={() => setCurrentPage('home')}
                  />
                )}
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

      {currentPage !== 'admin' && <Footer />}
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Floating Betting Slip Indicator (Mobile) */}
      <AnimatePresence>
        {selections.length > 0 && !isMobileSlipOpen && currentPage !== 'admin' && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            onClick={() => setIsMobileSlipOpen(true)}
            className="md:hidden fixed bottom-24 right-4 z-40 bg-secondary text-on-secondary w-14 h-14 rounded-full shadow-[0_8px_24px_rgba(233,195,73,0.4)] flex items-center justify-center group active:scale-90 transition-transform"
          >
            <div className="absolute -top-1 -right-1 bg-tertiary text-on-tertiary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-dim shadow-sm">
              {selections.length}
            </div>
            <span className="material-symbols-outlined text-2xl group-active:scale-110 transition-transform">confirmation_number</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Betting Slip Drawer */}
      <AnimatePresence>
        {isMobileSlipOpen && currentPage !== 'admin' && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSlipOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed bottom-0 left-0 w-full max-h-[85vh] bg-surface-container-low z-[70] rounded-t-[32px] overflow-hidden shadow-2xl border-t border-outline-variant/20 flex flex-col"
            >
              <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full mx-auto my-3 shrink-0" />
              <div className="overflow-y-auto px-4 pb-10">
                <BettingSlip 
                  selections={selections} 
                  onRemove={handleRemoveBet} 
                  onPlaceBet={async (stake, type, totalOdds) => {
                    await handlePlaceBet(stake, type, totalOdds);
                    setIsMobileSlipOpen(false);
                  }}
                  user={user}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav - Material 3 Style */}
      <nav className="md:hidden bg-surface-container-low/95 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 border-t border-outline-variant/30 px-2 pb-safe">
        {(currentPage === 'admin' 
          ? [
              { id: 'overview', icon: 'grid_view', label: 'Resumen' },
              { id: 'users', icon: 'group', label: 'Usuarios' },
              { id: 'events', icon: 'calendar_month', label: 'Eventos' },
              { id: 'financials', icon: 'payments', label: 'Finanzas' },
              { id: 'settings', icon: 'settings', label: 'Ajustes' }
            ]
          : [
              { id: 'home', icon: 'home', label: 'Inicio' },
              { id: 'sports', icon: 'sports_soccer', label: 'Deportes' },
              { id: 'racing', icon: 'sports', label: 'Hípica' },
              { id: 'live', icon: 'podcasts', label: 'En Vivo' },
              { id: 'wallet', icon: 'wallet', label: 'Billetera' }
            ]
        ).map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (currentPage === 'admin') {
                setActiveAdminTab(item.id);
              } else {
                setCurrentPage(item.id);
              }
            }}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 group"
          >
            <div className={`relative px-5 py-1 rounded-full transition-all duration-300 ${
              (currentPage === 'admin' ? activeAdminTab === item.id : currentPage === item.id)
                ? 'bg-secondary/20 text-secondary' 
                : 'text-on-surface-variant group-hover:bg-surface-container-highest/50'
            }`}>
              <span className={`material-symbols-outlined text-2xl transition-transform ${
                (currentPage === 'admin' ? activeAdminTab === item.id : currentPage === item.id) ? 'scale-110 icon-fill' : ''
              }`}>
                {item.icon}
              </span>
            </div>
            <span className={`font-sans text-[11px] font-medium mt-1 transition-all ${
              (currentPage === 'admin' ? activeAdminTab === item.id : currentPage === item.id) ? 'text-on-surface font-bold' : 'text-on-surface-variant'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
