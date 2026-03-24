import React, { useState, useEffect } from 'react';
import { dashboardService } from '@/lib/dashboardService';
import { LoadingCard } from '../common/LoadingCard';
import { EmptyState } from '../common/EmptyState';
import { History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';

interface RecentActivityProps {
  role: string;
}

export function RecentActivity({ role }: RecentActivityProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const result = await dashboardService.getHistory(role, 5);
        setActivities(result.history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [role]);

  if (loading) return <LoadingCard />;

  if (activities.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        <EmptyState 
          icon={<History className="w-8 h-8" />}
          title="No recent activity"
          description="Your recent trip history will appear here."
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity._id} className="flex gap-4">
            <div className={`mt-1 p-2 rounded-full h-fit ${
              role === 'passenger' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
            }`}>
              {role === 'passenger' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium line-clamp-1">
                {role === 'passenger' ? `Trip to ${activity.dropoff.address}` : `Earned from trip to ${activity.dropoff.address}`}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{format(new Date(activity.tripData?.endTime || activity.createdAt), 'MMM d, h:mm a')}</span>
                <span>•</span>
                <span className="font-medium text-foreground">₹{activity.fare.finalFare || activity.fare.estimatedFare}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
