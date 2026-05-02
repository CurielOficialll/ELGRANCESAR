import type { BettingMarket } from '../types/market.types';

interface MarketCardProps {
  market: BettingMarket;
  onSelect: (market: BettingMarket, outcome: string, odds: number) => void;
}

export function LiveMatchCard({ market, onSelect }: MarketCardProps) {
  return (
    <div className="bg-surface-container border border-surface-container-highest rounded-xl overflow-hidden flex flex-col shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.5)]">
      <div className="bg-surface-container-highest px-4 py-2 flex justify-between items-center border-b border-surface-container-highest">
        <span className="font-mono text-[12px] text-on-surface-variant flex items-center gap-2 uppercase tracking-wider font-bold">
          <span className="material-symbols-outlined text-[16px]">sports_soccer</span> {market.category}
        </span>
        <span className="text-tertiary font-mono text-[12px] flex items-center gap-1 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> {market.liveTime}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="font-sans font-bold text-on-surface text-lg">{market.teams[0].name}</div>
          <div className="font-lexend text-2xl text-secondary">{market.teams[0].score}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="font-sans font-bold text-on-surface text-lg">{market.teams[1].name}</div>
          <div className="font-lexend text-2xl text-on-surface-variant">{market.teams[1].score}</div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-2">
          <button 
            onClick={() => onSelect(market, market.teams[0].name, market.teams[0].odds)}
            className="bg-surface border border-surface-container-highest rounded-lg py-3 flex flex-col items-center hover:bg-surface-bright hover:border-secondary transition-all group cursor-pointer"
          >
            <span className="font-mono text-[10px] text-on-surface-variant group-hover:text-on-surface uppercase font-bold">1</span>
            <span className="font-mono text-tertiary font-bold text-lg group-hover:text-secondary">{market.teams[0].odds.toFixed(2)}</span>
          </button>
          <button 
            onClick={() => onSelect(market, 'Empate', market.drawOdds || 3.0)}
            className="bg-surface border border-surface-container-highest rounded-lg py-3 flex flex-col items-center hover:bg-surface-bright hover:border-secondary transition-all group cursor-pointer"
          >
            <span className="font-mono text-[10px] text-on-surface-variant group-hover:text-on-surface uppercase font-bold">X</span>
            <span className="font-mono text-tertiary font-bold text-lg group-hover:text-secondary">{(market.drawOdds || 3.0).toFixed(2)}</span>
          </button>
          <button 
            onClick={() => onSelect(market, market.teams[1].name, market.teams[1].odds)}
            className="bg-surface border border-surface-container-highest rounded-lg py-3 flex flex-col items-center hover:bg-surface-bright hover:border-secondary transition-all group cursor-pointer"
          >
            <span className="font-mono text-[10px] text-on-surface-variant group-hover:text-on-surface uppercase font-bold">2</span>
            <span className="font-mono text-tertiary font-bold text-lg group-hover:text-secondary">{market.teams[1].odds.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
