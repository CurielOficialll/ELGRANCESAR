import { useState } from 'react';
import { ReceiptText, X } from 'lucide-react';
import { BetSelection, UserProfile } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../../../shared/utils/currency';

interface BettingSlipProps {
  selections: BetSelection[];
  onRemove: (id: string) => void;
  onPlaceBet: (stake: number, type: 'SINGLE' | 'PARLEY', totalOdds: number) => void;
  user?: UserProfile | null;
}

export default function BettingSlip({ selections, onRemove, onPlaceBet, user }: BettingSlipProps) {
  const [stakeValue, setStakeValue] = useState(50);
  const [betType, setBetType] = useState<'SINGLE' | 'PARLEY'>('SINGLE');

  // Parley only possible with >1 selections
  const actualBetType = selections.length > 1 ? betType : 'SINGLE';
  
  const totalOdds = actualBetType === 'PARLEY' 
    ? selections.reduce((acc, sel) => acc * sel.odds, 1)
    : selections.reduce((acc, sel) => acc + sel.odds, 0) / (selections.length || 1); // Avg odds for singles, not really used for payout sum

  const potentialReturn = actualBetType === 'PARLEY'
    ? stakeValue * totalOdds
    : selections.reduce((acc, sel) => acc + (sel.odds * (stakeValue / selections.length)), 0);

  return (
    <aside className="w-full lg:w-[360px] flex-shrink-0 relative">
      <div className="sticky top-[100px] bg-surface-container-low/90 backdrop-blur-xl border border-surface-container-highest rounded-xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
        <div className="bg-surface-container-highest p-3 border-b border-outline-variant flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="font-lexend text-base text-on-surface flex items-center gap-2">
              <ReceiptText className="text-secondary w-4 h-4" />
              Cupón
            </h2>
            <div className="flex items-center gap-2">
              {selections.length > 0 && (
                <button 
                  onClick={() => selections.forEach(s => onRemove(s.marketId))}
                  className="text-[10px] text-on-surface-variant hover:text-error transition-colors uppercase font-bold tracking-tighter cursor-pointer"
                >
                  Limpiar
                </button>
              )}
              <span className="bg-secondary text-on-secondary font-mono px-2 py-0.5 rounded text-[10px] font-black">
                {selections.length}
              </span>
            </div>
          </div>
          {selections.length > 1 && (
            <div className="flex flex-col gap-2">
              <div className="flex bg-surface-dim rounded-lg p-1 border border-outline-variant shadow-inner">
                <button
                  onClick={() => setBetType('SINGLE')}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-all ${betType === 'SINGLE' ? 'bg-surface-container-highest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Sencillas
                </button>
                <button
                  onClick={() => setBetType('PARLEY')}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-all ${betType === 'PARLEY' ? 'bg-secondary text-on-secondary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Parley
                </button>
              </div>
              <p className="text-[9px] text-on-surface-variant/70 font-medium px-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px] text-tertiary">info</span>
                {betType === 'PARLEY' 
                  ? 'Combina tus jugadas para multiplicar el premio total.' 
                  : 'Apuesta a cada selección de forma independiente.'}
              </p>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-2 min-h-[100px] scrollbar-hide">
          <AnimatePresence initial={false}>
            {selections.length > 0 ? (
              selections.map((sel) => (
                <motion.div
                  key={`${sel.marketId}-${sel.outcomeName}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-container/50 border border-outline-variant/20 p-2.5 rounded-lg relative group/item hover:border-tertiary/30 transition-all"
                >
                  <button
                    onClick={() => onRemove(sel.marketId)}
                    className="absolute top-2 right-2 text-on-surface-variant hover:text-error transition-colors p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="pr-6">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-lexend font-bold text-xs text-on-surface">{sel.outcomeName}</span>
                      <span className="font-mono text-tertiary font-black text-sm">{sel.odds.toFixed(2)}</span>
                    </div>
                    <span className="text-on-surface-variant font-sans text-[10px] block truncate opacity-80">{sel.matchup}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 opacity-30">
                <ReceiptText className="w-10 h-10 mb-3" />
                <p className="text-xs font-medium uppercase tracking-widest">Cupón Vacío</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {selections.length > 0 && (
          <div className="p-3 bg-surface-container-lowest border-t border-surface-container-highest mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
            {actualBetType === 'PARLEY' && (
               <div className="flex justify-between items-center mb-3 px-1">
                <span className="text-on-surface-variant font-mono text-[10px] font-bold uppercase tracking-widest">Cuota Total</span>
                <span className="font-mono text-tertiary font-black text-base">{totalOdds.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between mb-3 bg-surface-dim border border-outline-variant/50 rounded-lg p-2 focus-within:border-secondary transition-all shadow-inner">
              <span className="text-on-surface-variant font-mono text-xs px-1 opacity-60">Bs.</span>
              <input 
                type="number" 
                value={stakeValue}
                onChange={(e) => setStakeValue(Math.max(0, Number(e.target.value)))}
                min={1}
                className="bg-transparent border-none outline-none text-right text-on-surface font-lexend font-black text-lg w-full focus:ring-0 p-0" 
              />
            </div>
            
            <div className="flex flex-col gap-1 mb-4 px-1">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-sans text-[10px] uppercase font-bold tracking-wider">Pago Potencial</span>
                <span className="font-mono text-secondary font-black text-lg">{formatCurrency(potentialReturn)}</span>
              </div>
            </div>

            <button 
              onClick={() => onPlaceBet(stakeValue, actualBetType, totalOdds)}
              disabled={stakeValue <= 0}
              className={`w-full font-lexend font-black text-sm py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg ${
                user 
                  ? 'bg-secondary text-on-secondary hover:bg-amber-400 shadow-secondary/20' 
                  : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant cursor-not-allowed'
              }`}
            >
              {user ? 'APOSTAR AHORA' : 'INICIA SESIÓN'}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
