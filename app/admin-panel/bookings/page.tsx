"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RefreshButton from "@/components/admin/RefreshButton";

import BookingFilters, { type BookingFiltersValue } from "@/components/admin/BookingFilters";
import BookingsTable from "@/components/admin/BookingsTable";
import type { AdminBookingListItem, ApiListResponse } from "@/types/admin";

export default function AdminPanelBookingsPage() {
  const [filters, setFilters] = useState<BookingFiltersValue>({
    q: "",
    status: "",
    from: "",
    to: "",
  });
  const [debouncedFilters, setDebouncedFilters] = useState<BookingFiltersValue>({
    q: "",
    status: "",
    from: "",
    to: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10;
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [bookings, setBookings] = useState<AdminBookingListItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("limit", String(limit));
    if (debouncedFilters.q) sp.set("q", debouncedFilters.q);
    if (debouncedFilters.status) sp.set("status", debouncedFilters.status);
    if (debouncedFilters.from) sp.set("from", debouncedFilters.from);
    if (debouncedFilters.to) sp.set("to", debouncedFilters.to);
    return sp.toString();
  }, [debouncedFilters.from, debouncedFilters.q, debouncedFilters.status, debouncedFilters.to, limit, page]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/bookings?${queryString}`);
      const data = (await res.json()) as ApiListResponse<AdminBookingListItem> & { message?: string };
      if (!res.ok || !data.success) {
        throw new Error((data as any)?.message || "Failed to load bookings");
      }
      setBookings(data.data);
      setMeta(data.meta);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load bookings";
      setError(msg);
      toast.error(msg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters.q, debouncedFilters.status, debouncedFilters.from, debouncedFilters.to]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && key === "r") {
        e.preventDefault();
        void fetchBookings();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fetchBookings]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-sm text-muted-foreground">Review and manage bookings</p>
        </div>
        <RefreshButton onClick={() => void fetchBookings()} isLoading={loading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingFilters
            ref={searchRef}
            value={filters}
            onChange={setFilters}
            onDebouncedChange={setDebouncedFilters}
          />
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-3">
          <div>{error}</div>
          <Button variant="outline" size="sm" onClick={() => void fetchBookings()}>
            Retry
          </Button>
        </div>
      ) : null}

      <BookingsTable bookings={bookings} isLoading={loading} onChanged={fetchBookings} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Total: {meta.total}</div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <div className="text-sm">
            Page {meta.page} / {meta.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="min-h-[20vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : null}
    </div>
  );
}
