export interface UserProfile {
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
