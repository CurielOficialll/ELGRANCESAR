import { useState } from 'react';
import { ReceiptText, X } from 'lucide-react';
import { BetSelection, UserProfile } from '../../../types';
import { motion, AnimatePresence } from 'motion/react';

interface BettingSlipProps {
  selections: BetSelection[];
  onRemove: (id: string) => void;
  onPlaceBet: (stake: number) => void;
  user?: UserProfile | null;
}

export default function BettingSlip({ selections, onRemove, onPlaceBet, user }: BettingSlipProps) {
  const [stakeValue, setStakeValue] = useState(50);
  const potentialReturn = selections.reduce((acc, sel) => acc + (sel.odds * stakeValue), 0);

  return (
    <aside className="w-full lg:w-[360px] flex-shrink-0 relative">
      <div className="sticky top-[100px] bg-surface-container-low/90 backdrop-blur-xl border border-surface-container-highest rounded-xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
        <div className="bg-surface-container-highest p-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-lexend text-lg text-on-surface flex items-center gap-3">
            <ReceiptText className="text-secondary w-5 h-5" />
            Cupón de Apuestas
          </h2>
          <span className="bg-secondary text-on-secondary font-mono px-2 py-1 rounded-full text-[10px] font-bold">
            {selections.length} Selección{selections.length !== 1 ? 'es' : ''}
          </span>
        </div>

        <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 min-h-[100px]">
          <AnimatePresence initial={false}>
            {selections.length > 0 ? (
              selections.map((sel) => (
                <motion.div
                  key={`${sel.marketId}-${sel.outcomeName}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-surface-dim border-l-2 border-tertiary p-3 rounded relative"
                >
                  <button
                    onClick={() => onRemove(sel.marketId)}
                    className="absolute top-2 right-2 text-on-surface-variant hover:text-error transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="pr-8">
                    <span className="font-sans font-bold text-sm text-on-surface block">{sel.outcomeName}</span>
                    <span className="text-on-surface-variant font-sans text-xs block mb-1">Apuesta de Partido (1X2)</span>
                    <span className="text-on-surface-variant font-sans text-xs block mb-2">{sel.matchup}</span>
                    <div className="flex justify-between items-center mt-2">
                       <span className="font-mono text-tertiary font-bold">{sel.odds.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 opacity-50">
                <ReceiptText className="w-12 h-12 mb-4 text-outline-variant" />
                <h3 className="font-sans font-bold text-on-surface mb-2">Cupón Vacío</h3>
                <p className="text-on-surface-variant text-sm">Selecciona cuotas del terminal para armar tu apuesta.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {selections.length > 0 && (
          <div className="p-4 bg-surface-container-lowest border-t border-surface-container-highest mt-auto">
            <div className="flex items-center justify-between mb-3 bg-surface-dim border border-outline-variant rounded p-3 focus-within:border-secondary transition-colors">
              <span className="text-on-surface-variant font-mono">$</span>
              <input 
                type="number" 
                value={stakeValue}
                onChange={(e) => setStakeValue(Math.max(0, Number(e.target.value)))}
                min={1}
                className="bg-transparent border-none outline-none text-right text-on-surface font-sans font-bold w-full focus:ring-0" 
              />
            </div>
            
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-on-surface-variant font-sans text-sm">Ganancia Potencial:</span>
              <span className="font-mono text-secondary font-bold">${potentialReturn.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => onPlaceBet(stakeValue)}
              disabled={stakeValue <= 0}
              className="w-full bg-secondary text-on-secondary font-lexend font-bold text-lg py-4 rounded-lg shadow-[0px_4px_10px_rgba(212,175,55,0.3)] hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {user ? 'Realizar Apuesta' : 'Inicia sesión para Apostar'}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
