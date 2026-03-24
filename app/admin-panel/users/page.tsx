"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RefreshButton from "@/components/admin/RefreshButton";

import UserFilters, { type UserFiltersValue } from "@/components/admin/UserFilters";
import UsersTable from "@/components/admin/UsersTable";
import type { AdminUserListItem, ApiListResponse } from "@/types/admin";

export default function AdminPanelUsersPage() {
  const [filters, setFilters] = useState<UserFiltersValue>({ q: "", role: "", status: "" });
  const [debouncedFilters, setDebouncedFilters] = useState<UserFiltersValue>({
    q: "",
    role: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10;
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("limit", String(limit));
    if (debouncedFilters.q) sp.set("q", debouncedFilters.q);
    if (debouncedFilters.role) sp.set("role", debouncedFilters.role);
    if (debouncedFilters.status) sp.set("status", debouncedFilters.status);
    return sp.toString();
  }, [debouncedFilters.q, debouncedFilters.role, debouncedFilters.status, limit, page]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/users?${queryString}`);
      const data = (await res.json()) as ApiListResponse<AdminUserListItem> & { message?: string };
      if (!res.ok || !data.success) {
        throw new Error((data as any)?.message || "Failed to load users");
      }
      setUsers(data.data);
      setMeta(data.meta);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load users";
      setError(msg);
      toast.error(msg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters.q, debouncedFilters.role, debouncedFilters.status]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (key === "r" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        void fetchUsers();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Search and manage users</p>
        </div>
        <RefreshButton onClick={() => void fetchUsers()} isLoading={loading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilters
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
          <Button variant="outline" size="sm" onClick={() => void fetchUsers()}>
            Retry
          </Button>
        </div>
      ) : null}

      <UsersTable users={users} isLoading={loading} onChanged={fetchUsers} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Total: {meta.total}
        </div>
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

      {loading && users.length === 0 ? (
        <div className="min-h-[20vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : null}
    </div>
  );
}
