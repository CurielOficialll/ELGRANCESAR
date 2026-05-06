import { 
  db, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  getDocs,
  where,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  collectionGroup
} from '../../../infrastructure';
import { AdminLog, AdminStats, SystemConfig } from '../types/admin.types';

const LOGS_COLLECTION = 'admin_logs';

export const adminService = {
  /**
   * Log an administrative action to Firestore
   */
  async logAction(log: Omit<AdminLog, 'timestamp' | 'id'>) {
    try {
      await addDoc(collection(db, LOGS_COLLECTION), {
        ...log,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  },

  /**
   * Subscribe to recent admin logs
   */
  subscribeToLogs(callback: (logs: AdminLog[]) => void, maxLogs: number = 20) {
    try {
      const q = query(
        collection(db, LOGS_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(maxLogs)
      );

      return onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as AdminLog));
        callback(logs);
      }, (error) => {
        console.error('Error in logs subscription:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Failed to setup logs subscription:', error);
      return () => {};
    }
  },

  /**
   * Get real-time stats for the dashboard
   */
  async getDashboardStats(): Promise<AdminStats> {
    const defaultStats: AdminStats = {
      totalUsers: 0,
      activeMarkets: 0,
      totalVolume: 0,
      totalWon: 0,
      totalLost: 0
    };

    try {
      const [usersSnap, marketsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(query(collection(db, 'markets'), where('status', '==', 'LIVE')))
      ]);

      let totalVolume = 0;
      let totalWon = 0;
      let totalLost = 0;

      try {
        // Aggregation for total volume from global bets - might fail if index is missing
        const allBetsSnap = await getDocs(collectionGroup(db, 'bets'));
        allBetsSnap.forEach(doc => {
          const data = doc.data();
          const stake = parseFloat(data.stake) || 0;
          totalVolume += stake;
          if (data.status === 'WON') totalWon += parseFloat(data.payout) || 0;
          if (data.status === 'LOST') totalLost += stake;
        });
      } catch (e: any) {
        console.error('Bet aggregation failed (check Firestore indexes):', e);
        // We continue with volume=0 but show other stats
      }

      return {
        totalUsers: usersSnap.size,
        activeMarkets: marketsSnap.size,
        totalVolume,
        totalWon,
        totalLost
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return defaultStats;
    }
  },

  /**
   * Get volume trends for the last 24 hours
   */
  async getVolumeTrends(): Promise<{ hour: number, volume: number }[]> {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    try {
      const trends: { [key: number]: number } = {};
      // Initialize hours
      for (let i = 0; i < 24; i++) {
        const h = new Date(now.getTime() - i * 60 * 60 * 1000).getHours();
        trends[h] = 0;
      }

      try {
        const allBetsSnap = await getDocs(
          query(
            collectionGroup(db, 'bets'),
            where('timestamp', '>=', last24h)
          )
        );

        allBetsSnap.forEach(doc => {
          const data = doc.data();
          const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : null;
          if (timestamp) {
            const hour = timestamp.getHours();
            if (trends[hour] !== undefined) {
              trends[hour] += parseFloat(data.stake) || 0;
            }
          }
        });
      } catch (e: any) {
        console.error('Volume trends query failed (check Firestore indexes):', e);
      }

      return Object.entries(trends)
        .map(([hour, volume]) => ({ hour: parseInt(hour), volume }))
        .sort((a, b) => {
          const hA = (a.hour - now.getHours() + 24) % 24;
          const hB = (b.hour - now.getHours() + 24) % 24;
          return hA - hB;
        });
    } catch (error) {
      console.error('Error in volume trends calculation:', error);
      return [];
    }
  },

  /**
   * Promote a user to ADMIN role
   */
  async promoteToAdmin(userId: string) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: 'ADMIN' });
    } catch (error) {
      console.error('Error promoting user:', error);
      throw error;
    }
  },

  /**
   * Toggle user suspension status
   */
  async toggleUserStatus(userId: string, disabled: boolean) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { disabled });
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  /**
   * Update user balance manually
   */
  async updateUserBalance(userId: string, newBalance: number) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { walletBalance: newBalance });
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  },

  /**
   * Get all users from Firestore
   */
  async getUsers() {
    try {
      const q = query(collection(db, 'users'), orderBy('displayName', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  /**
   * Get system configuration
   */
  async getSystemConfig(): Promise<SystemConfig> {
    try {
      const configRef = doc(db, 'system_config', 'main_config');
      const snap = await getDoc(configRef);
      if (snap.exists()) {
        return snap.data() as SystemConfig;
      }
      
      const defaultConfig: SystemConfig = {
        maintenanceMode: false,
        autoSync: true,
        platformName: 'ELGRANCESAR'
      };
      await setDoc(configRef, defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('Error getting system config:', error);
      return {
        maintenanceMode: false,
        autoSync: true,
        platformName: 'ELGRANCESAR'
      };
    }
  },

  /**
   * Update system configuration
   */
  async updateSystemConfig(config: Partial<SystemConfig>) {
    try {
      const configRef = doc(db, 'system_config', 'main_config');
      await updateDoc(configRef, config);
    } catch (error) {
      console.error('Error updating system config:', error);
      throw error;
    }
  }
};
