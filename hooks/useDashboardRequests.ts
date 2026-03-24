import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/lib/dashboardService';
import { useDashboard } from '@/context/DashboardContext';

export function useDashboardRequests(status?: string) {
  const { currentRole, isRefreshing } = useDashboard();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getRequests(currentRole, status);
      setRequests(result.requests);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [currentRole, status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, isRefreshing]);

  const respond = async (requestId: string, response: 'ACCEPTED' | 'REJECTED') => {
    try {
      await dashboardService.respondToRequest(requestId, response);
      fetchRequests(); // Refresh list after response
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { requests, loading, error, refetch: fetchRequests, respond };
}
