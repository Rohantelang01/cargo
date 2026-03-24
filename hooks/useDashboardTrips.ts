import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/lib/dashboardService';
import { useDashboard } from '@/context/DashboardContext';

export function useDashboardTrips(status?: string) {
  const { currentRole, isRefreshing } = useDashboard();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getTrips(currentRole, status);
      setTrips(result.trips);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, [currentRole, status]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips, isRefreshing]);

  const startJourney = async (bookingId: string) => {
    try {
      await dashboardService.startJourney(bookingId);
      fetchTrips();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const startTrip = async (bookingId: string) => {
    try {
      await dashboardService.startTrip(bookingId);
      fetchTrips();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const endTrip = async (bookingId: string) => {
    try {
      await dashboardService.endTrip(bookingId);
      fetchTrips();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { 
    trips, 
    loading, 
    error, 
    refetch: fetchTrips,
    startJourney,
    startTrip,
    endTrip
  };
}
