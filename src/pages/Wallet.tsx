import { Wallet, History, CreditCard, ArrowDown, ArrowUp } from 'lucide-react';
import { UserProfile } from '../types';
import { useBets } from '../hooks/useBets';

interface WalletProps {
  user: UserProfile | null;
  onLogin?: () => void;
}

export default function WalletPage({ user, onLogin }: WalletProps) {
  const { bets, pendingBets, totalPending, loading } = useBets(user?.uid);

  if (!user) {
    return (
      <div className="flex-grow flex items-center justify-center p-20 text-center">
        <div className="flex flex-col items-center">
          <Wallet className="w-20 h-20 mb-6 text-on-surface-variant opacity-20" />
          <h2 className="text-3xl font-lexend font-bold text-on-surface mb-2">Área Exclusiva</h2>
          <p className="text-on-surface-variant mb-10 max-w-sm">Por favor, inicia sesión para acceder a tu billetera y ver tu historial de apuestas premium.</p>
          <button 
            onClick={onLogin}
            className="bg-secondary text-on-secondary font-lexend font-bold px-12 py-4 rounded-xl shadow-xl hover:bg-amber-400 transition-all active:scale-95 cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
      {/* Sidebar Nav */}
      <aside className="hidden md:block col-span-3">
        <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-6 shadow-xl flex flex-col gap-8 sticky top-[120px]">
          <div className="pb-6 border-b border-surface-container-highest flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-2xl">person</span>
            </div>
            <div>
              <h3 className="font-sans font-bold text-on-surface truncate w-32">{user.displayName}</h3>
              <p className="text-on-surface-variant text-sm capitalize">Miembro {user.role === 'ADMIN' ? 'Admin' : 'Estándar'}</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            {[
              { id: 'info', icon: 'person', label: 'Información Personal' },
              { id: 'wallet', icon: 'account_balance_wallet', label: 'Billetera e Historial', active: true },
              { id: 'security', icon: 'security', label: 'Seguridad' },
              { id: 'settings', icon: 'settings', label: 'Preferencias' }
            ].map(item => (
              <button 
                key={item.id}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  item.active 
                    ? 'bg-surface-container-high text-secondary border-l-2 border-secondary shadow-inner' 
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-sans font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="col-span-1 md:col-span-9 flex flex-col gap-10">
        <header>
          <h1 className="font-lexend text-5xl font-black text-on-surface tracking-tight">Billetera e Historial</h1>
          <p className="font-sans text-on-surface-variant mt-3 text-lg">Administra tus fondos y revisa transacciones anteriores.</p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl group-hover:bg-secondary-container/20 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <h2 className="font-mono text-[10px] font-bold text-on-surface-variant uppercase flex items-center gap-2 mb-4 tracking-widest">
                <Wallet className="w-4 h-4" /> Saldo Disponible
              </h2>
              <div className="font-lexend text-6xl font-black text-secondary tracking-tighter">
                ${Math.floor(user.balance).toLocaleString()}<span className="text-3xl text-on-surface-variant ml-1">.{(user.balance % 1).toFixed(2).substring(2)}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-10 relative z-10">
              <button className="flex-1 bg-secondary hover:bg-amber-400 text-on-secondary font-sans font-bold py-4 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all active:scale-95 cursor-pointer">
                <ArrowUp className="w-5 h-5" /> Depositar
              </button>
              <button className="flex-1 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-sans font-bold py-4 rounded-lg border border-outline-variant shadow-sm flex justify-center items-center gap-2 transition-all active:scale-95 cursor-pointer">
                <ArrowDown className="w-5 h-5" /> Retirar
              </button>
            </div>
          </div>

          <div className="grid grid-rows-2 gap-8">
            <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-6 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Saldo de Bono</h3>
                  <p className="font-lexend text-2xl font-bold text-on-surface">$0.00</p>
                </div>
              </div>
              <button className="text-secondary hover:text-amber-400 font-sans font-bold text-sm tracking-tight cursor-pointer">Ver Detalles</button>
            </div>

            <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-6 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">En Juego (Pendiente)</h3>
                  <p className="font-lexend text-2xl font-bold text-on-surface">
                    ${bets.filter(b => b.status === 'PENDING').reduce((acc, b) => acc + b.stake, 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
                {bets.filter(b => b.status === 'PENDING').length} Apuestas Activas
              </span>
            </div>
          </div>
        </div>

        {/* History Table */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <h2 className="font-lexend text-3xl font-bold text-on-surface">Actividad Reciente</h2>
            <div className="flex gap-2">
              <button className="bg-surface-container-highest px-4 py-2 rounded-lg text-sm font-semibold border border-outline-variant hover:border-secondary transition-all cursor-pointer">Todo el Tiempo</button>
            </div>
          </div>

          <div className="bg-surface-container-low border border-surface-container-highest rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-surface-container-highest border-b border-surface-container-highest">
                  <tr>
                    {['Fecha', 'Detalles', 'Monto', 'Cuota', 'Pago', 'Estado'].map(h => (
                      <th key={h} className={`p-4 font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-widest ${h === 'Fecha' ? '' : h === 'Estado' ? 'text-center' : 'text-right'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest">
                  {bets.length > 0 ? bets.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-highest/30 transition-colors group">
                      <td className="p-4 font-mono text-sm text-on-surface-variant whitespace-nowrap">
                        {tx.createdAt?.toDate().toLocaleDateString() || 'Pendiente...'}
                      </td>
                      <td className="p-4">
                        <div className="font-sans font-bold text-on-surface group-hover:text-secondary transition-colors">{tx.marketName}</div>
                        <div className="text-xs text-on-surface-variant">{tx.outcomeName}</div>
                      </td>
                      <td className="p-4 text-right font-mono text-on-surface font-bold">${tx.stake.toFixed(2)}</td>
                      <td className="p-4 text-right font-mono text-secondary font-bold">{tx.odds.toFixed(2)}</td>
                      <td className={`p-4 text-right font-mono font-bold ${tx.status === 'WON' ? 'text-tertiary' : tx.status === 'LOST' ? 'text-error' : 'text-on-surface-variant'}`}>
                        {tx.payout !== null ? (tx.payout > 0 ? `+$${tx.payout.toFixed(2)}` : `-$${Math.abs(tx.payout).toFixed(2)}`) : '--'}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                          tx.status === 'WON' ? 'border-tertiary/30 bg-tertiary/10 text-tertiary' :
                          tx.status === 'LOST' ? 'border-error/30 bg-error/10 text-error' :
                          'border-outline/30 bg-surface-container-highest text-on-surface-variant'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             tx.status === 'WON' ? 'bg-tertiary' :
                             tx.status === 'LOST' ? 'bg-error' :
                             'bg-on-surface-variant'
                          }`}></span> 
                          {tx.status === 'WON' ? 'GANADA' : tx.status === 'LOST' ? 'PERDIDA' : 'PENDIENTE'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-on-surface-variant">No se encontró historial de transacciones.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
