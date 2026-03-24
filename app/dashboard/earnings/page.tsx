"use client";

import React, { useState, useEffect } from 'react';
import { useDashboard } from "@/context/DashboardContext";
import { dashboardService } from "@/lib/dashboardService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingCard } from "@/components/dashboard/common/LoadingCard";
import { ErrorState } from "@/components/dashboard/common/ErrorState";
import { EmptyState } from "@/components/dashboard/common/EmptyState";
import { EarningsChart } from "@/components/dashboard/earnings/EarningsChart";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EarningsPage() {
  const { currentRole } = useDashboard();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getEarnings(currentRole, period);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [currentRole, period]);

  if (loading) return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
      <div className="h-[400px] bg-secondary/20 rounded-xl animate-pulse" />
    </div>
  );

  if (error) return <ErrorState message={error} onRetry={fetchEarnings} />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">Track your income and transaction history</p>
        </div>
        <Tabs value={period} onValueChange={setPeriod} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 w-full md:w-[300px]">
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-border/50 bg-primary/5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">₹{data.totalEarnings?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Based on selected period</p>
        </Card>
        
        <Card className="p-5 border-border/50">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-muted-foreground">Withdrawable Balance</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">₹{data.generatedBalance?.toLocaleString() || 0}</p>
          <p className="text-xs text-green-600 font-medium mt-1">Ready for payout</p>
        </Card>

        <Card className="p-5 border-border/50">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{data.earnings?.length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Successful payouts</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-2">Revenue Overview</h3>
          <EarningsChart data={data.earnings} />
        </Card>

        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-6">Recent Payouts</h3>
          {data.earnings?.length === 0 ? (
            <EmptyState title="No earnings yet" description="Your income will appear here." />
          ) : (
            <div className="space-y-6">
              {data.earnings.slice(0, 5).map((t: any) => (
                <div key={t._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-full text-green-600">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(t.timestamp), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-600">+₹{t.amount}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
