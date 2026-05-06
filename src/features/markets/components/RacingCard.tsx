import type { BettingMarket } from '../types/market.types';

interface MarketCardProps {
  market: BettingMarket;
  onSelect: (market: BettingMarket, outcome: string, odds: number) => void;
}

export function RacingCard({ market, onSelect }: MarketCardProps) {
  return (
    <div className="bg-surface-container-low border border-surface-container-highest rounded-lg overflow-hidden flex flex-col shadow-lg hover:border-secondary/50 transition-all group">
      <div className="bg-surface-container-highest/50 px-3 py-1.5 flex justify-between items-center border-b border-surface-container-highest">
        <span className="font-mono text-[9px] text-on-surface-variant flex items-center gap-1.5 uppercase tracking-widest font-bold">
          <span className="material-symbols-outlined text-[14px]">flag</span> {market.name}
        </span>
        <span className="text-secondary font-mono text-[9px] font-bold">Inicia en 12m</span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="font-lexend font-bold text-on-surface text-sm uppercase tracking-tight">{market.category}</div>
        
        <div className="flex flex-col gap-1.5">
          {market.teams.map((runner, idx) => (
            <div key={runner.name} className="flex justify-between items-center p-2 bg-surface-dim rounded border border-surface-container-highest/30 hover:border-tertiary/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-surface-container-highest flex items-center justify-center font-mono text-[10px] text-on-surface border border-outline-variant font-black">
                  {idx + 1}
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-on-surface text-sm">{runner.name}</span>
                  <span className="font-mono text-[8px] text-on-surface-variant uppercase font-bold">J: W. Buick</span>
                </div>
              </div>
              <button 
                onClick={() => onSelect(market, runner.name, runner.odds)}
                className="bg-surface-container-high border border-outline-variant rounded px-4 py-1 hover:bg-tertiary hover:border-tertiary transition-all font-mono text-tertiary font-black text-sm cursor-pointer group/btn"
              >
                <span className="group-hover/btn:text-on-tertiary">{runner.odds.toFixed(2)}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
