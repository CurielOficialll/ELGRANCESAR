<![CDATA[# 🔌 API Reference — ELGRANCESAR v1.0.0

> Referencia completa de todas las funciones, hooks, interfaces y servicios exportados.

---

## 1. Interfaces TypeScript (`src/types.ts`)

### UserProfile
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  role: 'STANDARD' | 'VIP' | 'ADMIN';
  balance: number;
  cedula?: string;
  phone?: string;
  birthDate?: string;
}
```

### BettingMarket
```typescript
interface BettingMarket {
  id: string;
  name: string;
  category: string;
  startTime: Date | Timestamp;
  status: MarketStatus;
  teams: TeamInfo[];
  drawOdds?: number;
  liveTime?: string;
}
```

### TeamInfo
```typescript
interface TeamInfo {
  name: string;
  score?: number;
  odds: number;
  logo?: string;
}
```

### Bet
```typescript
interface Bet {
  id?: string;
  userId: string;
  marketId: string;
  marketName: string;
  outcomeName: string;
  stake: number;
  odds: number;
  payout: number | null;
  status: 'WON' | 'PENDING' | 'LOST';
  createdAt: Timestamp;
}
```

### BetSelection
```typescript
interface BetSelection {
  marketId: string;
  marketName: string;
  outcomeName: string;
  odds: number;
  matchup: string;
}
```

### MarketStatus (Enum)
```typescript
enum MarketStatus {
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
  SETTLED = 'SETTLED',
  SUSPENDED = 'SUSPENDED'
}
```

---

## 2. Servicios — `src/services/db.ts`

### getUserProfile
```typescript
getUserProfile(uid: string): Promise<UserProfile | null>
```
Lee un perfil de usuario por UID. Retorna `null` si no existe.

**Firestore Path:** `users/{uid}`
**Método:** `getDoc()`

---

### createProfile
```typescript
createProfile(profile: UserProfile): Promise<void>
```
Crea un nuevo documento de perfil. Agrega `createdAt: serverTimestamp()`.

**Firestore Path:** `users/{profile.uid}`
**Método:** `setDoc()`

---

### syncUserProfile
```typescript
syncUserProfile(uid: string, callback: (profile: UserProfile | null) => void): Unsubscribe
```
Suscripción en tiempo real al perfil del usuario. El callback se ejecuta cada vez que cambia el documento.

**Retorna:** Función `unsubscribe` para limpiar el listener.

---

### getMarkets
```typescript
getMarkets(callback: (markets: BettingMarket[]) => void): Unsubscribe
```
Suscripción en tiempo real a todos los mercados de apuestas.

**Firestore Path:** `markets/`
**Retorna:** Función `unsubscribe`.

---

### placeBet
```typescript
placeBet(userId: string, bet: Omit<Bet, 'userId' | 'createdAt' | 'status' | 'payout'>): Promise<void>
```
Coloca una apuesta usando `runTransaction()`:
1. Lee saldo actual
2. Valida saldo >= stake
3. Crea documento de bet
4. Descuenta stake del saldo

**Errores posibles:** `'Usuario no encontrado'`, `'Saldo insuficiente'`

---

### getBets
```typescript
getBets(userId: string, callback: (bets: Bet[]) => void): Unsubscribe
```
Suscripción en tiempo real al historial de apuestas del usuario.

**Firestore Path:** `users/{userId}/bets/`

---

### createMarket
```typescript
createMarket(market: Omit<BettingMarket, 'id'>): Promise<void>
```
Crea un nuevo mercado de apuestas (uso admin).

**Método:** `addDoc()` — ID auto-generado.

---

### settleBet
```typescript
settleBet(userId: string, betId: string, status: 'WON' | 'LOST', payout: number): Promise<void>
```
Liquida una apuesta usando `runTransaction()`:
1. Verifica que la apuesta existe y está PENDING
2. Actualiza status y payout
3. Si WON, acredita payout al balance

**Errores posibles:** `'Apuesta no encontrada'`, `'La apuesta ya fue liquidada'`, `'Usuario no encontrado'`

---

## 3. Custom Hooks

### useMarkets (`src/hooks/useMarkets.ts`)
```typescript
function useMarkets(): {
  markets: BettingMarket[];
  liveMatches: BettingMarket[];
  upcomingMatches: BettingMarket[];
  loading: boolean;
}
```
Suscripción automática a mercados de Firestore. Filtra por status LIVE y UPCOMING.

---

### useBets (`src/hooks/useBets.ts`)
```typescript
function useBets(userId: string | undefined): {
  bets: Bet[];
  pendingBets: Bet[];
  totalPending: number;
  loading: boolean;
}
```
Suscripción al historial de apuestas. Ordena por `createdAt` descendente. Calcula bets pendientes.

---

## 4. Firebase (`src/lib/firebase.ts`)

### Exports
```typescript
export const app: FirebaseApp;
export const auth: Auth;
export const db: Firestore;

// Re-exports de firebase/auth
export { signInWithEmailAndPassword, createUserWithEmailAndPassword };
export { updateProfile, sendPasswordResetEmail };
export { onAuthStateChanged, signOut };

// Re-exports de firebase/firestore
export { collection, query, onSnapshot };
export { setDoc, addDoc, updateDoc, doc };
export { serverTimestamp };

// Error handler
export { handleFirestoreError, OperationType };
```

### handleFirestoreError
```typescript
handleFirestoreError(error: unknown, operation: OperationType, path: string): void
```
Logger centralizado que incluye:
- Tipo de operación (GET, WRITE, CREATE, UPDATE)
- Path del documento
- Usuario actual (email, uid)
- Error original

### OperationType (Enum)
```typescript
enum OperationType {
  GET = 'GET',
  WRITE = 'WRITE',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE'
}
```

---

## 5. Context — AuthContext (`src/context/AuthContext.tsx`)

### AuthProvider
```typescript
function AuthProvider({ children }: { children: ReactNode }): JSX.Element
```
Proveedor de contexto que gestiona autenticación.

### useAuth
```typescript
function useAuth(): {
  user: UserProfile | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
}
```

> **Nota:** AuthContext existe pero no se usa globalmente. App.tsx maneja auth con estado local.

---

## 6. Componentes — Props Reference

### Header
```typescript
interface HeaderProps {
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}
```

### BettingSlip
```typescript
interface BettingSlipProps {
  selections: BetSelection[];
  onRemove: (id: string) => void;
  onPlaceBet: (stake: number) => void;
  user?: UserProfile | null;
}
```

### Home
```typescript
interface HomeProps {
  onSelectBet: (market: BettingMarket, outcome: string, odds: number) => void;
  onLogin?: () => void;
}
```

### Dashboard
```typescript
interface DashboardProps {
  onSelectBet: (market: BettingMarket, outcome: string, odds: number) => void;
  activeBetIds: string[];
}
```

### WalletPage
```typescript
interface WalletProps {
  user: UserProfile | null;
  onLogin?: () => void;
}
```

### AuthModal
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### MarketCards
```typescript
interface MarketCardProps {
  market: BettingMarket;
  onSelect: (market: BettingMarket, outcome: string, odds: number) => void;
}
```

---

*Referencia generada automáticamente del análisis de código fuente.*
*Última actualización: Mayo 2, 2026*
]]>
