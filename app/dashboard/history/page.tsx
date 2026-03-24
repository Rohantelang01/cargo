"use client";

import React, { useState, useEffect } from 'react';
import { dashboardService } from "@/lib/dashboardService";
import { useDashboard } from "@/context/DashboardContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingCard } from "@/components/dashboard/common/LoadingCard";
import { ErrorState } from "@/components/dashboard/common/ErrorState";
import { EmptyState } from "@/components/dashboard/common/EmptyState";
import { History, Calendar, MapPin, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";

export default function HistoryPage() {
  const { currentRole } = useDashboard();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getHistory(currentRole, 50);
      setHistory(result.history);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentRole]);

  const filteredHistory = history.filter(trip => 
    trip.pickup?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.dropoff?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trip History</h1>
        <p className="text-muted-foreground">Review your completed trips and receipts</p>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search locations..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-secondary/20 rounded-xl animate-pulse" />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchHistory} />
      ) : filteredHistory.length === 0 ? (
        <EmptyState 
          icon={<History className="w-12 h-12" />}
          title="No history found"
          description="Your completed trips will appear here."
        />
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((trip) => (
            <Card key={trip._id} className="p-5 bg-card/50 hover:bg-card transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary rounded-lg shrink-0">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">₹{trip.fare?.finalFare || trip.fare?.estimatedFare}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(trip.tripData?.endTime || trip.createdAt), 'EEE, MMM d, h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex-1 md:px-8 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    <p className="text-sm truncate max-w-xs">{trip.pickup?.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <p className="text-sm truncate max-w-xs">{trip.dropoff?.address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                    <p className="text-sm font-medium">{trip.vehicle?.make} {trip.vehicle?.model}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                    Completed
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
