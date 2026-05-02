<![CDATA[<div align="center">

<h1>🏆 ELGRANCESAR</h1>

<h3>Terminal de Apuestas Premium</h3>

<p>
  <img src="https://img.shields.io/badge/version-1.0.0-gold?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/React_19-Firebase-blue?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/licencia-Apache_2.0-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/estado-beta-orange?style=for-the-badge" alt="Estado" />
</p>

<p><em>Plataforma de apuestas deportivas e hipicas de grado institucional con cuotas en tiempo real, ejecucion atomica de transacciones y diseno premium.</em></p>

</div>

---

## 📋 Tabla de Contenidos

- [Descripcion General](#-descripcion-general)
- [Caracteristicas](#-caracteristicas)
- [Stack Tecnologico](#-stack-tecnologico)
- [Arquitectura](#-arquitectura)
- [Instalacion](#-instalacion)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [Componentes](#-componentes)
- [Seguridad](#-seguridad)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)
- [Roadmap](#-roadmap)

---

## 🎯 Descripcion General

**ELGRANCESAR** es una plataforma web de apuestas deportivas e hipicas premium, diseñada para ofrecer una experiencia de usuario de alto nivel con cuotas en tiempo real, transacciones atomicas y un panel de administracion completo.

| Aspecto | Detalle |
|---------|---------|
| **Problema que resuelve** | Centraliza mercados deportivos e hipicos en una terminal profesional con ejecucion segura |
| **Usuarios objetivo** | Apostadores deportivos, aficionados hipicos, operadores de casas de apuestas |
| **Propuesta de valor** | UX premium, cuotas en vivo, transacciones atomicas con Firebase, panel admin completo |
| **Estado actual** | Beta — funcional con autenticacion, apuestas y administracion |

---

## ✨ Caracteristicas

### Funcionalidades Completadas

- ✅ Autenticacion Email/Password con Firebase Auth
- ✅ Registro con nombre completo, username, cedula, telefono y fecha de nacimiento
- ✅ Recuperacion de contraseña por correo
- ✅ Dashboard de mercados deportivos en tiempo real (Firestore)
- ✅ Sistema de apuestas con cupon interactivo (BettingSlip)
- ✅ Transacciones atomicas (lectura de saldo → apuesta → descuento en una transaccion)
- ✅ Liquidacion de apuestas con pago atomico al ganador
- ✅ Billetera con historial de transacciones en tiempo real
- ✅ Panel de administracion con KPIs, gestion de usuarios y creacion de eventos
- ✅ Diseño 100% responsive (movil, tablet, desktop)
- ✅ Navegacion inferior nativa estilo Material 3 para moviles
- ✅ Logo 3D rotativo como watermark de fondo
- ✅ Animaciones fluidas con Framer Motion
- ✅ Sistema de roles (STANDARD, VIP, ADMIN)

### Limitaciones Actuales

- ⚠️ No hay pasarela de pago real (deposito/retiro son UI placeholder)
- ⚠️ Los datos de KPIs del admin son estaticos (mock)
- ⚠️ No hay sistema de notificaciones push
- ⚠️ No hay verificacion de edad real
- ⚠️ AuthContext existe pero no esta integrado globalmente (se usa prop drilling)

---

## 🛠 Stack Tecnologico

| Capa | Tecnologia | Version | Justificacion |
|------|-----------|---------|---------------|
| **UI Framework** | React | 19.0.1 | Ecosistema maduro, Server Components ready |
| **Lenguaje** | TypeScript | 5.8.2 | Type safety, mejor DX |
| **Estilos** | Tailwind CSS | 4.1.14 | Utility-first, design tokens nativos via @theme |
| **Animaciones** | Motion (Framer) | 12.23.24 | AnimatePresence, layout animations |
| **Iconos** | Lucide React | 0.546.0 | Tree-shakeable, consistente |
| **Iconos Material** | Material Symbols | CDN | Variantes fill/outlined dinamicas |
| **Backend/BaaS** | Firebase | 12.12.1 | Auth + Firestore + Hosting |
| **IA** | Google GenAI SDK | 1.29.0 | Pronosticos con IA (futuro) |
| **Bundler** | Vite | 6.2.3 | HMR ultra-rapido, ESM nativo |
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
│  └─────────┘  │MarketCards│                          │
│               └──────────┘                           │
│                    │                                 │
│                    ▼                                 │
│  ┌──────────────────────────────────┐                │
│  │      Services Layer (db.ts)      │                │
│  │  getUserProfile | placeBet       │                │
│  │  getMarkets | settleBet          │                │
│  └────────────┬─────────────────────┘                │
│               ▼                                      │
│  ┌──────────────────────────────────┐                │
│  │    Firebase SDK (lib/firebase.ts) │                │
│  └────────────┬─────────────────────┘                │
└───────────────┼──────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────┐
│              FIREBASE CLOUD (BaaS)                   │
│  ┌────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │ Firebase   │  │   Firestore    │  │  Firebase   │ │
│  │   Auth     │  │  (default DB)  │  │  Hosting    │ │
│  └────────────┘  └────────────────┘  └────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Patron:** Monolito SPA con BaaS (Backend-as-a-Service). Sin servidor propio.

---

## 🚀 Instalacion

### Pre-requisitos

| Software | Version Minima |
|----------|---------------|
| Node.js | 18.x |
| npm | 9.x |
| Git | 2.x |

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/CurielOficialll/ELGRANCESAR.git
cd ELGRANCESAR

# 2. Instalar dependencias
npm install

# 3. Configurar Firebase (ver Variables de Entorno)
# Editar firebase-applet-config.json con tus credenciales

# 4. Iniciar en modo desarrollo
npm run dev
# → Disponible en http://localhost:3000

# 5. (Opcional) Build de produccion
npm run build
npm run preview
```

### Solucion a Errores Comunes

| Error | Causa | Solucion |
|-------|-------|----------|
| `auth/operation-not-allowed` | Email/Password no habilitado | Habilitar en Firebase Console → Authentication → Providers |
| `PERMISSION_DENIED` | Reglas de Firestore expiradas | Actualizar fecha en firestore.rules y re-desplegar |
| `MODULE_NOT_FOUND` | Dependencias faltantes | Ejecutar npm install |
| Puerto 3000 ocupado | Otro proceso activo | Cambiar puerto en package.json o cerrar el proceso |

---

## 🔐 Variables de Entorno

| Variable | Descripcion | Obligatoria | Ejemplo |
|----------|-------------|:-----------:|---------|
| `GEMINI_API_KEY` | API key de Google Gemini AI | No | `AIzaSy...` |

### Configuracion de Firebase

El archivo `firebase-applet-config.json` contiene la configuracion del proyecto:

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
│   │   ├── AuthModal.tsx          # Modal de login/registro/recuperacion
│   │   ├── BettingSlip.tsx        # Cupon lateral de apuestas
│   │   ├── Footer.tsx             # Pie de pagina con enlaces legales
│   │   ├── Header.tsx             # Barra de navegacion + saldo + auth
│   │   └── MarketCards.tsx        # Tarjetas de mercados (Live + Racing)
│   ├── context/
│   │   └── AuthContext.tsx        # Context de autenticacion (preparado)
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
│   └── types.ts                   # Interfaces TypeScript
├── docs/
│   ├── TECHNICAL_DOCS.md          # Documentacion tecnica enterprise (12 secciones)
│   └── API_REFERENCE.md           # Referencia completa de API
├── firebase-applet-config.json    # Configuracion Firebase
├── firebase-blueprint.json        # Schema de entidades Firestore
├── firestore.rules                # Reglas de seguridad Firestore
├── security_spec.md               # Especificacion de seguridad
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuracion TypeScript
└── vite.config.ts                 # Configuracion Vite + Tailwind
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
│   └── createdAt: Timestamp
│   │
│   └── bets/{betId}               # Sub-coleccion de apuestas
│       ├── userId, marketId, marketName, outcomeName
│       ├── stake: number, odds: number
│       ├── payout: number | null
│       ├── status: "WON" | "PENDING" | "LOST"
│       └── createdAt: Timestamp
│
└── markets/{marketId}             # Mercados de apuestas
    ├── name, category, startTime, status
    ├── teams: Array<{name, score?, odds, logo?}>
    ├── drawOdds?: number
    └── liveTime?: string
```

### Operaciones Atomicas

Las apuestas usan `runTransaction()` de Firestore para garantizar consistencia:

1. **Colocar apuesta:** Lee saldo → valida fondos → crea bet → descuenta saldo (todo atomico)
2. **Liquidar apuesta:** Verifica status PENDING → actualiza status → si WON, acredita payout (atomico)

---

## 🧩 Componentes

| Componente | Descripcion | Props Clave |
|-----------|-------------|-------------|
| `App` | Layout raiz, router, estado global | — |
| `Header` | Nav + saldo + auth buttons | user, onLogin, onLogout, onNavigate |
| `Footer` | Links legales + copyright | — |
| `AuthModal` | Login / Registro / Recuperar | isOpen, onClose |
| `BettingSlip` | Cupon de apuestas lateral | selections, onRemove, onPlaceBet |
| `LiveMatchCard` | Tarjeta de partido en vivo | market, onSelect |
| `RacingCard` | Tarjeta de carrera hipica | market, onSelect |
| `Home` | Hero + mercados destacados | onSelectBet, onLogin |
| `Dashboard` | Mercados live + upcoming | onSelectBet, activeBetIds |
| `WalletPage` | Saldo + historial | user, onLogin |
| `AdminPage` | Panel completo de admin | — |

---

## 🔒 Seguridad

### Medidas Implementadas

- 🔒 Autenticacion via Firebase Auth (servidor de Google)
- 🔒 Transacciones atomicas previenen race conditions en saldos
- 🔒 Error handler centralizado con contexto de auth
- 🔒 Reglas de Firestore con validacion temporal
- 🔒 Input sanitization en username (solo a-z, 0-9, _)
- 🔒 Contraseña minima 6 caracteres (Firebase default)

### 12 Dirty Dozen Security Tests

Documentados en `security_spec.md` — incluyen pruebas contra: Identity Spoofing, Infinite Stakes, Ghost Odds Injection, Self-Balance Boost, Market Sabotage, Time Travel, Role Escalation, Shadow Field Injection, Document ID Poisoning, Resource Exhaustion, Negative Score, Outcome Overwrite.

---

## 📜 Scripts Disponibles

| Script | Comando | Descripcion |
|--------|---------|-------------|
| dev | `npm run dev` | Servidor de desarrollo en puerto 3000 |
| build | `npm run build` | Build de produccion con Vite |
| preview | `npm run preview` | Preview del build de produccion |
| clean | `npm run clean` | Elimina carpeta dist/ |
| lint | `npm run lint` | Type-check con TypeScript (sin emit) |

---

## ☁️ Despliegue

### Firebase Hosting

```bash
# 1. Build de produccion
npm run build

# 2. Desplegar reglas de Firestore
npx firebase-tools deploy --only firestore:rules --project elgrancesar-betting

# 3. Desplegar hosting
npx firebase-tools deploy --only hosting --project elgrancesar-betting
```

---

## 🗺 Roadmap

| Prioridad | Feature | Estado |
|:---------:|---------|--------|
| 🔴 | Pasarela de pagos (Stripe/PayPal) | Pendiente |
| 🔴 | Verificacion de identidad KYC | Pendiente |
| 🟡 | Notificaciones push (FCM) | Pendiente |
| 🟡 | Integrar AuthContext globalmente | Pendiente |
| 🟡 | Pronosticos con IA (Gemini API) | Pendiente |
| 🟢 | Sistema de toasts en vez de alert() | Pendiente |
| 🟢 | Tests E2E con Playwright | Pendiente |

---

<div align="center">

<strong>ELGRANCESAR</strong> &copy; 2026 — Todos los derechos reservados.

18+ Juega con responsabilidad.

</div>
]]>
