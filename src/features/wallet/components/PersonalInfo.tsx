import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '@/types';
import { updateProfileData } from '@/features/auth/services/auth.service';

interface PersonalInfoProps {
  user: UserProfile;
}

export const PersonalInfo = ({ user }: PersonalInfoProps) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    username: user.username || '',
    cedula: user.cedula || '',
    phone: user.phone || '',
    birthDate: user.birthDate || '',
  });

  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus('idle');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    
    try {
      await updateProfileData(user.uid, formData);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || 'Error al actualizar el perfil.');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <header>
        <h2 className="font-lexend text-3xl font-black text-on-surface tracking-tight">Información Personal</h2>
        <p className="font-sans text-on-surface-variant mt-2 text-base">Actualiza tus datos de contacto y perfil público.</p>
      </header>

      {status === 'success' && (
        <div className="bg-tertiary/10 border border-tertiary/20 text-tertiary px-4 py-3 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">Perfil actualizado correctamente.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="font-bold text-sm">{errorMessage}</span>
        </div>
      )}

      <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-8 shadow-xl">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">Nombre Completo</label>
              <input 
                type="text" 
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="bg-surface-container-highest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Ej. Juan Pérez"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">Nombre de Usuario</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-surface-container-highest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Ej. juanperez99"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">Cédula / Documento</label>
              <input 
                type="text" 
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="bg-surface-container-highest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Ej. V-12345678"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">Teléfono</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-surface-container-highest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Ej. +58 414 1234567"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">Fecha de Nacimiento</label>
              <input 
                type="date" 
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="bg-surface-container-highest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">Correo Electrónico</label>
              <input 
                type="email" 
                value={user.email}
                disabled
                className="bg-surface-container-highest border border-outline-variant text-on-surface-variant rounded-lg px-4 py-3 opacity-60 cursor-not-allowed"
                title="El correo no se puede cambiar aquí."
              />
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-surface-container-highest flex justify-end">
            <button 
              type="submit" 
              disabled={status === 'saving'}
              className="bg-secondary text-on-secondary font-sans font-bold px-8 py-3 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all hover:bg-amber-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'saving' ? (
                <>Guardando...</>
              ) : (
                <><Save className="w-5 h-5" /> Guardar Cambios</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
