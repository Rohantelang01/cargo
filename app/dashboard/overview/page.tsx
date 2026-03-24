"use client";

import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { QuickStats } from "@/components/dashboard/overview/QuickStats";
import { QuickActions } from "@/components/dashboard/overview/QuickActions";
import { ActiveTripsCard } from "@/components/dashboard/overview/ActiveTripsCard";
import { RecentActivity } from "@/components/dashboard/overview/RecentActivity";
import { LoadingCard } from "@/components/dashboard/common/LoadingCard";
import { ErrorState } from "@/components/dashboard/common/ErrorState";
import { useDashboard } from "@/context/DashboardContext";

export default function OverviewPage() {
  const { user } = useAuth();
  const { currentRole } = useDashboard();
  
  const { data: stats, loading, error, refetch } = useDashboardStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-[400px] bg-secondary/20 rounded-xl animate-pulse" />
          </div>
          <div className="h-[400px] bg-secondary/20 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>
          </p>
        </div>
        <QuickActions role={currentRole} />
      </div>

      <QuickStats stats={stats} role={currentRole} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveTripsCard role={currentRole} />
        </div>
        <div>
          <RecentActivity role={currentRole} />
        </div>
      </div>
    </div>
  );
}
