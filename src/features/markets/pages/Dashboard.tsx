import { BettingMarket, MarketStatus } from '../types/market.types';
import { motion } from 'motion/react';
import { useMarkets } from '../hooks/useMarkets';

interface DashboardProps {
    onSelectBet: (market: BettingMarket, outcome: string, odds: number) => void;
    activeBetIds: string[];
}

export default function Dashboard({ onSelectBet, activeBetIds }: DashboardProps) {
  const { liveMatches, upcomingMatches, loading } = useMarkets();

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col gap-10">
      {/* Category Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2 border-b border-surface-container-highest scrollbar-hide">
        {[
          { id: 'football', label: 'Fútbol', icon: 'sports_soccer', active: true },
          { id: 'basketball', label: 'Baloncesto', icon: 'sports_basketball' },
          { id: 'tennis', label: 'Tenis', icon: 'sports_tennis' },
          { id: 'racing', label: 'Carreras', icon: 'sports' }
        ].map(cat => (
          <button
            key={cat.id}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all cursor-pointer font-mono text-[11px] font-bold uppercase tracking-widest ${
              cat.active 
                ? 'bg-surface-container-highest border-b-2 border-tertiary text-tertiary' 
                : 'hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Live Match */}
      {liveMatches.length > 0 ? (
        <section className="bg-surface-container-low rounded-xl border border-surface-container-highest overflow-hidden relative shadow-2xl group">
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-secondary)_0%,_transparent_70%)] transition-opacity group-hover:opacity-20"></div>
          <div className="p-10 relative z-10 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                  <span className="text-tertiary font-mono text-xs font-black uppercase flex items-center gap-2 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span> En Vivo
                  </span>
                  <span className="text-on-surface-variant font-sans text-sm font-medium">{liveMatches[0].category}</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-8 md:gap-0">
                  <div className="flex flex-col items-center gap-4 w-full md:w-1/3 text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container-highest border-2 border-secondary flex items-center justify-center text-on-surface font-lexend font-bold text-xl shadow-inner uppercase">
                          {liveMatches[0].teams[0].logo || liveMatches[0].teams[0].name.substring(0, 3)}
                      </div>
                      <span className="font-lexend text-xl md:text-2xl font-bold text-on-surface truncate w-full">{liveMatches[0].teams[0].name}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                      <span className="font-lexend text-5xl md:text-7xl font-black text-secondary tracking-tighter drop-shadow-lg">
                          {liveMatches[0].teams[0].score} - {liveMatches[0].teams[1].score}
                      </span>
                      <span className="text-on-surface-variant font-mono font-bold text-base md:text-lg mt-2">{liveMatches[0].liveTime}</span>
                  </div>

                  <div className="flex flex-col items-center gap-4 w-full md:w-1/3 text-center transition-all">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center text-on-surface font-lexend font-bold text-xl shadow-inner uppercase">
                          {liveMatches[0].teams[1].logo || liveMatches[0].teams[1].name.substring(0, 3)}
                      </div>
                      <span className="font-lexend text-xl md:text-2xl font-bold text-on-surface truncate w-full">{liveMatches[0].teams[1].name}</span>
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                  {[
                      { label: '1', team: liveMatches[0].teams[0].name, odds: liveMatches[0].teams[0].odds },
                      { label: 'X', team: 'Empate', odds: liveMatches[0].drawOdds || 3.0 },
                      { label: '2', team: liveMatches[0].teams[1].name, odds: liveMatches[0].teams[1].odds }
                  ].map((outcome) => (
                      <button 
                          key={outcome.label}
                          onClick={() => onSelectBet(liveMatches[0], outcome.team, outcome.odds)}
                          className={`bg-surface-dim border hover:bg-tertiary rounded-xl p-4 flex flex-col items-center justify-center transition-all group cursor-pointer ${
                              activeBetIds.includes(liveMatches[0].id + outcome.team) ? 'bg-tertiary text-on-tertiary border-tertiary' : 'border-surface-container-highest hover:border-tertiary'
                          }`}
                      >
                          <span className={`font-mono text-[10px] font-bold uppercase tracking-widest mb-1 ${activeBetIds.includes(liveMatches[0].id + outcome.team) ? 'text-on-tertiary' : 'text-on-surface-variant group-hover:text-on-tertiary'}`}>
                              {outcome.label}
                          </span>
                          <span className={`font-mono text-2xl font-black ${activeBetIds.includes(liveMatches[0].id + outcome.team) ? 'text-on-tertiary' : 'text-tertiary group-hover:text-on-tertiary'}`}>
                              {outcome.odds.toFixed(2)}
                          </span>
                      </button>
                  ))}
              </div>
          </div>
        </section>
      ) : (
        <div className="p-20 bg-surface-container rounded-xl border border-surface-container-highest flex flex-col items-center justify-center opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4">sports_football</span>
            <p className="font-lexend text-xl">No hay partidos en vivo disponibles</p>
        </div>
      )}

      {/* Upcoming List */}
      <section className="flex flex-col gap-6">
        <h3 className="font-lexend text-3xl font-bold text-on-surface px-1">Próximos Eventos</h3>
        <div className="flex flex-col gap-4">
            {upcomingMatches.length > 0 ? upcomingMatches.map(match => (
                <div 
                    key={match.id}
                    className="bg-surface-container-low border border-surface-container-highest rounded-xl p-6 flex flex-col md:flex-row items-center justify-between hover:border-secondary/50 transition-all cursor-pointer shadow-lg group"
                >
                    <div className="flex flex-col w-full md:w-1/2 mb-6 md:mb-0">
                        <span className="text-on-surface-variant font-mono text-[10px] font-black uppercase tracking-widest mb-3">{match.category}</span>
                        <div className="flex flex-col gap-2">
                            <span className="font-lexend text-xl font-bold text-on-surface group-hover:text-secondary transition-colors">{match.teams[0].name}</span>
                            <span className="font-lexend text-xl font-bold text-on-surface transition-colors">{match.teams[1].name}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-1/2 justify-end">
                        <div className="flex gap-2">
                           {[
                                { label: '1', team: match.teams[0].name, odds: match.teams[0].odds },
                                { label: 'X', team: 'Empate', odds: match.drawOdds || 3.0 },
                                { label: '2', team: match.teams[1].name, odds: match.teams[1].odds }
                           ].map((outcome) => (
                               <button 
                                key={outcome.label}
                                onClick={(e) => { e.stopPropagation(); onSelectBet(match, outcome.team, outcome.odds); }}
                                className={`w-20 bg-surface-dim border rounded-lg py-2 flex flex-col items-center justify-center transition-all group/btn cursor-pointer ${
                                    activeBetIds.includes(match.id + outcome.team) ? 'bg-tertiary text-on-tertiary border-tertiary' : 'border-surface-container-highest hover:bg-tertiary hover:border-tertiary'
                                }`}
                               >
                                   <span className={`font-mono text-[10px] font-bold ${activeBetIds.includes(match.id + outcome.team) ? 'text-on-tertiary' : 'text-on-surface-variant group-hover/btn:text-on-tertiary'}`}>{outcome.label}</span>
                                   <span className={`font-mono text-[14px] font-black ${activeBetIds.includes(match.id + outcome.team) ? 'text-on-tertiary' : 'text-tertiary group-hover/btn:text-on-tertiary'}`}>{outcome.odds.toFixed(2)}</span>
                               </button>
                           ))}
                        </div>
                    </div>
                </div>
            )) : (
              <p className="text-center p-10 text-on-surface-variant border border-dashed border-outline-variant rounded-xl">No hay próximos eventos listados.</p>
            )}
        </div>
      </section>
    </main>
  );
}
