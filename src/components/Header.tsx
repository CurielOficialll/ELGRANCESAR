import { Search, Bell, UserCircle, LogIn, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { formatCurrency } from '../shared/utils/currency';
interface HeaderProps {
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ user, onLogin, onLogout, onNavigate, currentPage }: HeaderProps) {
  const navItems = [
    { id: 'sports', label: 'Deportes' },
    { id: 'racing', label: 'Carreras' },
    { id: 'live', label: 'En Vivo' },
    { id: 'promos', label: 'Promos' }
  ];

  return (
    <header className="bg-surface-dim/95 md:bg-slate-950/95 backdrop-blur-md sticky top-0 md:top-0 z-50 border-b border-outline-variant/20 md:border-slate-800 shadow-xl md:shadow-2xl">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-2 md:py-3 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity active:scale-95"
          >
            {/* Logo para celular */}
            <img 
              src="/logo.png" 
              alt="ELGRANCESAR" 
              className="h-8 object-contain logo-rotate-y md:hidden"
            />
            {/* Texto para computadora */}
            <span className="hidden md:block text-2xl font-black text-secondary tracking-tighter font-lexend">
              ELGRANCESAR
            </span>
          </button>
          
          <nav className="hidden md:flex gap-6">
            {currentPage !== 'admin' && navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-lexend uppercase tracking-tight text-sm font-semibold transition-all hover:text-secondary px-2 py-1 rounded cursor-pointer ${
                  currentPage === item.id 
                    ? 'text-tertiary border-b-2 border-tertiary' 
                    : 'text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            {currentPage === 'admin' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                <span className="material-symbols-outlined text-secondary text-sm">shield_person</span>
                <span className="text-secondary font-lexend text-xs font-bold uppercase tracking-wider">Modo Administrativo</span>
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-surface-container rounded px-3 py-1 border border-outline-variant focus-within:border-secondary transition-colors">
            <Search className="text-on-surface-variant w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar eventos..." 
              className="bg-transparent border-none text-on-surface font-sans text-sm focus:ring-0 placeholder:text-on-surface-variant w-48 outline-none" 
            />
          </div>

          {user ? (
            <div className="flex items-center gap-1.5 md:gap-3">
              {currentPage !== 'admin' && (
                <div className="flex flex-col items-end mr-1 md:mr-2 bg-surface-container/50 px-2 md:px-3 py-1 rounded-lg border border-outline-variant/30">
                  <span className="text-[9px] md:text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest hidden md:block leading-none mb-0.5">Saldo</span>
                  <span className="text-secondary font-lexend font-bold text-sm md:text-base whitespace-nowrap leading-none">
                    {formatCurrency(user.balance)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1 md:gap-2">
                <button className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer p-1.5 active:bg-surface-container-highest rounded-full">
                  <Bell className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button 
                  onClick={() => onNavigate('wallet')}
                  className={`transition-colors cursor-pointer p-1.5 active:bg-surface-container-highest rounded-full ${currentPage === 'wallet' ? 'text-tertiary' : 'text-on-surface-variant hover:text-secondary'}`}
                  title="Perfil y Billetera"
                >
                  <UserCircle className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {user.role === 'ADMIN' && (
                  <button 
                    onClick={() => onNavigate('admin')}
                    className={`transition-colors cursor-pointer p-1.5 active:bg-surface-container-highest rounded-full ${currentPage === 'admin' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
                    title="Terminal Admin"
                  >
                    <span className="material-symbols-outlined text-[18px] md:text-[20px]">admin_panel_settings</span>
                  </button>
                )}
                <button 
                  onClick={onLogout}
                  className="text-on-surface-variant hover:text-error transition-colors cursor-pointer p-1.5 active:bg-surface-container-highest rounded-full"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-secondary text-on-secondary font-lexend font-bold text-xs md:text-sm px-4 md:px-6 py-2 rounded-lg hover:bg-amber-400 transition-all flex items-center gap-2 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden xs:inline">Ingresar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
