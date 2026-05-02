import { Users, Calendar, BarChart3, Wallet as Financials, Settings, Plus, LayoutGrid, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { createMarket, getMarkets } from '../services/db';
import { BettingMarket, MarketStatus } from '../types';

type AdminTab = 'overview' | 'users' | 'events' | 'financials' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface-dim">
      {/* Mobile Admin Nav */}
      <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant p-2 flex gap-1 overflow-x-auto scrollbar-hide sticky top-[64px] z-40">
        {[
          { id: 'overview', icon: LayoutGrid, label: 'Resumen' },
          { id: 'users', icon: Users, label: 'Usuarios' },
          { id: 'events', icon: Calendar, label: 'Eventos' },
          { id: 'financials', icon: Financials, label: 'Finanzas' },
          { id: 'settings', icon: Settings, label: 'Ajustes' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as AdminTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === item.id 
                ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-sans font-bold text-[10px] uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-1">
        {/* Admin Sidebar - Desktop */}
        <aside className="hidden lg:flex w-64 bg-surface-container-lowest border-r border-outline-variant flex-col sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6 border-b border-outline-variant flex items-center justify-center gap-4 flex-col">
            <div className="w-16 h-16 rounded-full bg-surface-variant border-2 border-secondary overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop" 
                alt="Admin" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="font-lexend text-xl font-bold text-secondary">Terminal Admin</h2>
              <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Gestión ELGRANCESAR</p>
            </div>
          </div>

          <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Resumen' },
              { id: 'users', icon: Users, label: 'Usuarios' },
              { id: 'events', icon: Calendar, label: 'Eventos' },
              { id: 'financials', icon: Financials, label: 'Finanzas' },
              { id: 'settings', icon: Settings, label: 'Ajustes del Sistema' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
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

          <div className="p-4 border-t border-outline-variant">
            <button 
              onClick={() => setActiveTab('events')}
              className="w-full bg-secondary hover:bg-amber-400 text-on-secondary font-mono font-bold text-[12px] py-3 px-4 rounded shadow-lg flex items-center justify-center gap-2 transition-all uppercase tracking-widest cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Crear Evento
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto flex flex-col gap-8 w-full overflow-hidden">
          <header className={`transition-opacity duration-300`}>
            <h1 className="font-lexend text-2xl md:text-4xl font-bold text-on-surface capitalize">
              {activeTab === 'overview' ? 'Resumen' : 
               activeTab === 'users' ? 'Usuarios' : 
               activeTab === 'events' ? 'Eventos' : 
               activeTab === 'financials' ? 'Finanzas' : 'Ajustes'}
            </h1>
            <p className="text-on-surface-variant font-sans mt-2">Administra el rendimiento del sistema y la actividad del mercado.</p>
          </header>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'events' && <AdminEvents />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function AdminOverview() {
  const kpis = [
    { label: 'Volumen Total (24h)', value: '$3.2M', trend: '+12.5%', icon: Financials, color: 'text-secondary' },
    { label: 'Apuestas Activas Hoy', value: '14,205', trend: '+5.2%', icon: BarChart3, color: 'text-tertiary', live: true },
    { label: 'Usuarios Activos', value: '8,450', trend: '-1.1%', icon: Users, color: 'text-primary' }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-surface-container rounded-xl p-6 border border-outline-variant relative overflow-hidden group shadow-lg">
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
                <h3 className="font-lexend text-3xl font-bold text-on-surface tracking-tight">{kpi.value}</h3>
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
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="w-[6%] bg-gradient-to-t from-secondary/40 to-secondary rounded-t-sm relative group cursor-crosshair"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        ${(h * 24.3).toFixed(1)}k
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-surface-container rounded-xl border border-outline-variant flex flex-col shadow-lg overflow-hidden">
          <div className="p-4 border-b border-outline-variant bg-surface-container-highest/20">
            <h3 className="font-lexend text-lg font-bold flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">list_alt</span> Actividad del Sistema
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 divide-y divide-outline-variant/20 scrollbar-hide">
            {[
              { type: 'SUCCESS', tag: 'MERCADO_LIQUIDADO', time: 'hace 2m', desc: 'Carrera 4 - Flemington liquidada.', meta: 'Vol: $45k | Pago: $32k' },
              { type: 'ERROR', tag: 'ALERTA_APUESTA_ALTA', time: 'hace 15m', desc: 'Usuario VIP_882 realizó una apuesta.', meta: 'Mercado: EPL - Man Utd vs Ars' },
              { type: 'INFO', tag: 'LOG_SISTEMA', time: 'hace 1h', desc: 'Feed de cuotas re-sincronizado.', meta: 'Proveedor: BetRadar API' },
              { type: 'SUCCESS', tag: 'MERCADO_CREADO', time: 'hace 3h', desc: 'Nuevo mercado de futuros agregado.', meta: 'Categoría: Tennis Grand Slam' }
            ].map((activity, idx) => (
              <div key={idx} className="p-4 hover:bg-surface-variant/30 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    activity.type === 'SUCCESS' ? 'bg-tertiary/10 text-tertiary' :
                    activity.type === 'ERROR' ? 'bg-error/10 text-error' :
                    'bg-primary/10 text-primary'
                  }`}>{activity.tag}</span>
                  <span className="font-mono text-[10px] text-on-surface-variant font-medium">{activity.time}</span>
                </div>
                <p className="font-sans font-bold text-on-surface text-sm">{activity.desc}</p>
                <div className="mt-1 font-mono text-[11px] text-on-surface-variant">{activity.meta || '\u00A0'}</div>
              </div>
            ))}
          </div>
          <button className="p-4 bg-surface-container-highest/10 text-center font-mono text-[10px] font-bold text-on-surface-variant hover:text-secondary transition-all uppercase tracking-widest border-t border-outline-variant/30">
            VER TODOS LOS REGISTROS
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const users = [
    { name: 'Arthur Shelby', email: 'arthur.s@peaky.com', role: 'VIP', balance: '$14,500.00', status: 'Activo', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
    { name: 'Grace Burgess', email: 'grace.b@crown.co.uk', role: 'Estándar', balance: '$1,250.50', status: 'Activo', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { name: 'Luca Changretta', email: 'luca.c@nyc.net', role: 'Estándar', balance: '$0.00', status: 'Suspendido', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
    { name: 'Alfie Solomons', email: 'alfie.s@camden.co.uk', role: 'Admin', balance: '---', status: 'Activo', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-outline-variant pb-6">
        <div>
          <h2 className="font-lexend text-3xl font-bold">Gestión de Usuarios</h2>
          <p className="text-on-surface-variant mt-1">Visualiza y gestiona todos los usuarios registrados en la plataforma.</p>
        </div>
        <button className="bg-secondary text-on-secondary font-sans font-bold py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-amber-400 transition-all shadow-xl cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">person_add</span> Agregar Nuevo Usuario
        </button>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant p-4 flex gap-4 items-center shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary focus:ring-0 font-sans outline-none transition-all" placeholder="Buscar por nombre o correo..." />
        </div>
        <div className="flex gap-2">
          <select className="bg-surface-dim border border-outline-variant rounded-lg py-3 px-4 text-on-surface font-sans outline-none focus:border-secondary transition-all cursor-pointer">
            <option>Todos los Roles</option>
            <option>VIP</option>
            <option>Estándar</option>
          </select>
          <button className="bg-surface-dim border border-outline-variant rounded-lg px-4 flex items-center gap-2 font-sans font-bold text-sm hover:border-secondary transition-all cursor-pointer">
            <Filter className="w-4 h-4" /> Filtrar
          </button>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
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
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-surface-variant/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img src={u.img} className="w-10 h-10 rounded-full border border-outline-variant object-cover" alt="" />
                    <div>
                      <div className="font-sans font-bold text-on-surface group-hover:text-secondary">{u.name}</div>
                      <div className="text-xs text-on-surface-variant">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                     u.role === 'VIP' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                     u.role === 'Admin' ? 'bg-primary/10 text-primary border-primary/30' :
                     'bg-surface-dim text-on-surface-variant border-outline-variant'
                   }`}>
                     {u.role}
                   </span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-on-surface">{u.balance}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    u.status === 'Activo' ? 'bg-tertiary/10 text-tertiary border-tertiary/30' : 'bg-error/10 text-error border-error/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Activo' ? 'bg-tertiary animate-pulse' : 'bg-error'}`}></span> {u.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-[20px]">block</span></button>
                    <button className="p-2 text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminEvents() {
  const [markets, setMarkets] = useState<BettingMarket[]>([]);
  const [loading, setLoading] = useState(true);
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
    const unsub = getMarkets((data) => {
      setMarkets(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

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
          <button 
            onClick={seedMockData}
            className="text-[10px] font-mono font-bold text-secondary border border-secondary/30 px-2 py-1 rounded hover:bg-secondary/10 transition-colors"
          >
            CREAR DATOS DE PRUEBA
          </button>
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
            <div className="flex gap-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input className="bg-surface-container border border-outline-variant rounded py-2 pl-9 pr-4 text-xs w-48 focus:border-secondary outline-none" placeholder="Buscar Mercados..." />
                </div>
            </div>
         </div>

         <div className="bg-surface-container rounded-xl border border-outline-variant shadow-2xl overflow-x-auto flex-1 flex flex-col scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[600px]">
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
                    {markets.length > 0 ? markets.map((ev, i) => (
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
                        <td colSpan={5} className="p-10 text-center text-on-surface-variant">No se encontraron mercados. Usa "Crear Datos de Prueba" para comenzar.</td>
                      </tr>
                    )}
                </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}
