import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/lib/dashboardService';
import { useDashboard } from '@/context/DashboardContext';

export function useDashboardStats() {
  const { currentRole, isRefreshing } = useDashboard();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getStats(currentRole);
      setData(result.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [currentRole]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, isRefreshing]);

  return { data, loading, error, refetch: fetchStats };
}
