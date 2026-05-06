export interface AdminLog {
  id?: string;
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
  tag: string;
  description: string;
  meta?: string;
  timestamp: any; // Firestore Timestamp
  adminId: string;
  adminEmail: string;
}

export interface AdminStats {
  totalUsers: number;
  activeMarkets: number;
  totalVolume?: number;
  totalWon?: number;
  totalLost?: number;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  autoSync: boolean;
  lastSync?: any;
  platformName: string;
}
