import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Key } from 'lucide-react';
import { updateUserPassword } from '@/features/auth/services/auth.service';

export const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setStatus('idle');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus('error');
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    
    if (passwords.newPassword.length < 6) {
      setStatus('error');
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setStatus('saving');
    
    try {
      await updateUserPassword(passwords.newPassword);
      setStatus('success');
      setPasswords({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      if (error.code === 'auth/requires-recent-login') {
        setErrorMessage('Por razones de seguridad, debes cerrar sesión y volver a entrar antes de cambiar tu contraseña.');
      } else {
        setErrorMessage(error.message || 'Error al actualizar contraseña.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <header>
        <h2 className="font-lexend text-3xl font-black text-on-surface tracking-tight">Seguridad</h2>
        <p className="font-sans text-on-surface-variant mt-2 text-base">Administra la contraseña de tu cuenta y la seguridad de tu inicio de sesión.</p>
      </header>

      {status === 'success' && (
        <div className="bg-tertiary/10 border border-tertiary/20 text-tertiary px-4 py-3 rounded-lg flex items-center gap-3">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-bold text-sm">Contraseña actualizada correctamente.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold text-sm">{errorMessage}</span>
        </div>
      )}

      <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-8 shadow-xl">
        <h3 className="font-lexend text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
          <Key className="w-5 h-5 text-secondary" /> Cambiar Contraseña
        </h3>
        
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">Nueva Contraseña</label>
              <input 
                type="password" 
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="bg-surface-container-highest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider">Confirmar Contraseña</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="bg-surface-container-highest border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-surface-container-highest flex justify-end">
            <button 
              type="submit" 
              disabled={status === 'saving'}
              className="bg-surface-container-highest text-on-surface hover:text-secondary font-sans font-bold px-8 py-3 rounded-lg shadow-sm border border-outline-variant flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'saving' ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
