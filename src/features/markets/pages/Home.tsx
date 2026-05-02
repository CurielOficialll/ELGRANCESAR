import { ArrowRight } from 'lucide-react';
import { BettingMarket } from '../types/market.types';
import { LiveMatchCard } from '../components/LiveMatchCard';
import { RacingCard } from '../components/RacingCard';
import { motion } from 'motion/react';
import { mockTrending, mockRacing } from '../data/mock-markets';

interface HomeProps {
  onSelectBet: (market: BettingMarket, outcome: string, odds: number) => void;
  onLogin?: () => void;
}

export default function Home({ onSelectBet, onLogin }: HomeProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full relative h-[480px] sm:h-[550px] md:h-[600px] flex items-center justify-center overflow-hidden border-b border-surface-container-highest">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1440px] w-full px-4 sm:px-6 md:px-8 flex flex-col items-start gap-4 sm:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-surface-container-high/80 backdrop-blur border border-surface-container-highest px-4 py-2 rounded-full shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-widest">CARRERAS EN VIVO</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-lexend text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-on-surface max-w-2xl drop-shadow-2xl leading-none"
          >
            LA CIMA DE LAS APUESTAS <span className="text-secondary">PREMIUM</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-sm sm:text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed"
          >
            Vive el acceso exclusivo a las carreras globales de alto riesgo y los principales mercados deportivos. Cuotas de precisión, seguridad institucional y una ejecución sin rival.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <button 
              onClick={onLogin}
              className="bg-secondary text-on-secondary font-sans font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-lg hover:bg-amber-400 transition-all shadow-[0px_10px_20px_-5px_rgba(233,195,73,0.4)] active:scale-95 cursor-pointer text-sm sm:text-base w-full sm:w-auto"
            >
              Únete a la Élite
            </button>
            <button 
              onClick={onLogin}
              className="bg-surface-container border border-outline-variant text-on-surface font-sans font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-lg hover:border-secondary transition-all active:scale-95 cursor-pointer backdrop-blur-sm text-sm sm:text-base w-full sm:w-auto"
            >
              Acceso Miembros
            </button>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-[1440px] w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
          <div className="flex justify-between items-end border-b border-surface-container-highest pb-4">
            <h2 className="font-lexend text-xl sm:text-2xl md:text-3xl font-bold text-on-surface">Mercados Destacados</h2>
            <button className="font-mono text-[12px] font-bold text-secondary hover:text-amber-400 flex items-center gap-2 uppercase tracking-widest cursor-pointer group">
              VER TODO <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTrending.map(m => (
              <div key={m.id}>
                <LiveMatchCard market={m} onSelect={onSelectBet} />
              </div>
            ))}
            {mockRacing.map(m => (
              <div key={m.id}>
                <RacingCard market={m} onSelect={onSelectBet} />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
          {/* Promo Card */}
          <div className="bg-gradient-to-br from-surface-container to-surface-container-highest border border-secondary/30 rounded-xl p-8 relative overflow-hidden shadow-[0px_10px_20px_-5px_rgba(0,0,0,0.6)] group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors duration-500"></div>
            <div className="relative z-10 flex flex-col items-start gap-4">
              <span className="bg-secondary/20 text-secondary font-mono text-[10px] font-bold px-3 py-1 rounded border border-secondary/50 uppercase tracking-widest">VIP EXCLUSIVO</span>
              <h3 className="font-lexend text-2xl font-bold text-on-surface">Combinadas Mejoradas</h3>
              <p className="font-sans text-on-surface-variant text-sm leading-relaxed">Aumenta tus ganancias en un 15% en todas las apuestas combinadas de hoy.</p>
              <button className="text-secondary font-mono text-[12px] font-bold hover:text-amber-400 transition-colors flex items-center gap-2 mt-4 uppercase tracking-widest cursor-pointer group">
                RECLAMAR AHORA <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-6 flex flex-col gap-4">
            <h3 className="font-lexend text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">tips_and_updates</span>
              Pronósticos con IA
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-surface-dim rounded border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant font-mono uppercase block mb-1">Mejor Valor</span>
                <p className="text-sm">Arsenal vs Chelsea: El valor del "Empate" es alto según las estadísticas defensivas.</p>
              </div>
              <div className="p-3 bg-surface-dim rounded border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant font-mono uppercase block mb-1">Análisis de Pista</span>
                <p className="text-sm">Meydan: El carril interior favorece actualmente a los sprinters veloces.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
