import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { UserProfile } from '@/types';
import { useBets } from '@/features/betting/hooks/useBets';

import { WalletDashboard } from '../components/WalletDashboard';
import { PersonalInfo } from '../components/PersonalInfo';
import { SecuritySettings } from '../components/SecuritySettings';
import { PreferencesSettings } from '../components/PreferencesSettings';

interface WalletProps {
  user: UserProfile | null;
  onLogin?: () => void;
}

export default function WalletPage({ user, onLogin }: WalletProps) {
  const { bets, pendingBets, totalPending, loading } = useBets(user?.uid);
  const [activeTab, setActiveTab] = useState<'info' | 'wallet' | 'security' | 'settings'>('wallet');

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
              { id: 'wallet', icon: 'account_balance_wallet', label: 'Billetera e Historial' },
              { id: 'security', icon: 'security', label: 'Seguridad' },
              { id: 'settings', icon: 'settings', label: 'Preferencias' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === item.id 
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
        {activeTab === 'wallet' && <WalletDashboard user={user} bets={bets} />}
        {activeTab === 'info' && <PersonalInfo user={user} />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'settings' && <PreferencesSettings />}
      </div>
    </main>
  );
}
