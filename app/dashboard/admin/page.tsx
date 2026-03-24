"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import RefreshButton from "@/components/admin/RefreshButton";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

type AdminStats = {
  users: number;
  bookings: number;
  drivers: number;
  revenue: number;
};

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const isAdmin = useMemo(() => {
    return !!user?.roles?.includes("admin");
  }, [user?.roles]);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard/passenger");
    }
  }, [isAdmin, isLoading, router, user]);

  const fetchStats = useCallback(
    async (opts?: { silent?: boolean }) => {
      try {
        if (!opts?.silent) setStatsLoading(true);
        setStatsError(null);

        const res = await fetch("/api/admin/stats", {
          cache: "no-store",
          headers: {
            "x-admin-refresh": "1",
          },
        });

        const json = (await res.json()) as {
          success?: boolean;
          message?: string;
          data?: {
            usersCount: number;
            bookingsCount: number;
            activeDriversCount: number;
            revenue: number;
          };
        };

        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.message || "Failed to load stats");
        }

        setStats({
          users: json.data.usersCount,
          bookings: json.data.bookingsCount,
          drivers: json.data.activeDriversCount,
          revenue: json.data.revenue,
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load stats";
        setStatsError(msg);
        setStats(null);
        if (!opts?.silent) toast.error(msg);
      } finally {
        if (!opts?.silent) setStatsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!isAdmin) return;
    void fetchStats();

    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      void fetchStats({ silent: true });
    }, 30_000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchStats, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of platform activity</p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton onClick={() => void fetchStats()} isLoading={statsLoading} />
        </div>
      </div>

      {statsError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-3">
          <div>{statsError}</div>
          <Button variant="outline" size="sm" onClick={() => void fetchStats()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {statsLoading ? <Skeleton className="h-7 w-16" /> : stats?.users ?? "—"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {statsLoading ? <Skeleton className="h-7 w-16" /> : stats?.bookings ?? "—"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {statsLoading ? <Skeleton className="h-7 w-16" /> : stats?.drivers ?? "—"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {statsLoading ? <Skeleton className="h-7 w-24" /> : `₹${stats?.revenue ?? 0}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add admin pages under the sidebar routes to manage users, bookings, and drivers.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Auto-refresh is enabled (every 30 seconds).
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
