import React from 'react';
import { StatsCard } from '../common/StatsCard';
import { LoadingCard } from '../common/LoadingCard';
import { 
  Car, 
  Clock, 
  Wallet, 
  CheckCircle, 
  TrendingUp, 
  AlertCircle,
  Users,
  Calendar
} from 'lucide-react';

interface QuickStatsProps {
  stats: any;
  role: string;
}

export function QuickStats({ stats, role }: QuickStatsProps) {
  if (role === 'passenger') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Trips"
          value={stats.totalTrips || 0}
          icon={<Car className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Spent"
          value={`₹${stats.totalSpent?.toLocaleString() || 0}`}
          icon={<Wallet className="w-5 h-5" />}
          trend="up"
          subtitle="Lifetime spending"
        />
        <StatsCard
          title="Active Bookings"
          value={stats.activeBookings || 0}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          title="Upcoming Trips"
          value={stats.upcomingTrips || 0}
          icon={<Calendar className="w-5 h-5" />}
        />
      </div>
    );
  }

  if (role === 'driver') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Earnings"
          value={`₹${stats.todayEarnings?.toLocaleString() || 0}`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          subtitle="From today's trips"
        />
        <StatsCard
          title="Total Trips"
          value={stats.totalTrips || 0}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatsCard
          title="Rating"
          value={stats.rating?.toFixed(1) || '0.0'}
          icon={<AlertCircle className="w-5 h-5" />}
          subtitle="Driver rating"
        />
        <StatsCard
          title="Requests"
          value={stats.incomingRequests || 0}
          icon={<Users className="w-5 h-5" />}
          subtitle="Pending requests"
        />
      </div>
    );
  }

  if (role === 'owner') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Earnings"
          value={`₹${stats.totalEarnings?.toLocaleString() || 0}`}
          icon={<Wallet className="w-5 h-5" />}
          trend="up"
        />
        <StatsCard
          title="Total Trips"
          value={stats.totalTrips || 0}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatsCard
          title="Vehicles"
          value={stats.vehicleCount || 0}
          icon={<Car className="w-5 h-5" />}
          subtitle="Managed vehicles"
        />
        <StatsCard
          title="Requests"
          value={stats.incomingRequests || 0}
          icon={<Users className="w-5 h-5" />}
          subtitle="Pair requests"
        />
      </div>
    );
  }

  if (role === 'self-driver' || role === 'self-driver-owner') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Earnings"
          value={`₹${stats.totalEarnings?.toLocaleString() || 0}`}
          icon={<Wallet className="w-5 h-5" />}
          trend="up"
        />
        <StatsCard
          title="Total Trips"
          value={stats.totalTrips || 0}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatsCard
          title="Rating"
          value={stats.rating?.toFixed(1) || '0.0'}
          icon={<AlertCircle className="w-5 h-5" />}
          subtitle="Combined rating"
        />
        <StatsCard
          title="Requests"
          value={stats.incomingRequests || 0}
          icon={<Users className="w-5 h-5" />}
          subtitle="Incoming requests"
        />
      </div>
    );
  }

  return null;
}
