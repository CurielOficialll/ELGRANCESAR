import { useState } from 'react';
import { Bell, BellOff, Moon, Settings2 } from 'lucide-react';

export const PreferencesSettings = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    promotions: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <header>
        <h2 className="font-lexend text-3xl font-black text-on-surface tracking-tight">Preferencias</h2>
        <p className="font-sans text-on-surface-variant mt-2 text-base">Personaliza la interfaz y las notificaciones de tu cuenta.</p>
      </header>

      <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-8 shadow-xl flex flex-col gap-8">
        
        <section>
          <h3 className="font-lexend text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" /> Notificaciones
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-lg border border-outline-variant">
              <div>
                <h4 className="font-sans font-bold text-on-surface">Correos de Transacciones</h4>
                <p className="text-xs text-on-surface-variant mt-1">Recibir un correo electrónico cuando se liquida una apuesta o hay un depósito/retiro.</p>
              </div>
              <button 
                onClick={() => togglePreference('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${preferences.emailNotifications ? 'bg-secondary' : 'bg-surface-variant'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-lg border border-outline-variant">
              <div>
                <h4 className="font-sans font-bold text-on-surface">Ofertas y Promociones</h4>
                <p className="text-xs text-on-surface-variant mt-1">Recibir noticias sobre nuevos mercados y bonos especiales.</p>
              </div>
              <button 
                onClick={() => togglePreference('promotions')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${preferences.promotions ? 'bg-secondary' : 'bg-surface-variant'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.promotions ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

        <section className="border-t border-surface-container-highest pt-8">
          <h3 className="font-lexend text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <Moon className="w-5 h-5 text-secondary" /> Apariencia
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-lg border border-outline-variant opacity-70">
            <div>
              <h4 className="font-sans font-bold text-on-surface">Modo Oscuro</h4>
              <p className="text-xs text-on-surface-variant mt-1">ELGRANCESAR actualmente está optimizado exclusivamente para el modo oscuro premium.</p>
            </div>
            <div className="px-3 py-1 bg-surface-variant text-on-surface-variant text-xs font-bold rounded-full uppercase tracking-wider">
              Activado
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
