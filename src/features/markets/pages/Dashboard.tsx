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
    <main className="flex-grow flex flex-col gap-4 md:gap-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: 'football', label: 'Fútbol', icon: 'sports_soccer', active: true },
          { id: 'basketball', label: 'Basquet', icon: 'sports_basketball' },
          { id: 'tennis', label: 'Tenis', icon: 'sports_tennis' },
          { id: 'racing', label: 'Hípica', icon: 'sports' }
        ].map(cat => (
          <button
            key={cat.id}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer font-mono text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap border ${
              cat.active 
                ? 'bg-secondary text-on-secondary border-secondary shadow-lg shadow-secondary/20' 
                : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-xs md:text-sm">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Live Match */}
      {liveMatches.length > 0 ? (
        <section className="bg-surface-container-low rounded-xl border border-surface-container-highest overflow-hidden relative shadow-xl group">
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-secondary)_0%,_transparent_70%)] transition-opacity group-hover:opacity-20"></div>
          <div className="p-3 md:p-4 relative z-10 flex flex-col gap-2 md:gap-3">
              <div className="flex justify-between items-center">
                  <span className="text-tertiary font-mono text-[8px] md:text-[9px] font-black uppercase flex items-center gap-1.5 animate-pulse">
                      <span className="w-1 h-1 rounded-full bg-tertiary shadow-[0_0_4px_rgba(78,222,163,0.8)]"></span> En Vivo
                  </span>
                  <span className="text-on-surface-variant font-sans text-[9px] md:text-[10px] font-medium uppercase tracking-tighter">{liveMatches[0].category}</span>
              </div>

              <div className="flex justify-between items-center py-0.5 gap-2">
                  <div className="flex flex-col items-center gap-0.5 w-1/3 text-center">
                      <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-surface-container-highest border border-secondary/30 flex items-center justify-center text-on-surface font-lexend font-bold text-[10px] md:text-sm shadow-inner uppercase">
                          {liveMatches[0].teams[0].logo || liveMatches[0].teams[0].name.substring(0, 3)}
                      </div>
                      <span className="font-lexend text-[9px] md:text-sm font-bold text-on-surface truncate w-full">{liveMatches[0].teams[0].name}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center w-1/3">
                      <span className="font-lexend text-lg md:text-4xl font-black text-secondary tracking-tighter drop-shadow-md">
                          {liveMatches[0].teams[0].score} - {liveMatches[0].teams[1].score}
                      </span>
                      <span className="text-on-surface-variant font-mono font-bold text-[8px] md:text-[10px] mt-0">{liveMatches[0].liveTime}</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 w-1/3 text-center transition-all">
                      <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface font-lexend font-bold text-[10px] md:text-sm shadow-inner uppercase">
                          {liveMatches[0].teams[1].logo || liveMatches[0].teams[1].name.substring(0, 3)}
                      </div>
                      <span className="font-lexend text-[9px] md:text-sm font-bold text-on-surface truncate w-full">{liveMatches[0].teams[1].name}</span>
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                  {[
                      { label: '1', team: liveMatches[0].teams[0].name, odds: liveMatches[0].teams[0].odds },
                      { label: 'X', team: 'Empate', odds: liveMatches[0].drawOdds || 3.0 },
                      { label: '2', team: liveMatches[0].teams[1].name, odds: liveMatches[0].teams[1].odds }
                  ].map((outcome) => (
                      <button 
                          key={outcome.label}
                          onClick={() => onSelectBet(liveMatches[0], outcome.team, outcome.odds)}
                          className={`bg-surface-dim border rounded-lg py-1.5 md:py-2 flex flex-col items-center justify-center transition-all group cursor-pointer ${
                              activeBetIds.includes(liveMatches[0].id + outcome.team) ? 'bg-tertiary text-on-tertiary border-tertiary shadow-lg shadow-tertiary/20' : 'border-surface-container-highest hover:border-tertiary'
                          }`}
                      >
                          <span className={`font-mono text-[7px] md:text-[8px] font-bold uppercase tracking-widest mb-0.5 ${activeBetIds.includes(liveMatches[0].id + outcome.team) ? 'text-on-tertiary' : 'text-on-surface-variant group-hover:text-on-tertiary'}`}>
                              {outcome.label}
                          </span>
                          <span className={`font-mono text-sm md:text-base font-black ${activeBetIds.includes(liveMatches[0].id + outcome.team) ? 'text-on-tertiary' : 'text-tertiary group-hover:text-on-tertiary'}`}>
                              {outcome.odds.toFixed(2)}
                          </span>
                      </button>
                  ))}
              </div>
          </div>
        </section>
      ) : (
        <div className="p-10 bg-surface-container rounded-xl border border-surface-container-highest flex flex-col items-center justify-center opacity-50">
            <span className="material-symbols-outlined text-4xl mb-2">sports_football</span>
            <p className="font-lexend text-base">No hay partidos en vivo disponibles</p>
        </div>
      )}

      {/* Upcoming List */}
      <section className="flex flex-col gap-3">
        <h3 className="font-lexend text-lg md:text-xl font-bold text-on-surface px-1 uppercase tracking-tight">Próximos Eventos</h3>
        <div className="flex flex-col gap-1.5 md:gap-2">
            {upcomingMatches.length > 0 ? upcomingMatches.map(match => (
                <div 
                    key={match.id}
                    className="bg-surface-container-low border border-surface-container-highest rounded-lg p-2 md:p-3 flex items-center justify-between hover:border-secondary/30 transition-all cursor-pointer shadow-md group"
                >
                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-tertiary font-mono text-[7px] md:text-[9px] font-black uppercase tracking-wider">{match.category}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-outline-variant"></span>
                          <span className="text-on-surface-variant font-sans text-[8px] md:text-[10px]">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col -gap-1">
                            <span className="font-lexend text-[11px] md:text-base font-bold text-on-surface group-hover:text-secondary transition-colors truncate leading-tight">{match.teams[0].name}</span>
                            <span className="font-lexend text-[11px] md:text-base font-bold text-on-surface transition-colors truncate leading-tight">{match.teams[1].name}</span>
                        </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                       {[
                            { label: '1', team: match.teams[0].name, odds: match.teams[0].odds },
                            { label: 'X', team: 'Empate', odds: match.drawOdds || 3.0 },
                            { label: '2', team: match.teams[1].name, odds: match.teams[1].odds }
                       ].map((outcome) => (
                           <button 
                            key={outcome.label}
                            onClick={(e) => { e.stopPropagation(); onSelectBet(match, outcome.team, outcome.odds); }}
                            className={`w-11 md:w-16 bg-surface-dim border rounded-md py-1 flex flex-col items-center justify-center transition-all group/btn cursor-pointer ${
                                activeBetIds.includes(match.id + outcome.team) 
                                  ? 'bg-tertiary text-on-tertiary border-tertiary shadow-sm shadow-tertiary/30' 
                                  : 'border-surface-container-highest hover:bg-tertiary/10 hover:border-tertiary'
                            }`}
                           >
                               <span className={`font-mono text-[6px] md:text-[8px] font-black uppercase tracking-tighter ${activeBetIds.includes(match.id + outcome.team) ? 'text-on-tertiary' : 'text-on-surface-variant group-hover/btn:text-tertiary'}`}>{outcome.label}</span>
                               <span className={`font-mono text-[11px] md:text-sm font-black ${activeBetIds.includes(match.id + outcome.team) ? 'text-on-tertiary' : 'text-secondary group-hover/btn:text-tertiary'}`}>{outcome.odds.toFixed(2)}</span>
                           </button>
                       ))}
                    </div>
                </div>
            )) : (
              <p className="text-center p-6 text-on-surface-variant border border-dashed border-outline-variant rounded-xl text-sm">No hay próximos eventos listados.</p>
            )}
        </div>
      </section>
    </main>
  );
}
