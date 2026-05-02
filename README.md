# ELGRANCESAR - Terminal de Apuestas Premium

![Version](https://img.shields.io/badge/version-1.0.0-gold?style=for-the-badge)
![Stack](https://img.shields.io/badge/React_19-Firebase-blue?style=for-the-badge)
![License](https://img.shields.io/badge/licencia-Apache_2.0-green?style=for-the-badge)
![Estado](https://img.shields.io/badge/estado-beta-orange?style=for-the-badge)

Plataforma de apuestas deportivas e hipicas de grado institucional con cuotas en tiempo real, ejecucion atomica de transacciones y diseno premium.

---

## Tabla de Contenidos

- [Descripcion General](#descripcion-general)
- [Caracteristicas](#caracteristicas)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura](#arquitectura)
- [Instalacion](#instalacion)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Componentes](#componentes)
- [Seguridad](#seguridad)
- [Scripts Disponibles](#scripts-disponibles)
- [Despliegue](#despliegue)
- [Roadmap](#roadmap)

---

## Descripcion General

**ELGRANCESAR** es una plataforma web de apuestas deportivas e hipicas premium, con cuotas en tiempo real, transacciones atomicas y un panel de administracion completo.

| Aspecto | Detalle |
|---------|---------|
| Problema que resuelve | Centraliza mercados deportivos e hipicos en una terminal profesional |
| Usuarios objetivo | Apostadores deportivos, aficionados hipicos, operadores |
| Propuesta de valor | UX premium, cuotas en vivo, transacciones atomicas con Firebase |
| Estado actual | Beta funcional con autenticacion, apuestas y administracion |

---

## Caracteristicas

**Funcionalidades Completadas:**

- Autenticacion Email/Password con Firebase Auth
- Registro con nombre completo, username, cedula, telefono y fecha de nacimiento
- Recuperacion de contrasena por correo
- Dashboard de mercados deportivos en tiempo real (Firestore)
- Sistema de apuestas con cupon interactivo (BettingSlip)
- Transacciones atomicas (lectura de saldo, apuesta, descuento en una transaccion)
- Liquidacion de apuestas con pago atomico al ganador
- Billetera con historial de transacciones en tiempo real
- Panel de administracion con KPIs, gestion de usuarios y creacion de eventos
- Diseno 100% responsive (movil, tablet, desktop)
- Navegacion inferior nativa estilo Material 3 para moviles
- Logo 3D rotativo como watermark de fondo
- Animaciones fluidas con Framer Motion
- Sistema de roles (STANDARD, VIP, ADMIN)

**Limitaciones Actuales:**

- No hay pasarela de pago real (deposito/retiro son UI placeholder)
- Los datos de KPIs del admin son estaticos (mock)
- No hay sistema de notificaciones push
- No hay verificacion de edad real

---

## Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| UI Framework | React | 19.0.1 |
| Lenguaje | TypeScript | 5.8.2 |
| Estilos | Tailwind CSS | 4.1.14 |
| Animaciones | Motion (Framer) | 12.23.24 |
| Iconos | Lucide React | 0.546.0 |
| Backend/BaaS | Firebase | 12.12.1 |
| IA | Google GenAI SDK | 1.29.0 |
| Bundler | Vite | 6.2.3 |
| Fuentes | Google Fonts | CDN |

---

## Arquitectura

Monolito SPA con BaaS (Backend-as-a-Service). Sin servidor propio.

```
CLIENTE (React SPA)
  |
  |-- Pages: Home, Dashboard, Wallet, Admin
  |-- Components: Header, Footer, AuthModal, BettingSlip, MarketCards
  |-- Hooks: useMarkets, useBets
  |
  |-- Services Layer (db.ts)
  |     getUserProfile, placeBet, getMarkets, settleBet
  |
  |-- Firebase SDK (lib/firebase.ts)
  |     Auth + Firestore + Error Handler
  |
  v
FIREBASE CLOUD
  |-- Firebase Auth (Email/Password)
  |-- Firestore (default database)
  |-- Firebase Hosting (CDN + SSL)
```

---

## Instalacion

**Pre-requisitos:** Node.js 18+, npm 9+, Git 2+

```bash
# 1. Clonar el repositorio
git clone https://github.com/CurielOficialll/ELGRANCESAR.git
cd ELGRANCESAR

# 2. Instalar dependencias
npm install

# 3. Configurar Firebase
# Editar firebase-applet-config.json con tus credenciales

# 4. Iniciar en modo desarrollo
npm run dev

# 5. (Opcional) Build de produccion
npm run build
npm run preview
```

**Errores Comunes:**

| Error | Solucion |
|-------|----------|
| auth/operation-not-allowed | Habilitar Email/Password en Firebase Console |
| PERMISSION_DENIED | Actualizar fecha en firestore.rules |
| MODULE_NOT_FOUND | Ejecutar npm install |

---

## Variables de Entorno

| Variable | Descripcion | Obligatoria |
|----------|-------------|:-----------:|
| GEMINI_API_KEY | API key de Google Gemini AI | No |

La configuracion de Firebase esta en `firebase-applet-config.json`.

---

## Estructura del Proyecto

```
ELGRANCESAR/
  public/
    logo.png
  src/
    components/
      AuthModal.tsx
      BettingSlip.tsx
      Footer.tsx
      Header.tsx
      MarketCards.tsx
    context/
      AuthContext.tsx
    data/
      mock-markets.ts
    hooks/
      useBets.ts
      useMarkets.ts
    lib/
      firebase.ts
    pages/
      Admin.tsx
      Dashboard.tsx
      Home.tsx
      Wallet.tsx
    services/
      db.ts
    App.tsx
    index.css
    main.tsx
    types.ts
  docs/
    TECHNICAL_DOCS.md
    API_REFERENCE.md
  firebase-applet-config.json
  firebase-blueprint.json
  firestore.rules
  security_spec.md
  package.json
  tsconfig.json
  vite.config.ts
```

---

## Base de Datos

**Motor:** Cloud Firestore (NoSQL, tiempo real)

**Colecciones:**

- `users/{userId}` - Perfiles de usuario (uid, email, displayName, username, role, balance)
- `users/{userId}/bets/{betId}` - Apuestas del usuario (marketId, stake, odds, status, payout)
- `markets/{marketId}` - Mercados de apuestas (name, category, status, teams, drawOdds)

**Operaciones Atomicas:**

1. **Colocar apuesta:** Lee saldo, valida fondos, crea bet, descuenta saldo (todo atomico con runTransaction)
2. **Liquidar apuesta:** Verifica status PENDING, actualiza status, si WON acredita payout (atomico)

---

## Componentes

| Componente | Descripcion |
|-----------|-------------|
| App | Layout raiz, router, estado global |
| Header | Nav + saldo + auth buttons |
| Footer | Links legales + copyright |
| AuthModal | Login / Registro / Recuperar |
| BettingSlip | Cupon de apuestas lateral |
| LiveMatchCard | Tarjeta de partido en vivo |
| RacingCard | Tarjeta de carrera hipica |
| Home | Hero + mercados destacados |
| Dashboard | Mercados live + upcoming |
| WalletPage | Saldo + historial |
| AdminPage | Panel completo de admin |

---

## Seguridad

- Autenticacion via Firebase Auth (servidor de Google)
- Transacciones atomicas previenen race conditions en saldos
- Error handler centralizado con contexto de auth
- Reglas de Firestore con validacion temporal
- Input sanitization en username (solo a-z, 0-9, _)
- Contrasena minima 6 caracteres (Firebase default)

Los 12 tests de seguridad estan documentados en `security_spec.md`.

---

## Scripts Disponibles

| Script | Comando | Descripcion |
|--------|---------|-------------|
| dev | npm run dev | Servidor de desarrollo en puerto 3000 |
| build | npm run build | Build de produccion con Vite |
| preview | npm run preview | Preview del build de produccion |
| clean | npm run clean | Elimina carpeta dist |
| lint | npm run lint | Type-check con TypeScript |

---

## Despliegue

```bash
npm run build
npx firebase-tools deploy --only firestore:rules --project elgrancesar-betting
npx firebase-tools deploy --only hosting --project elgrancesar-betting
```

---

## Roadmap

| Prioridad | Feature | Estado |
|-----------|---------|--------|
| Alta | Pasarela de pagos (Stripe/PayPal) | Pendiente |
| Alta | Verificacion de identidad KYC | Pendiente |
| Media | Notificaciones push (FCM) | Pendiente |
| Media | Integrar AuthContext globalmente | Pendiente |
| Media | Pronosticos con IA (Gemini API) | Pendiente |
| Baja | Sistema de toasts en vez de alert() | Pendiente |
| Baja | Tests E2E con Playwright | Pendiente |

---

**ELGRANCESAR** - 2026 - Todos los derechos reservados. 18+ Juega con responsabilidad.
