import type { BettingMarket } from '../types/market.types';

interface MarketCardProps {
  market: BettingMarket;
  onSelect: (market: BettingMarket, outcome: string, odds: number) => void;
}

export function LiveMatchCard({ market, onSelect }: MarketCardProps) {
  return (
    <div className="bg-surface-container-low border border-surface-container-highest rounded-lg overflow-hidden flex flex-col shadow-lg hover:border-secondary/50 transition-all group">
      <div className="bg-surface-container-highest/50 px-3 py-1.5 flex justify-between items-center border-b border-surface-container-highest">
        <span className="font-mono text-[9px] text-on-surface-variant flex items-center gap-1.5 uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-[14px]">sports_soccer</span> {market.category}
        </span>
        <span className="text-tertiary font-mono text-[9px] flex items-center gap-1 font-bold animate-pulse">
          <span className="w-1 h-1 rounded-full bg-tertiary"></span> {market.liveTime}
        </span>
      </div>
      <div className="p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <div className="font-lexend font-bold text-on-surface text-sm truncate pr-2">{market.teams[0].name}</div>
            <div className="font-lexend text-lg font-black text-secondary">{market.teams[0].score}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-lexend font-bold text-on-surface text-sm truncate pr-2">{market.teams[1].name}</div>
            <div className="font-lexend text-lg font-black text-on-surface-variant">{market.teams[1].score}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '1', name: market.teams[0].name, odds: market.teams[0].odds },
            { label: 'X', name: 'Empate', odds: market.drawOdds || 3.0 },
            { label: '2', name: market.teams[1].name, odds: market.teams[1].odds }
          ].map((btn) => (
            <button 
              key={btn.label}
              onClick={() => onSelect(market, btn.name, btn.odds)}
              className="bg-surface-dim border border-surface-container-highest rounded py-1.5 flex flex-col items-center hover:bg-tertiary hover:border-tertiary transition-all group/btn cursor-pointer"
            >
              <span className="font-mono text-[8px] text-on-surface-variant group-hover/btn:text-on-tertiary uppercase font-bold">{btn.label}</span>
              <span className="font-mono text-tertiary font-black text-sm group-hover/btn:text-on-tertiary">{btn.odds.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
