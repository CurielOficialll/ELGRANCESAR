import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, CreditCard, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, db, setDoc, doc } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'recover';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [cedula, setCedula] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');


  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setUsername('');
    setCedula('');
    setPhone('');
    setBirthDate('');

    setError(null);
    setMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleClose();
    } catch (err: any) {
      setError('Credenciales inválidas. Por favor, intente de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName,
        username,
        role: 'STANDARD',
        balance: 1000, // Initial bonus
        cedula,
        phone,
        birthDate
      };

      await setDoc(doc(db, 'users', user.uid), profile);
      handleClose();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está en uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Intente de nuevo más tarde.');
      } else {
        setError(`Error al registrar: ${err.message || err.code || 'Desconocido'}`);
      }
      console.error('Register error:', err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un correo para restablecer su contraseña.');
    } catch (err: any) {
      setError('No se pudo enviar el correo de recuperación. Verifique el email.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 100 }}
        className="relative bg-surface-container border-t md:border border-surface-container-highest w-full max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[80vh] fixed bottom-0 md:relative"
      >
        <div className="md:hidden w-full flex justify-center py-3">
          <div className="w-12 h-1 rounded-full bg-on-surface-variant/20" />
        </div>
        <div className="p-6 border-b border-surface-container-highest flex justify-between items-center">
          <h2 className="font-lexend text-2xl font-bold text-on-surface">
            {mode === 'login' && 'Iniciar Sesión'}
            {mode === 'register' && 'Crear Cuenta'}
            {mode === 'recover' && 'Recuperar Contraseña'}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-surface-container-highest rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-sans">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-6 p-4 bg-tertiary/10 border border-tertiary/20 rounded-lg text-tertiary text-sm font-sans">
              {message}
            </div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => setMode('recover')}
                    className="text-xs text-secondary hover:text-amber-400 font-bold transition-colors"
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-secondary text-on-secondary font-lexend font-bold py-4 rounded-xl shadow-lg hover:bg-amber-400 transition-all active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
                </button>

                <div className="text-center pt-4">
                  <p className="text-sm text-on-surface-variant">
                    ¿No tiene una cuenta? {' '}
                    <button 
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-secondary font-bold hover:underline"
                    >
                      Regístrese ahora
                    </button>
                  </p>
                </div>
              </motion.form>
            )}

            {mode === 'register' && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >


                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      type="text" 
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nombre de Usuario</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">@</span>
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="juanperez98"
                      className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cédula</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input 
                        type="text" 
                        required
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        placeholder="V-12345678"
                        className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Celular</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0412 0000000"
                        className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fecha de Nacimiento</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      type="date" 
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-secondary text-on-secondary font-lexend font-bold py-4 rounded-xl shadow-lg hover:bg-amber-400 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Cuenta'}
                </button>

                <div className="text-center pt-2">
                  <p className="text-sm text-on-surface-variant">
                    ¿Ya tiene una cuenta? {' '}
                    <button 
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-secondary font-bold hover:underline"
                    >
                      Inicie sesión
                    </button>
                  </p>
                </div>
              </motion.form>
            )}

            {mode === 'recover' && (
              <motion.form
                key="recover"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRecover}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full bg-surface-dim border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:border-secondary outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-secondary text-on-secondary font-lexend font-bold py-4 rounded-xl shadow-lg hover:bg-amber-400 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Enlace'}
                </button>

                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-secondary font-bold hover:underline"
                  >
                    Volver al Inicio
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-6 bg-surface-container-highest/30 border-t border-surface-container-highest flex justify-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black">ELGRANCESAR PREMIUM</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
