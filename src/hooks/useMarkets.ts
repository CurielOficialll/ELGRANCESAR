import { useState, useEffect } from 'react';
import { getMarkets } from '../services/db';
import { BettingMarket, MarketStatus } from '../types';

/**
 * Hook to subscribe to real-time market updates from Firestore.
 */
export function useMarkets() {
  const [markets, setMarkets] = useState<BettingMarket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = getMarkets((data) => {
      setMarkets(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const liveMatches = markets.filter(m => m.status === MarketStatus.LIVE);
  const upcomingMatches = markets.filter(m => m.status === MarketStatus.UPCOMING);

  return { markets, liveMatches, upcomingMatches, loading };
}
