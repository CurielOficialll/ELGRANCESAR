import { useState, useEffect } from 'react';
import { getBets } from '../services/bets.service';
import type { Bet } from '../types/betting.types';

/**
 * Hook to subscribe to a user's bet history in real-time.
 */
export function useBets(userId: string | undefined) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBets([]);
      setLoading(false);
      return;
    }

    const unsub = getBets(userId, (data) => {
      setBets(data.sort((a, b) => {
        const aTime = a.createdAt && 'toMillis' in a.createdAt ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt && 'toMillis' in b.createdAt ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      }));
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  const pendingBets = bets.filter(b => b.status === 'PENDING');
  const totalPending = pendingBets.reduce((acc, b) => acc + b.stake, 0);

  return { bets, pendingBets, totalPending, loading };
}
