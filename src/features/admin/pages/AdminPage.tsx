import { Users, Calendar, BarChart3, Wallet as Financials, Settings, Plus, LayoutGrid, TrendingUp, TrendingDown, Search, Filter, Menu, X, ShieldCheck, LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createMarket, getMarkets, upsertMarket } from '../../markets/services/markets.service';
import { sportsDataService } from '../../markets/services/sportsData.service';
import { BettingMarket, MarketStatus } from '../../markets/types/market.types';
import { useAuth } from '../../auth';
import { adminService } from '../services/admin.service';
import { AdminLog, AdminStats, SystemConfig } from '../types/admin.types';
import { collection, onSnapshot, db, query, orderBy, limit } from '../../../infrastructure';
import { UserProfile } from '../../../types';
import { formatCurrency } from '../../../shared/utils/currency';

type AdminTab = 'overview' | 'users' | 'events' | 'financials' | 'settings';

interface AdminPageProps {
  activeTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  onExit?: () => void;
}

export default function AdminPage({ activeTab: propActiveTab, onTabChange, onExit }: AdminPageProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<AdminTab>('overview');
  const activeTab = propActiveTab || internalActiveTab;
  
  const setActiveTab = (tab: AdminTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const navItems = [
    { id: 'overview', icon: LayoutGrid, label: 'Resumen' },
    { id: 'users', icon: Users, label: 'Usuarios' },
    { id: 'events', icon: Calendar, label: 'Eventos' },
    { id: 'financials', icon: Financials, label: 'Finanzas' },
    { id: 'settings', icon: Settings, label: 'Ajustes' }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface-container-lowest overflow-hidden">
      <div className="p-8 border-b border-outline-variant flex items-center justify-center gap-4 flex-col relative bg-surface-container-highest/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
        <div className="w-20 h-20 rounded-2xl bg-surface-dim border-2 border-secondary/30 flex items-center justify-center shadow-[0_0_30px_rgba(233,195,73,0.15)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
           <ShieldCheck size={40} className="text-secondary" />
        </div>
        <div className="text-center mt-2">
          <h2 className="font-lexend font-black text-on-surface text-lg uppercase tracking-tighter leading-none mb-1">
            ELGRANCESAR <span className="text-secondary">PRO</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-mono text-[9px] text-tertiary font-black uppercase tracking-[0.2em]">Acceso Root</span>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-on-surface-variant hover:text-secondary bg-surface-variant/20 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id as AdminTab);
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              activeTab === item.id 
                ? 'bg-surface-variant text-secondary border-l-2 border-secondary shadow-inner' 
                : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-secondary'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-sans font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant flex flex-col gap-2">
        <button 
          onClick={() => {
            setActiveTab('events');
            setIsSidebarOpen(false);
          }}
          className="w-full bg-secondary hover:bg-amber-400 text-on-secondary font-mono font-bold text-[12px] py-3 px-4 rounded shadow-lg flex items-center justify-center gap-2 transition-all uppercase tracking-widest cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Crear Evento
        </button>
        <button 
          onClick={() => onExit ? onExit() : window.location.href = '/'}
          className="w-full bg-surface-variant/30 hover:bg-error/10 hover:text-error text-on-surface font-mono font-bold text-[11px] py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-[0.1em] cursor-pointer group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Cerrar Terminal
        </button>
      </div>
    </div>
  );

  const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-surface-container rounded-3xl border border-error/20 shadow-2xl text-center gap-6">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-error/10 flex items-center justify-center text-error border border-error/20 animate-pulse">
        <X size={32} />
      </div>
      <div className="space-y-2">
        <h3 className="font-lexend text-xl md:text-2xl font-bold text-on-surface">Error en la Terminal</h3>
        <p className="text-on-surface-variant font-sans text-sm max-w-md mx-auto">{message}</p>
        <p className="text-[9px] md:text-[10px] font-mono text-error/60 mt-4 uppercase tracking-widest">Verifica los índices de Firestore en la consola de Firebase</p>
      </div>
      <button 
        onClick={onRetry}
        className="bg-secondary text-on-secondary px-6 md:px-8 py-2.5 md:py-3 rounded-full font-lexend font-bold shadow-lg hover:shadow-secondary/20 transition-all active:scale-95 cursor-pointer"
      >
        Reintentar Conexión
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface-dim relative">
      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant p-3 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-surface-variant/30 rounded-lg text-secondary"
          >
            <Menu size={20} />
          </button>
          <h2 className="font-lexend font-bold text-secondary text-sm uppercase tracking-wider">Terminal Admin</h2>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
              <ShieldCheck size={16} />
           </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
              />
              <motion.aside 
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed left-0 top-0 bottom-0 w-72 z-[101] lg:hidden shadow-2xl"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface-container-lowest border-r border-outline-variant flex-col sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto flex flex-col gap-8 w-full overflow-hidden mb-20 lg:mb-0">
          <header className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="font-lexend text-2xl md:text-4xl font-bold text-on-surface capitalize">
                {navItems.find(i => i.id === activeTab)?.label || activeTab}
              </h1>
              <p className="text-on-surface-variant font-sans mt-2 text-xs md:text-sm">Administración centralizada y control total del sistema.</p>
            </div>
            {activeTab === 'overview' && (
              <div className="bg-surface-container-highest/20 border border-outline-variant rounded-lg px-4 py-2 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface">Estado: Sistema Online</span>
              </div>
            )}
          </header>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {error ? (
              <ErrorDisplay message={error} onRetry={() => setError(null)} />
            ) : (
              <>
                {activeTab === 'overview' && <AdminOverview onError={setError} />}
                {activeTab === 'users' && <AdminUsers onError={setError} />}
                {activeTab === 'events' && <AdminEvents onError={setError} />}
                {activeTab === 'financials' && <AdminFinancials onError={setError} />}
                {activeTab === 'settings' && <AdminSettings onError={setError} />}
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function AdminOverview({ onError }: { onError: (err: string | null) => void }) {
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, activeMarkets: 0, totalVolume: 0, totalWon: 0, totalLost: 0 });
  const [trends, setTrends] = useState<{ hour: number, volume: number }[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getVolumeTrends()
      ]);
      setStats(s);
      setTrends(t);
    } catch (err: any) {
      console.error('Overview data fetch failed:', err);
      // We don't necessarily want to crash the whole page if trends fail
      // but if everything fails, we might want to alert
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to logs with internal error handling
    const unsub = adminService.subscribeToLogs((newLogs) => {
      setLogs(newLogs);
    });

    return () => unsub();
  }, []);

  const kpis = [
    { label: 'Volumen Total', value: formatCurrency(stats.totalVolume), trend: '+12.5%', icon: Financials, color: 'text-secondary' },
    { label: 'Mercados En Vivo', value: stats.activeMarkets.toString(), trend: '+5.2%', icon: BarChart3, color: 'text-tertiary', live: stats.activeMarkets > 0 },
    { label: 'Usuarios Registrados', value: stats.totalUsers.toString(), trend: '+10', icon: Users, color: 'text-primary' }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container rounded-xl p-6 border border-outline-variant animate-pulse h-32"></div>
          ))
        ) : kpis.map((kpi, idx) => (
          <div key={idx} className="bg-surface-container rounded-xl p-6 border border-outline-variant relative overflow-hidden group shadow-lg hover:shadow-secondary/5 transition-all">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-10 transition-colors duration-500 bg-current ${kpi.color}`}></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-3 bg-surface-variant rounded-lg border border-outline-variant/50 ${kpi.color}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <span className={`flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest ${kpi.trend.startsWith('+') ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'}`}>
                {kpi.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.trend}
              </span>
            </div>
            <div className="relative z-10">
              <p className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="font-lexend text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
                  {kpi.value}
                </h3>
                {kpi.live && <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(78,222,163,0.6)]"></span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container rounded-xl border border-outline-variant flex flex-col shadow-lg overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-highest/20">
            <h3 className="font-lexend text-lg font-bold">Tendencias de Volumen</h3>
            <div className="flex gap-2">
              {['1H', '24H', '7D'].map(t => (
                <button key={t} className={`font-mono text-[10px] font-bold px-3 py-1 rounded transition-all cursor-pointer ${t === '24H' ? 'bg-secondary/10 text-secondary border border-secondary/30' : 'bg-surface-variant text-on-surface-variant border border-outline-variant'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="p-8 h-[360px] relative bg-surface-dim/40">
             <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <BarChart3 size={120} className="text-secondary" />
             </div>
             <div className="w-full h-full border-l border-b border-outline-variant/30 flex items-end justify-between px-2 pb-2">
                {trends.length > 0 ? trends.map((t, i) => {
                  const maxVolume = Math.max(...trends.map(tr => tr.volume), 1);
                  const height = (t.volume / maxVolume) * 100;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 5)}%` }}
                      transition={{ delay: i * 0.02 }}
                      className="w-[3.5%] sm:w-[3%] bg-gradient-to-t from-secondary/40 to-secondary rounded-t-sm relative group cursor-crosshair"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl border border-outline-variant">
                          {formatCurrency(t.volume)}
                          <div className="text-[8px] text-on-surface-variant text-center">{t.hour}:00</div>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant font-mono text-[10px] uppercase tracking-widest opacity-50">
                    Calculando tendencias...
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="bg-surface-container rounded-xl border border-outline-variant flex flex-col shadow-lg overflow-hidden h-[500px]">
          <div className="p-4 border-b border-outline-variant bg-surface-container-highest/20">
            <h3 className="font-lexend text-lg font-bold flex items-center gap-3">
              <ShieldCheck className="text-secondary w-5 h-5" /> Actividad del Sistema
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 divide-y divide-outline-variant/20 scrollbar-hide">
            {logs.length > 0 ? logs.map((activity, idx) => (
              <div key={activity.id || idx} className="p-4 hover:bg-surface-variant/30 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    activity.type === 'SUCCESS' ? 'bg-tertiary/10 text-tertiary' :
                    activity.type === 'ERROR' ? 'bg-error/10 text-error' :
                    'bg-primary/10 text-primary'
                  }`}>{activity.tag}</span>
                  <span className="font-mono text-[10px] text-on-surface-variant font-medium">
                    {activity.timestamp?.toDate ? activity.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </span>
                </div>
                <p className="font-sans font-bold text-on-surface text-sm">{activity.description}</p>
                <div className="mt-1 font-mono text-[10px] text-on-surface-variant flex flex-col gap-1">
                   <span>{activity.meta}</span>
                   <span className="opacity-50 text-[8px] uppercase tracking-tighter">Por: {activity.adminEmail}</span>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center text-on-surface-variant text-sm font-mono uppercase tracking-widest opacity-50">
                No hay actividad registrada
              </div>
            )}
          </div>
          <button className="p-4 bg-surface-container-highest/10 text-center font-mono text-[10px] font-bold text-on-surface-variant hover:text-secondary transition-all uppercase tracking-widest border-t border-outline-variant/30">
            VER TODOS LOS REGISTROS
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ onError }: { onError: (err: string | null) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const { user: currentAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (uid: string, email: string) => {
    if (window.confirm(`¿Estás seguro de promover a ${email} como ADMINISTRADOR? Esta acción es irreversible.`)) {
      try {
        await adminService.promoteToAdmin(uid);
        await adminService.logAction({
          type: 'WARNING',
          tag: 'USER_PROMOTED',
          description: `Usuario promovido a ADMINISTRADOR`,
          meta: `Email: ${email}`,
          adminId: currentAdmin?.uid || 'system',
          adminEmail: currentAdmin?.email || 'admin@elgrancesar.com'
        });
        fetchUsers();
      } catch (error) {
        console.error('Error promoting user:', error);
      }
    }
  };

  const handleToggleStatus = async (uid: string, email: string, currentlyDisabled: boolean) => {
    const action = currentlyDisabled ? 'activar' : 'suspender';
    if (window.confirm(`¿Estás seguro de ${action} a ${email}?`)) {
      try {
        await adminService.toggleUserStatus(uid, !currentlyDisabled);
        await adminService.logAction({
          type: currentlyDisabled ? 'SUCCESS' : 'WARNING',
          tag: currentlyDisabled ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
          description: `Estado de usuario cambiado a ${currentlyDisabled ? 'ACTIVO' : 'SUSPENDIDO'}`,
          meta: `Email: ${email}`,
          adminId: currentAdmin?.uid || 'system',
          adminEmail: currentAdmin?.email || 'admin@elgrancesar.com'
        });
        fetchUsers();
      } catch (error) {
        console.error('Error toggling status:', error);
      }
    }
  };

  const handleEditBalance = async (uid: string, email: string, currentBalance: number) => {
    const newVal = window.prompt(`Ingresa el nuevo saldo para ${email}:`, currentBalance.toString());
    if (newVal !== null) {
      const parsed = parseFloat(newVal);
      if (isNaN(parsed)) return alert('Monto inválido');
      
      try {
        await adminService.updateUserBalance(uid, parsed);
        await adminService.logAction({
          type: 'INFO',
          tag: 'BALANCE_ADJUSTED',
          description: `Saldo ajustado manualmente: Bs. ${currentBalance} -> Bs. ${parsed}`,
          meta: `Usuario: ${email}`,
          adminId: currentAdmin?.uid || 'system',
          adminEmail: currentAdmin?.email || 'admin@elgrancesar.com'
        });
        fetchUsers();
      } catch (error) {
        console.error('Error updating balance:', error);
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Todos' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant pb-6 gap-4">
        <div>
          <h2 className="font-lexend text-2xl md:text-3xl font-bold">Gestión de Usuarios</h2>
          <p className="text-on-surface-variant mt-1 text-sm">Visualiza y gestiona todos los usuarios registrados en la plataforma.</p>
        </div>
        <button className="w-full md:w-auto bg-secondary text-on-secondary font-sans font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-xl cursor-pointer">
          <Plus size={20} /> Agregar Nuevo Usuario
        </button>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input 
            className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary focus:ring-0 font-sans outline-none transition-all" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="flex-1 md:flex-none bg-surface-dim border border-outline-variant rounded-lg py-3 px-4 text-on-surface font-sans outline-none focus:border-secondary transition-all cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="Todos">Todos los Roles</option>
            <option value="VIP">VIP</option>
            <option value="USER">Estándar</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button className="bg-surface-dim border border-outline-variant rounded-lg px-4 flex items-center gap-2 font-sans font-bold text-sm hover:border-secondary transition-all cursor-pointer">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filtrar</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-highest/50 border-b border-outline-variant">
            <tr>
              <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Usuario</th>
              <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Rol</th>
              <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Saldo</th>
              <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Estado</th>
              <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center font-mono animate-pulse">Cargando usuarios...</td></tr>
            ) : filteredUsers.length > 0 ? filteredUsers.map((u) => (
              <tr key={u.uid} className="hover:bg-surface-variant/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || u.email}&background=random`} className="w-10 h-10 rounded-full border border-outline-variant object-cover" alt="" />
                    <div>
                      <div className="font-sans font-bold text-on-surface">{u.displayName || 'Usuario sin nombre'}</div>
                      <div className="text-xs text-on-surface-variant">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                     u.role === 'VIP' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                     u.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/30' :
                     'bg-surface-dim text-on-surface-variant border-outline-variant'
                   }`}>
                     {u.role || 'USER'}
                   </span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-on-surface">{formatCurrency(u.walletBalance || 0)}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    !u.disabled ? 'bg-tertiary/10 text-tertiary border-tertiary/30' : 'bg-error/10 text-error border-error/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${!u.disabled ? 'bg-tertiary animate-pulse' : 'bg-error'}`}></span> {!u.disabled ? 'Activo' : 'Suspendido'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {u.role !== 'ADMIN' && (
                      <button 
                        onClick={() => handlePromote(u.uid, u.email)}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                        title="Promover a Admin"
                      >
                        <ShieldCheck size={20} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleEditBalance(u.uid, u.email, u.walletBalance || 0)}
                      className="p-2 text-on-surface-variant hover:text-secondary transition-colors"
                      title="Editar Saldo"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(u.uid, u.email, !!u.disabled)}
                      className={`p-2 transition-colors ${u.disabled ? 'text-tertiary hover:text-tertiary/80' : 'text-on-surface-variant hover:text-error'}`}
                      title={u.disabled ? 'Activar Usuario' : 'Suspender Usuario'}
                    >
                      <span className="material-symbols-outlined text-[20px]">{u.disabled ? 'check_circle' : 'block'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-10 text-center text-on-surface-variant font-mono">No se encontraron usuarios.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden flex flex-col gap-4">
        {loading ? (
          <div className="p-10 text-center font-mono animate-pulse">Cargando usuarios...</div>
        ) : filteredUsers.length > 0 ? filteredUsers.map((u) => (
          <div key={u.uid} className="bg-surface-container rounded-xl border border-outline-variant p-4 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || u.email}&background=random`} className="w-12 h-12 rounded-full border border-outline-variant" alt="" />
                <div>
                  <div className="font-sans font-bold text-on-surface">{u.displayName || 'Sin nombre'}</div>
                  <div className="text-xs text-on-surface-variant">{u.email}</div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${
                 u.role === 'VIP' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                 u.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/30' :
                 'bg-surface-dim text-on-surface-variant border-outline-variant'
               }`}>
                 {u.role || 'USER'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-4">
              <div>
                <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">Saldo</p>
                <p className="font-mono font-bold text-on-surface">{formatCurrency(u.walletBalance || 0)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">Estado</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                  !u.disabled ? 'bg-tertiary/10 text-tertiary border-tertiary/30' : 'bg-error/10 text-error border-error/30'
                }`}>
                  {!u.disabled ? 'Activo' : 'Suspendido'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-outline-variant/20 pt-2">
              {u.role !== 'ADMIN' && (
                <button 
                  onClick={() => handlePromote(u.uid, u.email)}
                  className="flex-1 bg-primary/10 text-primary py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} /> Admin
                </button>
              )}
              <button 
                onClick={() => handleEditBalance(u.uid, u.email, u.walletBalance || 0)}
                className="p-2 text-on-surface-variant hover:text-secondary border border-outline-variant rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <button 
                onClick={() => handleToggleStatus(u.uid, u.email, !!u.disabled)}
                className={`p-2 border border-outline-variant rounded-lg ${u.disabled ? 'text-tertiary' : 'text-on-surface-variant hover:text-error'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{u.disabled ? 'check_circle' : 'block'}</span>
              </button>
            </div>
          </div>
        )) : (
          <div className="p-10 text-center text-on-surface-variant font-mono">No se encontraron usuarios.</div>
        )}
      </div>
    </div>
  );
}

function AdminEvents({ onError }: { onError: (err: string | null) => void }) {
  const [markets, setMarkets] = useState<BettingMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Premier League',
    type: 'sports',
    homeTeam: '',
    homeOdds: '2.00',
    awayTeam: '',
    awayOdds: '2.00',
    drawOdds: '3.00'
  });

  useEffect(() => {
    try {
      const unsub = getMarkets((data) => {
        setMarkets(data);
        setLoading(false);
      });
      return () => unsub();
    } catch (err: any) {
      console.error('Error in markets subscription:', err);
      onError('Error al conectar con los mercados en tiempo real.');
    }
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const liveMarkets = await sportsDataService.fetchLiveFixtures();
      for (const market of liveMarkets) {
        await upsertMarket(market);
      }
      alert(`¡Sincronización exitosa! Se actualizaron ${liveMarkets.length} mercados en vivo.`);
    } catch (error) {
      console.error('Sync Error:', error);
      alert('Error al sincronizar con la API. Revisa la consola y tu configuración .env');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMarket: Omit<BettingMarket, 'id'> = {
      name: form.name || `${form.homeTeam} vs ${form.awayTeam}`,
      category: form.category,
      startTime: new Date(),
      status: MarketStatus.UPCOMING,
      teams: [
        { name: form.homeTeam, odds: parseFloat(form.homeOdds) },
        { name: form.awayTeam, odds: parseFloat(form.awayOdds) }
      ],
      drawOdds: parseFloat(form.drawOdds)
    };
    await createMarket(newMarket);
    setForm({ ...form, name: '', homeTeam: '', awayTeam: '' });
    alert('¡Evento creado con éxito!');
  };

  const seedMockData = async () => {
    const mocks: Omit<BettingMarket, 'id'>[] = [
      {
        name: 'Real Madrid vs Man City',
        category: 'Champions League',
        startTime: new Date(),
        status: MarketStatus.LIVE,
        liveTime: '45:00',
        teams: [
          { name: 'Real Madrid', score: 1, odds: 2.10, logo: 'RMA' },
          { name: 'Man City', score: 1, odds: 2.40, logo: 'MCI' }
        ],
        drawOdds: 3.10
      },
      {
        name: 'Arsenal vs Chelsea',
        category: 'Premier League',
        startTime: new Date(),
        status: MarketStatus.UPCOMING,
        teams: [
          { name: 'Arsenal', odds: 1.85, logo: 'ARS' },
          { name: 'Chelsea', odds: 4.20, logo: 'CHE' }
        ],
        drawOdds: 3.50
      },
      {
         name: 'Kentucky Derby',
         category: 'Hípica',
         startTime: new Date(),
         status: MarketStatus.UPCOMING,
         teams: [
           { name: 'Thunderbolt', odds: 3.50 },
           { name: 'Silver Streak', odds: 5.00 },
           { name: 'Midnight Run', odds: 8.00 }
         ]
      }
    ];

    for (const m of mocks) {
      await createMarket(m);
    }
    alert('¡Datos de prueba generados!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
      <section className="col-span-12 xl:col-span-4 bg-surface-container-low border border-outline-variant rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="bg-surface-container-highest/30 p-6 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-lexend font-bold text-xl text-on-surface flex items-center gap-3">
            <Plus className="w-6 h-6 text-secondary" /> Nuevo Evento
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`text-[10px] font-mono font-bold px-2 py-1 rounded border transition-all flex items-center gap-1 ${
                isSyncing 
                  ? 'bg-surface-variant text-on-surface-variant border-outline-variant cursor-wait' 
                  : 'text-tertiary border-tertiary/30 hover:bg-tertiary/10 cursor-pointer'
              }`}
            >
              {isSyncing ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
                  SINCRONIZANDO...
                </span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">sync</span>
                  SYNC API REAL
                </>
              )}
            </button>
            <button 
              onClick={seedMockData}
              className="text-[10px] font-mono font-bold text-secondary border border-secondary/30 px-2 py-1 rounded hover:bg-secondary/10 transition-colors cursor-pointer"
            >
              MOCK DATA
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 flex-1 overflow-y-auto">
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setForm({...form, type: 'sports'})}
              className={`flex-1 p-3 text-center border-2 rounded-lg transition-all ${form.type === 'sports' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant bg-surface-dim text-on-surface-variant'}`}
            >
                <span className="material-symbols-outlined block mb-1">sports_football</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Deportes</span>
            </button>
            <button 
              type="button"
              onClick={() => setForm({...form, type: 'racing'})}
              className={`flex-1 p-3 text-center border-2 rounded-lg transition-all ${form.type === 'racing' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant bg-surface-dim text-on-surface-variant'}`}
            >
                <span className="material-symbols-outlined block mb-1">sports</span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Hípica</span>
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nombre del Evento (Opcional)</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-surface-dim border border-outline-variant rounded-lg p-3 text-on-surface focus:border-secondary outline-none transition-all placeholder:opacity-30" placeholder="ej. Manchester Utd vs Arsenal" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Categoría</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-surface-dim border border-outline-variant rounded-lg p-3 text-on-surface focus:border-secondary outline-none transition-all cursor-pointer">
                    <option>Premier League</option>
                    <option>NBA</option>
                    <option>Champions League</option>
                    <option>Hípica</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fecha y Hora</label>
                <input type="datetime-local" className="w-full bg-surface-dim border border-outline-variant rounded-lg p-3 text-on-surface focus:border-secondary outline-none transition-all [color-scheme:dark]" />
             </div>
          </div>

          <div className="mt-4 border-t border-outline-variant/30 pt-6">
            <h4 className="font-mono text-[11px] font-bold text-secondary uppercase tracking-widest mb-4">Cuotas de Resultado</h4>
            <div className="space-y-3">
               <div className="flex gap-2">
                  <input value={form.homeTeam} onChange={e => setForm({...form, homeTeam: e.target.value})} className="flex-grow bg-surface-dim border border-outline-variant rounded p-3 text-sm" placeholder="Equipo Local" required />
                  <input type="number" step="0.01" value={form.homeOdds} onChange={e => setForm({...form, homeOdds: e.target.value})} className="w-24 bg-surface-dim border border-outline-variant rounded p-3 text-center font-mono font-bold text-tertiary" placeholder="0.00" />
               </div>
               {form.type === 'sports' && (
                 <div className="flex gap-2">
                    <div className="flex-grow bg-surface-dim border border-outline-variant rounded p-3 text-sm opacity-50">Empate</div>
                    <input type="number" step="0.01" value={form.drawOdds} onChange={e => setForm({...form, drawOdds: e.target.value})} className="w-24 bg-surface-dim border border-outline-variant rounded p-3 text-center font-mono font-bold text-tertiary" placeholder="0.00" />
                 </div>
               )}
               <div className="flex gap-2">
                  <input value={form.awayTeam} onChange={e => setForm({...form, awayTeam: e.target.value})} className="flex-grow bg-surface-dim border border-outline-variant rounded p-3 text-sm" placeholder="Equipo Visitante" required />
                  <input type="number" step="0.01" value={form.awayOdds} onChange={e => setForm({...form, awayOdds: e.target.value})} className="w-24 bg-surface-dim border border-outline-variant rounded p-3 text-center font-mono font-bold text-tertiary" placeholder="0.00" />
               </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-secondary text-on-secondary font-lexend font-bold py-4 rounded-xl shadow-lg hover:bg-amber-400 mt-auto transition-all active:scale-95 cursor-pointer">
            Publicar Evento
          </button>
        </form>
      </section>

      <section className="col-span-1 md:col-span-1 lg:col-span-12 xl:col-span-8 flex flex-col gap-6 w-full overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
                <div className="bg-surface-container border border-outline-variant rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest">{markets.filter(m => m.status === MarketStatus.LIVE).length} En Vivo</span>
                </div>
                <div className="bg-surface-container border border-outline-variant rounded-full px-4 py-2 flex items-center gap-2 shadow-lg opacity-60">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest">{markets.filter(m => m.status === MarketStatus.UPCOMING).length} Próximos</span>
                </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input className="bg-surface-container border border-outline-variant rounded py-2 pl-9 pr-4 text-xs w-full md:w-48 focus:border-secondary outline-none" placeholder="Buscar Mercados..." />
                </div>
            </div>
         </div>

         {/* Desktop View */}
         <div className="hidden lg:block bg-surface-container rounded-xl border border-outline-variant shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-highest/50 border-b border-outline-variant">
                    <tr>
                        <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">ID</th>
                        <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Enfrentamiento</th>
                        <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Resultado</th>
                        <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Estado</th>
                        <th className="p-4 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                    {markets.length > 0 ? markets.map((ev) => (
                      <tr key={ev.id} className="hover:bg-surface-variant/10 transition-colors">
                        <td className="p-4 font-mono text-[10px] text-on-surface-variant truncate max-w-[100px]">{ev.id}</td>
                        <td className="p-4">
                            <div className="font-sans font-bold text-on-surface text-sm">{ev.name}</div>
                            <div className="font-mono text-[9px] text-on-surface-variant mt-1">{ev.category}</div>
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-lg">
                          {ev.status === MarketStatus.LIVE ? `${ev.teams[0].score} - ${ev.teams[1].score}` : '--'}
                        </td>
                        <td className="p-4 text-right">
                           <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                             ev.status === MarketStatus.LIVE ? 'bg-tertiary/10 text-tertiary' :
                             ev.status === MarketStatus.FINISHED ? 'bg-error/10 text-error' :
                             'bg-surface-dim text-on-surface-variant'
                           }`}>
                             {ev.status === MarketStatus.LIVE ? 'En Vivo' : ev.status === MarketStatus.FINISHED ? 'Finalizado' : 'Próximo'}
                           </span>
                        </td>
                        <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                                <button className="p-2 border border-outline-variant rounded hover:text-secondary hover:border-secondary transition-all cursor-pointer"><span className="material-symbols-outlined text-[18px]">edit_square</span></button>
                                <button className="p-2 border border-outline-variant rounded hover:text-error hover:border-error transition-all cursor-pointer"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                            </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-on-surface-variant">No se encontraron mercados.</td>
                      </tr>
                    )}
                </tbody>
            </table>
         </div>

         {/* Mobile Card View */}
         <div className="lg:hidden flex flex-col gap-4">
            {markets.length > 0 ? markets.map((ev) => (
              <div key={ev.id} className="bg-surface-container rounded-xl border border-outline-variant p-4 shadow-lg flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">{ev.category}</div>
                    <div className="font-sans font-bold text-on-surface text-sm">{ev.name}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold uppercase ${
                     ev.status === MarketStatus.LIVE ? 'bg-tertiary/10 text-tertiary' :
                     ev.status === MarketStatus.FINISHED ? 'bg-error/10 text-error' :
                     'bg-surface-dim text-on-surface-variant'
                   }`}>
                     {ev.status === MarketStatus.LIVE ? 'En Vivo' : ev.status === MarketStatus.FINISHED ? 'Finalizado' : 'Próximo'}
                   </span>
                </div>

                <div className="flex justify-between items-center bg-surface-dim/50 p-3 rounded-lg border border-outline-variant/30">
                  <div className="text-center flex-1">
                    <div className="font-sans font-bold text-xs truncate">{ev.teams[0].name}</div>
                    <div className="font-mono text-lg font-bold text-secondary">{ev.status === MarketStatus.LIVE ? ev.teams[0].score : '--'}</div>
                  </div>
                  <div className="px-4 text-on-surface-variant font-mono text-[10px] font-bold">VS</div>
                  <div className="text-center flex-1">
                    <div className="font-sans font-bold text-xs truncate">{ev.teams[1].name}</div>
                    <div className="font-mono text-lg font-bold text-secondary">{ev.status === MarketStatus.LIVE ? ev.teams[1].score : '--'}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
                  <button className="flex-1 p-2 border border-outline-variant rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:text-secondary"><span className="material-symbols-outlined text-[18px]">edit_square</span> Editar</button>
                  <button className="flex-1 p-2 border border-outline-variant rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:text-error"><span className="material-symbols-outlined text-[18px]">delete</span> Borrar</button>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center text-on-surface-variant">No se encontraron mercados.</div>
            )}
         </div>
      </section>
    </div>
  );
}

function AdminFinancials({ onError }: { onError: (err: string | null) => void }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats()
      .then(s => {
        setStats(s);
      })
      .catch(err => {
        console.error('Financials fetch failed:', err);
        onError('Error al cargar datos financieros. Verifica los índices de Firestore.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const margin = stats ? stats.totalVolume - stats.totalWon : 0;
  const marginPercent = stats && stats.totalVolume > 0 ? (margin / stats.totalVolume) * 100 : 0;

  if (loading) return <div className="p-20 text-center font-mono animate-pulse">Cargando datos financieros...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-surface-container rounded-xl p-6 border border-outline-variant shadow-lg hover:shadow-secondary/5 transition-all">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Volumen de Juego</p>
          <h3 className="font-lexend text-2xl md:text-3xl font-bold text-secondary">{formatCurrency(stats?.totalVolume || 0)}</h3>
          <p className="text-[10px] text-on-surface-variant mt-2">Total apostado en la plataforma</p>
        </div>
        <div className="bg-surface-container rounded-xl p-6 border border-outline-variant shadow-lg hover:shadow-error/5 transition-all">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Pagos Realizados</p>
          <h3 className="font-lexend text-2xl md:text-3xl font-bold text-error">{formatCurrency(stats?.totalWon || 0)}</h3>
          <p className="text-[10px] text-on-surface-variant mt-2">Total ganado por apostadores</p>
        </div>
        <div className="bg-surface-container rounded-xl p-6 border border-outline-variant shadow-lg border-b-4 border-b-tertiary hover:shadow-tertiary/5 transition-all">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Margen de Plataforma</p>
          <h3 className="font-lexend text-2xl md:text-3xl font-bold text-tertiary">{formatCurrency(margin)}</h3>
          <p className="text-[10px] text-tertiary mt-2 font-bold">{marginPercent.toFixed(2)}% de Retención</p>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-2xl">
        <div className="p-6 bg-surface-container-highest/20 border-b border-outline-variant">
          <h3 className="font-lexend text-xl font-bold">Distribución de Resultados</h3>
        </div>
        <div className="p-8">
          <div className="flex h-12 w-full rounded-full overflow-hidden border border-outline-variant shadow-inner">
            <div 
              style={{ width: `${100 - marginPercent}%` }} 
              className="bg-error/80 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter"
            >
              Pagos ({ (100 - marginPercent).toFixed(1) }%)
            </div>
            <div 
              style={{ width: `${marginPercent}%` }} 
              className="bg-tertiary flex items-center justify-center text-[10px] font-bold text-on-tertiary uppercase tracking-tighter"
            >
              Ganancia ({ marginPercent.toFixed(1) }%)
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-8 gap-6 md:gap-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold opacity-70">Total Entradas</span>
                <span className="font-mono font-bold text-secondary">{formatCurrency(stats?.totalVolume || 0)}</span>
              </div>
              <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-full"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold opacity-70">Total Salidas</span>
                <span className="font-mono font-bold text-error">{formatCurrency(stats?.totalWon || 0)}</span>
              </div>
              <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                <div className="bg-error h-full" style={{ width: `${(stats?.totalWon || 0) / (stats?.totalVolume || 1) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettings({ onError }: { onError: (err: string | null) => void }) {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentAdmin } = useAuth();

  useEffect(() => {
    adminService.getSystemConfig()
      .then(c => {
        setConfig(c);
      })
      .catch(err => {
        console.error('Settings fetch failed:', err);
        onError('Error al cargar la configuración del sistema.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleToggle = async (key: keyof SystemConfig, currentVal: boolean) => {
    if (!config) return;
    const newVal = !currentVal;
    
    try {
      await adminService.updateSystemConfig({ [key]: newVal });
      setConfig({ ...config, [key]: newVal });
      
      await adminService.logAction({
        type: newVal ? 'WARNING' : 'SUCCESS',
        tag: 'SYSTEM_CONFIG_UPDATED',
        description: `Configuración cambiada: ${String(key)} -> ${newVal}`,
        meta: `Admin: ${currentAdmin?.email}`,
        adminId: currentAdmin?.uid || 'system',
        adminEmail: currentAdmin?.email || 'admin@elgrancesar.com'
      });
    } catch (error) {
      console.error('Error updating config:', error);
      alert('Error al actualizar la configuración.');
    }
  };

  if (loading) return <div className="p-20 text-center font-mono animate-pulse">Cargando configuración...</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="bg-surface-container rounded-xl border border-outline-variant p-4 md:p-8 shadow-2xl">
        <h2 className="font-lexend text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
          <Settings className="text-secondary" /> Parámetros del Motor
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-surface-dim rounded-xl border border-outline-variant hover:border-secondary/50 transition-colors">
            <div className="flex gap-4 items-start">
              <div className={`p-3 rounded-lg ${config?.maintenanceMode ? 'bg-error/10 text-error' : 'bg-tertiary/10 text-tertiary'}`}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="font-sans font-bold text-base md:text-lg">Modo Mantenimiento Global</p>
                <p className="text-[11px] md:text-sm text-on-surface-variant max-w-md">Cuando está activo, la plataforma solo permitirá consultas. Las apuestas y depósitos quedarán deshabilitados temporalmente.</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('maintenanceMode', !!config?.maintenanceMode)}
              className={`w-14 h-8 rounded-full relative transition-all ${config?.maintenanceMode ? 'bg-error shadow-[0_0_15px_rgba(255,82,82,0.4)]' : 'bg-outline-variant'} cursor-pointer`}
            >
              <motion.div 
                animate={{ x: config?.maintenanceMode ? 26 : 4 }}
                className="absolute top-1 w-6 h-6 bg-surface-container-lowest rounded-full shadow-lg"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-6 bg-surface-dim rounded-xl border border-outline-variant hover:border-secondary/50 transition-colors">
            <div className="flex gap-4 items-start">
              <div className={`p-3 rounded-lg ${config?.autoSync ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-variant text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-[24px]">sync</span>
              </div>
              <div>
                <p className="font-sans font-bold text-lg">Sincronización de Datos en Tiempo Real</p>
                <p className="text-sm text-on-surface-variant max-w-md">Actualiza automáticamente los resultados de los mercados en vivo cada 5 minutos usando la API deportiva.</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('autoSync', !!config?.autoSync)}
              className={`w-14 h-8 rounded-full relative transition-all ${config?.autoSync ? 'bg-tertiary shadow-[0_0_15px_rgba(78,222,163,0.4)]' : 'bg-outline-variant'} cursor-pointer`}
            >
              <motion.div 
                animate={{ x: config?.autoSync ? 26 : 4 }}
                className="absolute top-1 w-6 h-6 bg-surface-container-lowest rounded-full shadow-lg"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-highest/20 rounded-xl border border-outline-variant p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
             <ShieldCheck size={20} />
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nivel de Seguridad</p>
            <p className="font-lexend font-bold">Máxima (Encriptación AES-256)</p>
          </div>
        </div>
        <p className="font-mono text-[10px] text-on-surface-variant uppercase">Versión del Sistema: v2.4.0-PRO</p>
      </div>
    </div>
  );
}
