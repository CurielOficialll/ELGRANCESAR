<![CDATA[<div align="center">

# 🏆 ELGRANCESAR

### Terminal de Apuestas Premium

[![Version](https://img.shields.io/badge/versión-1.0.0-gold?style=for-the-badge)](/)
[![Stack](https://img.shields.io/badge/React_19-+_Firebase-blue?style=for-the-badge)](/)
[![License](https://img.shields.io/badge/licencia-Apache_2.0-green?style=for-the-badge)](/)
[![Estado](https://img.shields.io/badge/estado-beta-orange?style=for-the-badge)](/)

*Plataforma de apuestas deportivas e hípicas de grado institucional con cuotas en tiempo real, ejecución atómica de transacciones y diseño premium.*

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [Componentes](#-componentes)
- [Seguridad](#-seguridad)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)
- [Roadmap](#-roadmap)

---

## 🎯 Descripción General

**ELGRANCESAR** es una plataforma web de apuestas deportivas e hípicas premium, diseñada para ofrecer una experiencia de usuario de alto nivel con cuotas en tiempo real, transacciones atómicas y un panel de administración completo.

| Aspecto | Detalle |
|---------|---------|
| **Problema que resuelve** | Centraliza mercados deportivos e hípicos en una terminal profesional con ejecución segura |
| **Usuarios objetivo** | Apostadores deportivos, aficionados hípicos, operadores de casas de apuestas |
| **Propuesta de valor** | UX premium, cuotas en vivo, transacciones atómicas con Firebase, panel admin completo |
| **Estado actual** | Beta — funcional con autenticación, apuestas y administración |

---

## ✨ Características

### Funcionalidades Completadas
- ✅ Autenticación Email/Password con Firebase Auth
- ✅ Registro con nombre completo, username, cédula, teléfono y fecha de nacimiento
- ✅ Recuperación de contraseña por correo
- ✅ Dashboard de mercados deportivos en tiempo real (Firestore)
- ✅ Sistema de apuestas con cupón interactivo (BettingSlip)
- ✅ Transacciones atómicas (lectura de saldo → apuesta → descuento en una transacción)
- ✅ Liquidación de apuestas con pago atómico al ganador
- ✅ Billetera con historial de transacciones en tiempo real
- ✅ Panel de administración con KPIs, gestión de usuarios y creación de eventos
- ✅ Diseño 100% responsive (móvil, tablet, desktop)
- ✅ Navegación inferior nativa estilo Material 3 para móviles
- ✅ Logo 3D rotativo como watermark de fondo
- ✅ Animaciones fluidas con Framer Motion
- ✅ Sistema de roles (STANDARD, VIP, ADMIN)

### Limitaciones Actuales
- ⚠️ No hay pasarela de pago real (depósito/retiro son UI placeholder)
- ⚠️ Los datos de KPIs del admin son estáticos (mock)
- ⚠️ No hay sistema de notificaciones push
- ⚠️ No hay verificación de edad real
- ⚠️ AuthContext existe pero no está integrado globalmente (se usa prop drilling)

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| **UI Framework** | React | 19.0.1 | Ecosistema maduro, Server Components ready |
| **Lenguaje** | TypeScript | 5.8.2 | Type safety, mejor DX |
| **Estilos** | Tailwind CSS | 4.1.14 | Utility-first, design tokens nativos via `@theme` |
| **Animaciones** | Motion (Framer) | 12.23.24 | AnimatePresence, layout animations |
| **Iconos** | Lucide React | 0.546.0 | Tree-shakeable, consistente |
| **Iconos Material** | Material Symbols | CDN | Variantes fill/outlined dinámicas |
| **Backend/BaaS** | Firebase | 12.12.1 | Auth + Firestore + Hosting |
| **IA** | Google GenAI SDK | 1.29.0 | Pronósticos con IA (futuro) |
| **Bundler** | Vite | 6.2.3 | HMR ultra-rápido, ESM nativo |
| **Fuentes** | Google Fonts | CDN | Inter, Lexend, Space Grotesk |

---

## 🏗 Arquitectura

```
┌──────────────────────────────────────────────────────┐
│                    CLIENTE (SPA)                     │
│  React 19 + TypeScript + Tailwind CSS 4 + Motion     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Pages   │  │Components│  │  Hooks   │            │
│  │ Home     │  │ Header   │  │useMarkets│            │
│  │Dashboard │  │ Footer   │  │ useBets  │            │
│  │ Wallet   │  │AuthModal │  └──────────┘            │
│  │ Admin    │  │BettingSlip│                         │
│  └────┬─────┘  │MarketCards│                         │
│       │        └──────────┘                          │
│       ▼                                              │
│  ┌──────────────────────────────────┐                │
│  │      Services Layer (db.ts)      │                │
│  │  getUserProfile | placeBet       │                │
│  │  getMarkets | settleBet          │                │
│  │  createMarket | syncUserProfile  │                │
│  └────────────┬─────────────────────┘                │
│               ▼                                      │
│  ┌──────────────────────────────────┐                │
│  │    Firebase SDK (lib/firebase.ts) │                │
│  │  Auth | Firestore | Error Handler│                │
│  └────────────┬─────────────────────┘                │
└───────────────┼──────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────┐
│              FIREBASE CLOUD (BaaS)                   │
│  ┌────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │ Firebase   │  │   Firestore    │  │  Firebase   │ │
│  │   Auth     │  │  (default DB)  │  │  Hosting    │ │
│  │Email/Pass  │  │ users/markets  │  │  CDN/SSL    │ │
│  └────────────┘  └────────────────┘  └────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Patrón:** Monolito SPA con BaaS (Backend-as-a-Service). Sin servidor propio.

---

## 🚀 Instalación

### Pre-requisitos

| Software | Versión Mínima |
|----------|---------------|
| Node.js | 18.x |
| npm | 9.x |
| Git | 2.x |

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/ELGRANCESAR.git
cd ELGRANCESAR

# 2. Instalar dependencias
npm install

# 3. Configurar Firebase (ver Variables de Entorno)
# Editar firebase-applet-config.json con tus credenciales

# 4. Iniciar en modo desarrollo
npm run dev
# → Disponible en http://localhost:3000

# 5. (Opcional) Build de producción
npm run build
npm run preview
```

### Solución a Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `auth/operation-not-allowed` | Email/Password no habilitado | Habilitar en Firebase Console → Authentication → Providers |
| `PERMISSION_DENIED` | Reglas de Firestore expiradas | Actualizar fecha en `firestore.rules` y re-desplegar |
| `MODULE_NOT_FOUND` | Dependencias faltantes | Ejecutar `npm install` |
| Puerto 3000 ocupado | Otro proceso activo | Cambiar puerto en `package.json` o cerrar el proceso |

---

## 🔐 Variables de Entorno

| Variable | Descripción | Obligatoria | Ejemplo |
|----------|-------------|:-----------:|---------|
| `GEMINI_API_KEY` | API key de Google Gemini AI | No* | `AIzaSy...` |

> *Actualmente solo se usa para funcionalidades futuras de pronósticos con IA.

### Configuración de Firebase

El archivo `firebase-applet-config.json` contiene la configuración del proyecto:

```json
{
  "projectId": "elgrancesar-betting",
  "appId": "1:311876060095:web:...",
  "apiKey": "AIzaSy...",
  "authDomain": "elgrancesar-betting.firebaseapp.com",
  "storageBucket": "elgrancesar-betting.firebasestorage.app",
  "messagingSenderId": "311876060095"
}
```

---

## 📁 Estructura del Proyecto

```
ELGRANCESAR/
├── public/
│   └── logo.png                  # Logo principal (watermark 3D)
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx          # Modal de login/registro/recuperación
│   │   ├── BettingSlip.tsx        # Cupón lateral de apuestas
│   │   ├── Footer.tsx             # Pie de página con enlaces legales
│   │   ├── Header.tsx             # Barra de navegación + saldo + auth
│   │   └── MarketCards.tsx        # Tarjetas de mercados (Live + Racing)
│   ├── context/
│   │   └── AuthContext.tsx        # Context de autenticación (preparado)
│   ├── data/
│   │   └── mock-markets.ts       # Datos mock para Home (trending/racing)
│   ├── hooks/
│   │   ├── useBets.ts             # Hook: historial de apuestas en tiempo real
│   │   └── useMarkets.ts          # Hook: mercados live/upcoming en tiempo real
│   ├── lib/
│   │   └── firebase.ts            # SDK Firebase + error handler centralizado
│   ├── pages/
│   │   ├── Admin.tsx              # Panel admin (Overview, Users, Events)
│   │   ├── Dashboard.tsx          # Mercados deportivos + apuestas en vivo
│   │   ├── Home.tsx               # Landing con hero + mercados destacados
│   │   └── Wallet.tsx             # Billetera + historial de transacciones
│   ├── services/
│   │   └── db.ts                  # Capa de acceso a Firestore (CRUD + transacciones)
│   ├── App.tsx                    # Layout principal + router + estado global
│   ├── index.css                  # Design tokens + animaciones + utilidades
│   ├── main.tsx                   # Entry point React
│   └── types.ts                   # Interfaces TypeScript (UserProfile, Bet, Market)
├── firebase-applet-config.json    # Configuración Firebase
├── firebase-blueprint.json        # Schema de entidades Firestore
├── firestore.rules                # Reglas de seguridad Firestore
├── firestore.indexes.json         # Índices de Firestore
├── security_spec.md               # Especificación de seguridad
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración TypeScript
└── vite.config.ts                 # Configuración Vite + Tailwind
```

---

## 🗄 Base de Datos

**Motor:** Cloud Firestore (NoSQL, tiempo real)

### Colecciones

```
firestore/
├── users/{userId}                 # Perfiles de usuario
│   ├── uid: string
│   ├── email: string
│   ├── displayName: string
│   ├── username: string
│   ├── role: "STANDARD" | "VIP" | "ADMIN"
│   ├── balance: number
│   ├── cedula?: string
│   ├── phone?: string
│   ├── birthDate?: string
│   └── createdAt: Timestamp
│   │
│   └── bets/{betId}               # Sub-colección de apuestas
│       ├── userId: string
│       ├── marketId: string
│       ├── marketName: string
│       ├── outcomeName: string
│       ├── stake: number
│       ├── odds: number
│       ├── payout: number | null
│       ├── status: "WON" | "PENDING" | "LOST"
│       └── createdAt: Timestamp
│
└── markets/{marketId}             # Mercados de apuestas
    ├── name: string
    ├── category: string
    ├── startTime: Timestamp
    ├── status: "LIVE" | "UPCOMING" | "FINISHED" | "SETTLED" | "SUSPENDED"
    ├── teams: Array<{name, score?, odds, logo?}>
    ├── drawOdds?: number
    └── liveTime?: string
```

### Operaciones Atómicas

Las apuestas usan `runTransaction()` de Firestore para garantizar consistencia:

1. **Colocar apuesta:** Lee saldo → valida fondos → crea bet → descuenta saldo (todo atómico)
2. **Liquidar apuesta:** Verifica status PENDING → actualiza status → si WON, acredita payout (atómico)

---

## 🧩 Componentes

| Componente | Ubicación | Descripción | Props Clave |
|-----------|-----------|-------------|-------------|
| `App` | `src/App.tsx` | Layout raíz, router, estado global | — |
| `Header` | `components/Header.tsx` | Nav + saldo + auth buttons | `user, onLogin, onLogout, onNavigate, currentPage` |
| `Footer` | `components/Footer.tsx` | Links legales + copyright | — |
| `AuthModal` | `components/AuthModal.tsx` | Login / Registro / Recuperar | `isOpen, onClose` |
| `BettingSlip` | `components/BettingSlip.tsx` | Cupón de apuestas lateral | `selections, onRemove, onPlaceBet, user` |
| `LiveMatchCard` | `components/MarketCards.tsx` | Tarjeta de partido en vivo | `market, onSelect` |
| `RacingCard` | `components/MarketCards.tsx` | Tarjeta de carrera hípica | `market, onSelect` |
| `Home` | `pages/Home.tsx` | Hero + mercados destacados | `onSelectBet, onLogin` |
| `Dashboard` | `pages/Dashboard.tsx` | Mercados live + upcoming | `onSelectBet, activeBetIds` |
| `WalletPage` | `pages/Wallet.tsx` | Saldo + historial | `user, onLogin` |
| `AdminPage` | `pages/Admin.tsx` | Panel completo de admin | — |

### Custom Hooks

| Hook | Archivo | Retorna |
|------|---------|---------|
| `useMarkets` | `hooks/useMarkets.ts` | `{ markets, liveMatches, upcomingMatches, loading }` |
| `useBets` | `hooks/useBets.ts` | `{ bets, pendingBets, totalPending, loading }` |

---

## 🔒 Seguridad

### Medidas Implementadas
- 🔒 Autenticación vía Firebase Auth (servidor de Google)
- 🔒 Transacciones atómicas previenen race conditions en saldos
- 🔒 Error handler centralizado con contexto de auth para debugging
- 🔒 Reglas de Firestore con validación temporal
- 🔒 Input sanitization en username (solo `[a-z0-9_]`)
- 🔒 Contraseña mínima 6 caracteres (Firebase default)

### Especificación de Seguridad (12 Dirty Dozen Tests)
Documentados en `security_spec.md`:
1. Identity Spoofing — Prevenir apuestas con userId ajeno
2. Infinite Stakes — Rechazar stakes negativos o >1M
3. Ghost Odds Injection — Rechazar odds de 1,000,000
4. Self-Balance Boost — Bloquear auto-modificación de balance
5. Market Sabotage — Solo admin puede cambiar status de mercado
6. Time Travel — Validar `createdAt` contra `request.time`
7. Role Escalation — Bloquear cambio de STANDARD a ADMIN
8. Shadow Field Injection — Rechazar campos no definidos
9. Document ID Poisoning — Limitar longitud de IDs
10. Resource Exhaustion — Limitar arrays de teams/runners
11. Negative Score — Rechazar scores negativos
12. Outcome Overwrite — Impedir cambiar LOST a WON post-liquidación

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Servidor de desarrollo en puerto 3000 |
| `build` | `npm run build` | Build de producción con Vite |
| `preview` | `npm run preview` | Preview del build de producción |
| `clean` | `npm run clean` | Elimina carpeta `dist/` |
| `lint` | `npm run lint` | Type-check con TypeScript (sin emit) |

---

## ☁️ Despliegue

### Firebase Hosting

```bash
# 1. Build de producción
npm run build

# 2. Desplegar reglas de Firestore
npx firebase-tools deploy --only firestore:rules --project elgrancesar-betting

# 3. Desplegar hosting
npx firebase-tools deploy --only hosting --project elgrancesar-betting
```

**URL de producción:** `https://elgrancesar-betting.web.app`

---

## 🗺 Roadmap

| Prioridad | Feature | Estado |
|:---------:|---------|--------|
| 🔴 | Pasarela de pagos (Stripe/PayPal) | Pendiente |
| 🔴 | Verificación de identidad KYC | Pendiente |
| 🟡 | Notificaciones push (FCM) | Pendiente |
| 🟡 | Integrar AuthContext globalmente (eliminar prop drilling) | Pendiente |
| 🟡 | Pronósticos con IA (Gemini API) | Pendiente |
| 🟢 | Sistema de toasts en vez de `alert()` | Pendiente |
| 🟢 | Separar router en componente dedicado | Pendiente |
| 🟢 | Tests E2E con Playwright | Pendiente |

---

## 📊 Estado del Proyecto

| Módulo | Completado | Notas |
|--------|:----------:|-------|
| Autenticación | ✅ 100% | Email/Pass + Registro completo |
| Home / Landing | ✅ 100% | Hero + mercados mock |
| Dashboard deportivo | ✅ 95% | Falta filtro real por categoría |
| Sistema de apuestas | ✅ 100% | Transacciones atómicas |
| Billetera | ✅ 90% | Falta depósito/retiro real |
| Panel Admin | ✅ 85% | Falta finanzas y ajustes |
| Responsive | ✅ 100% | Probado en Galaxy Fold → Desktop |
| Seguridad | 🟡 60% | Reglas temporales, falta hardening |

---

<div align="center">

**ELGRANCESAR** © 2026 — Todos los derechos reservados.

18+ Juega con responsabilidad.

</div>
]]>
