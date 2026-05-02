<![CDATA[# 📚 Documentación Técnica — ELGRANCESAR v1.0.0

> Documento generado: 2 de Mayo, 2026
> Autor: Arquitecto de Software Senior — Documentación Enterprise

---

## SECCIÓN 1: RESUMEN EJECUTIVO

### 1.1 ¿Qué es ELGRANCESAR?

ELGRANCESAR es una **Terminal de Apuestas Premium** — una aplicación web SPA (Single Page Application) que permite a los usuarios apostar en eventos deportivos e hípicos con cuotas en tiempo real. La plataforma ofrece:

- **Para apostadores:** Registro, depósito de saldo demo, selección de apuestas con cupón interactivo, seguimiento en vivo y historial completo de transacciones.
- **Para operadores:** Panel de administración con KPIs, gestión de usuarios, creación/edición de eventos y liquidación de apuestas.

### 1.2 Valor que Aporta

| Stakeholder | Valor |
|-------------|-------|
| Apostador casual | Interfaz intuitiva y premium para explorar mercados y apostar |
| Apostador VIP | Acceso a promociones y cuotas mejoradas |
| Operador | Panel admin centralizado para gestionar la plataforma |
| Desarrollador | Codebase TypeScript limpio, arquitectura extensible |

---

## SECCIÓN 2: ARQUITECTURA DETALLADA

### 2.1 Tipo de Arquitectura

**Monolito SPA + BaaS (Backend-as-a-Service)**

- No existe servidor backend propio
- Toda la lógica de negocio corre en el cliente (React)
- Firebase provee: Autenticación, Base de datos, Hosting
- Las transacciones atómicas de Firestore garantizan integridad de datos

### 2.2 Flujo de una Apuesta (End-to-End)

```
Usuario selecciona cuota → Se agrega al BettingSlip (estado local)
    → Usuario ingresa monto y confirma
    → App.handlePlaceBet() se ejecuta
    → services/db.placeBet() inicia runTransaction():
        1. Lee saldo actual del usuario (atómico)
        2. Valida que saldo >= stake
        3. Crea documento en users/{uid}/bets/
        4. Descuenta stake del balance
    → onSnapshot detecta cambio → UI se actualiza automáticamente
```

### 2.3 Flujo de Autenticación

```
Usuario hace click en "Ingresar"
    → Se abre AuthModal (isAuthOpen = true)
    → Modo login: signInWithEmailAndPassword()
    → Modo registro: createUserWithEmailAndPassword()
        → updateProfile() con displayName
        → setDoc() crea perfil en Firestore users/{uid}
    → onAuthStateChanged() detecta login
        → getUserProfile() lee perfil de Firestore
        → syncUserProfile() establece listener en tiempo real
        → setUser() actualiza estado global
```

### 2.4 Patrones de Diseño Identificados

| Patrón | Dónde se aplica | Ejemplo |
|--------|-----------------|---------|
| **Observer** | Firestore onSnapshot | `useMarkets`, `useBets`, `syncUserProfile` |
| **Repository** | `services/db.ts` | Abstrae acceso a datos de la UI |
| **Atomic Transaction** | `placeBet`, `settleBet` | Previene race conditions |
| **Provider** | `AuthContext.tsx` | Estado de auth centralizado |
| **Compound Component** | `MarketCards.tsx` | LiveMatchCard + RacingCard en mismo archivo |
| **Custom Hook** | `hooks/` | Encapsulación de lógica de suscripción |

### 2.5 Capas de la Aplicación

```
┌─────────────────────────────┐
│     Presentation Layer      │  Pages + Components
│  (React TSX + Tailwind CSS) │  Header, Footer, AuthModal
├─────────────────────────────┤
│      State Management       │  useState + onAuthStateChanged
│    (React + Firebase SDK)   │  + onSnapshot listeners
├─────────────────────────────┤
│       Service Layer         │  services/db.ts
│   (Firestore Operations)    │  CRUD + Transacciones
├─────────────────────────────┤
│     Infrastructure Layer    │  lib/firebase.ts
│      (Firebase SDK)         │  Auth + Firestore init
├─────────────────────────────┤
│        Cloud Layer          │  Firebase Auth + Firestore
│   (Google Cloud Platform)   │  + Hosting (CDN)
└─────────────────────────────┘
```

---

## SECCIÓN 3: DEPENDENCIAS DETALLADAS

### 3.1 Producción

| Paquete | Versión | Propósito | Crítico |
|---------|---------|-----------|:-------:|
| `react` | ^19.0.1 | Framework UI principal | ✅ |
| `react-dom` | ^19.0.1 | Renderizado DOM | ✅ |
| `firebase` | ^12.12.1 | Auth + Firestore + SDK completo | ✅ |
| `motion` | ^12.23.24 | Animaciones (AnimatePresence, layout) | ⚠️ |
| `lucide-react` | ^0.546.0 | Librería de iconos SVG | ⚠️ |
| `@google/genai` | ^1.29.0 | SDK de Google Gemini AI | ❌* |

> *No se usa actualmente. Reservado para pronósticos con IA.

### 3.2 Desarrollo

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `vite` | ^6.2.3 | Bundler y servidor de desarrollo |
| `tailwindcss` | ^4.1.14 | Framework CSS utility-first |
| `@tailwindcss/vite` | ^4.1.14 | Plugin de Tailwind para Vite |
| `@vitejs/plugin-react` | ^5.0.4 | JSX transform + Fast Refresh |
| `typescript` | ~5.8.2 | Type-checking |
| `autoprefixer` | ^10.4.21 | Prefijos CSS automáticos |
| `dotenv` | ^17.2.3 | Variables de entorno en dev |
| `tsx` | ^4.21.0 | Ejecución de TypeScript en Node |
| `express` | ^4.21.2 | Servidor (no usado actualmente) |
| `@types/express` | ^4.17.21 | Types para Express |
| `@types/node` | ^22.14.0 | Types para Node.js |

---

## SECCIÓN 4: DESIGN SYSTEM

### 4.1 Paleta de Colores — "Imperial Prestige"

| Token | Hex | Uso |
|-------|-----|-----|
| `surface-dim` | `#101415` | Fondo principal |
| `surface-container` | `#1d2022` | Contenedores de tarjetas |
| `surface-container-highest` | `#323537` | Bordes y headers |
| `on-surface` | `#e0e3e5` | Texto principal |
| `on-surface-variant` | `#c6c6cd` | Texto secundario |
| `secondary` | `#e9c349` | **Dorado** — Acciones principales, CTA |
| `tertiary` | `#4edea3` | **Verde** — En vivo, ganancias, éxito |
| `error` | `#ffb4ab` | Errores, pérdidas |
| `primary` | `#bec6e0` | Azul claro — Acentos sutiles |

### 4.2 Tipografía

| Token | Fuente | Uso |
|-------|--------|-----|
| `font-sans` | Inter | Texto general, body |
| `font-lexend` | Lexend | Títulos, headings, branding |
| `font-mono` | Space Grotesk | Labels, badges, datos numéricos |

### 4.3 Animaciones CSS Personalizadas

| Clase | Descripción | Duración |
|-------|-------------|----------|
| `.logo-rotate-y` | Rotación 3D del logo en eje Y | 20s linear infinite |
| `.ripple-btn` | Efecto ripple Material al hacer click | 0.4s ease-out |
| `.scrollbar-hide` | Oculta scrollbar en WebKit y Firefox | — |
| `.pb-safe` | Padding bottom safe area (iPhone notch) | — |

---

## SECCIÓN 5: MODELOS DE DATOS

### 5.1 UserProfile

```typescript
interface UserProfile {
  uid: string;           // Firebase Auth UID
  email: string;         // Correo del usuario
  displayName: string;   // Nombre completo
  username?: string;     // @username (solo minúsculas, números, _)
  role: 'STANDARD' | 'VIP' | 'ADMIN';
  balance: number;       // Saldo actual en USD
  cedula?: string;       // Documento de identidad
  phone?: string;        // Número telefónico
  birthDate?: string;    // Fecha de nacimiento (YYYY-MM-DD)
}
```

### 5.2 BettingMarket

```typescript
interface BettingMarket {
  id: string;            // Auto-generado por Firestore
  name: string;          // "Arsenal vs Chelsea"
  category: string;      // "Premier League"
  startTime: Timestamp;  // Hora de inicio del evento
  status: MarketStatus;  // LIVE | UPCOMING | FINISHED | SETTLED | SUSPENDED
  teams: {
    name: string;
    score?: number;      // Solo en LIVE
    odds: number;        // Cuota decimal
    logo?: string;       // Código o URL
  }[];
  drawOdds?: number;     // Cuota de empate (deportes)
  liveTime?: string;     // Minuto del partido (ej: "68'")
}
```

### 5.3 Bet

```typescript
interface Bet {
  id?: string;           // Auto-generado
  userId: string;        // UID del apostador
  marketId: string;      // ID del mercado
  marketName: string;    // Nombre del evento
  outcomeName: string;   // "Arsenal" | "Empate" | "Chelsea"
  stake: number;         // Monto apostado
  odds: number;          // Cuota al momento de apostar
  payout: number | null; // Ganancia (null si PENDING)
  status: 'WON' | 'PENDING' | 'LOST';
  createdAt: Timestamp;  // Fecha de creación (serverTimestamp)
}
```

---

## SECCIÓN 6: SERVICIOS (db.ts)

| Función | Tipo | Descripción |
|---------|------|-------------|
| `getUserProfile(uid)` | GET | Lee perfil por UID (getDoc) |
| `syncUserProfile(uid, cb)` | SUBSCRIBE | Listener en tiempo real del perfil |
| `createProfile(profile)` | WRITE | Crea perfil con serverTimestamp |
| `getMarkets(cb)` | SUBSCRIBE | Listener en tiempo real de todos los mercados |
| `placeBet(userId, bet)` | TRANSACTION | Apuesta atómica (lee saldo → crea bet → descuenta) |
| `getBets(userId, cb)` | SUBSCRIBE | Listener del historial de apuestas del usuario |
| `createMarket(market)` | CREATE | Crea nuevo mercado (admin) |
| `settleBet(userId, betId, status, payout)` | TRANSACTION | Liquida apuesta (si WON, acredita payout atómicamente) |

---

## SECCIÓN 7: REGLAS DE FIRESTORE

```javascript
rules_version='2'
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 6, 1);
    }
  }
}
```

> ⚠️ **ADVERTENCIA:** Las reglas actuales son **abiertas con expiración**. Antes de producción, se deben implementar las reglas del `security_spec.md` que validan roles, ownership y campos.

---

## SECCIÓN 8: GUÍA PARA DESARROLLADORES

### 8.1 Agregar un Nuevo Componente

1. Crear archivo en `src/components/NuevoComponente.tsx`
2. Usar tokens de Tailwind del `@theme` (no colores hardcodeados)
3. Tipar props con interface TypeScript
4. Importar iconos de `lucide-react`
5. Si necesita animación, usar `motion` de `motion/react`

### 8.2 Agregar un Nuevo Endpoint/Servicio

1. Agregar función en `src/services/db.ts`
2. Usar `handleFirestoreError()` en catch blocks
3. Para operaciones que modifican saldo: usar `runTransaction()`
4. Para lecturas en tiempo real: usar `onSnapshot()`

### 8.3 Agregar una Nueva Página

1. Crear en `src/pages/NuevaPagina.tsx`
2. Registrar ruta en `src/App.tsx` (bloque de `currentPage`)
3. Agregar botón en el nav móvil (línea ~202 de App.tsx)
4. Agregar botón en el nav desktop del Header

### 8.4 Convenciones

| Aspecto | Convención |
|---------|-----------|
| Nombres de archivo | PascalCase para componentes, camelCase para utils |
| Nombres de funciones | camelCase |
| Interfaces | PascalCase, sin prefijo I |
| CSS | Tailwind utilities, tokens del `@theme` |
| Commits | Español, descriptivos |
| Comentarios | JSDoc para funciones públicas |

---

## SECCIÓN 9: MONITOREO Y MANTENIMIENTO

### 9.1 Logs

- **Errores de Firestore:** Se logean automáticamente via `handleFirestoreError()` con contexto completo (userId, email, operationType, path)
- **Errores de Auth:** Se logean en consola con `err.code` y `err.message`
- **Formato:** JSON estructurado en `console.error`

### 9.2 Métricas Clave a Vigilar

| Métrica | Herramienta | Umbral de Alerta |
|---------|------------|-------------------|
| Firestore reads/day | Firebase Console | >50k (plan gratuito) |
| Auth sign-ins/day | Firebase Console | Anomalías de 10x+ |
| Hosting bandwidth | Firebase Console | >10GB/mes (plan gratuito) |
| Error rate en consola | Browser DevTools | >1% de operaciones |

### 9.3 Escalabilidad

| Cuello de Botella | Mitigación |
|-------------------|-----------|
| Firestore reads | Implementar caché local con `getDocFromCache()` |
| Bundle size | Code-splitting por ruta con `React.lazy()` |
| Imágenes de admin | CDN externo (actualmente Unsplash) |
| Props drilling | Migrar a AuthContext global |

---

## SECCIÓN 10: CHANGELOG

### v1.0.0 — Beta (Mayo 2026)

**✨ Features:**
- Sistema de autenticación completo (Email/Password)
- Registro con username, cédula, teléfono, fecha de nacimiento
- Dashboard de mercados deportivos en tiempo real
- Sistema de apuestas con transacciones atómicas
- Billetera con historial en tiempo real
- Panel de administración con KPIs y gestión de eventos
- Diseño responsive completo (Mobile-first)
- Logo 3D rotativo como watermark
- Navegación móvil estilo Material 3

**🔧 Infraestructura:**
- Migración a proyecto Firebase dedicado (`elgrancesar-betting`)
- Firestore default database
- Reglas de seguridad desplegadas
- Build optimizado con Vite 6

---

## SECCIÓN 11: GLOSARIO

| Término | Definición |
|---------|-----------|
| **BaaS** | Backend-as-a-Service — Firebase provee backend sin servidor propio |
| **Cuota (Odds)** | Multiplicador decimal que determina la ganancia potencial |
| **Stake** | Monto apostado por el usuario |
| **Payout** | Ganancia total = stake × odds |
| **Mercado** | Un evento deportivo o carrera disponible para apostar |
| **Liquidación** | Proceso de resolver una apuesta como WON o LOST |
| **runTransaction** | Operación atómica de Firestore que garantiza consistencia |
| **onSnapshot** | Listener de Firestore que recibe cambios en tiempo real |
| **SPA** | Single Page Application — toda la UI se renderiza en cliente |

---

## SECCIÓN 12: CONTACTO Y SOPORTE

| Canal | Detalles |
|-------|---------|
| **Repositorio** | GitHub — ELGRANCESAR |
| **Proyecto Firebase** | `elgrancesar-betting` |
| **Firebase Console** | `console.firebase.google.com/project/elgrancesar-betting` |

---

*Documentación generada por Antigravity — Arquitecto de Software Senior*
*Última actualización: Mayo 2, 2026*
]]>
