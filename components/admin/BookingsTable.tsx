"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Download, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { AdminBookingListItem } from "@/types/admin";

export default function BookingsTable({
  bookings,
  isLoading,
  onChanged,
}: {
  bookings: AdminBookingListItem[];
  isLoading: boolean;
  onChanged: () => void;
}) {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [optimisticStatus, setOptimisticStatus] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ by: "createdAt" | "status"; dir: "asc" | "desc" }>(
    { by: "createdAt", dir: "desc" }
  );

  const selectedIds = useMemo(() => Object.keys(selected).filter((id) => selected[id]), [selected]);
  const allSelected = bookings.length > 0 && selectedIds.length === bookings.length;

  const sortedBookings = useMemo(() => {
    const list = bookings.map((b) => ({
      ...b,
      status: (optimisticStatus[b.id] as any) ?? b.status,
    }));
    const dir = sort.dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const av = (a as any)[sort.by] ?? "";
      const bv = (b as any)[sort.by] ?? "";
      return String(av).localeCompare(String(bv)) * dir;
    });
    return list;
  }, [bookings, optimisticStatus, sort.by, sort.dir]);

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    for (const b of bookings) next[b.id] = checked;
    setSelected(next);
  };

  const exportCsv = () => {
    const header = ["id", "status", "passengerName", "passengerEmail", "createdAt", "scheduledDateTime"];
    const rows = sortedBookings.map((b) => [
      b.id,
      String(b.status),
      b.passenger?.name ?? "",
      b.passenger?.email ?? "",
      b.createdAt ?? "",
      b.scheduledDateTime ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const approve = async (id: string, prevStatus: string) => {
    try {
      setActionLoadingId(id);
      setOptimisticStatus((m) => ({ ...m, [id]: "ACCEPTED" }));
      const res = await fetch(`/api/admin/bookings/${id}/approve`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) {
        setOptimisticStatus((m) => ({ ...m, [id]: prevStatus }));
        throw new Error(data?.message || "Failed to approve booking");
      }
      toast.success("Booking approved");
      setOptimisticStatus((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
      onChanged();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const reject = async (id: string, prevStatus: string) => {
    try {
      setActionLoadingId(id);
      setOptimisticStatus((m) => ({ ...m, [id]: "CANCELLED" }));
      const res = await fetch(`/api/admin/bookings/${id}/reject`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) {
        setOptimisticStatus((m) => ({ ...m, [id]: prevStatus }));
        throw new Error(data?.message || "Failed to reject booking");
      }
      toast.success("Booking rejected");
      setOptimisticStatus((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
      onChanged();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const bulkApprove = async () => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    try {
      setActionLoadingId("__bulk__");
      await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`/api/admin/bookings/${id}/approve`, { method: "PATCH" });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.message || "Bulk approve failed");
        })
      );
      toast.success("Bulk approve completed");
      setSelected({});
      onChanged();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Bulk approve failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const bulkReject = async () => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    try {
      setActionLoadingId("__bulk__");
      await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`/api/admin/bookings/${id}/reject`, { method: "PATCH" });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.message || "Bulk reject failed");
        })
      );
      toast.success("Bulk reject completed");
      setSelected({});
      onChanged();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Bulk reject failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="rounded-lg border bg-background">
      <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedIds.length > 0 ? `${selectedIds.length} selected` : ""}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv} aria-label="Export bookings to CSV">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <ConfirmDialog
            title="Approve selected bookings?"
            description="Selected bookings will be moved to ACCEPTED when possible."
            confirmText="Approve"
            confirmVariant="default"
            isLoading={actionLoadingId === "__bulk__"}
            onConfirm={bulkApprove}
            trigger={
              <Button size="sm" disabled={selectedIds.length === 0}>
                Approve selected
              </Button>
            }
          />
          <ConfirmDialog
            title="Reject selected bookings?"
            description="Selected bookings will be moved to CANCELLED when possible."
            confirmText="Reject"
            confirmVariant="destructive"
            isLoading={actionLoadingId === "__bulk__"}
            onConfirm={bulkReject}
            trigger={
              <Button size="sm" variant="destructive" disabled={selectedIds.length === 0}>
                Reject selected
              </Button>
            }
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(v) => toggleAll(Boolean(v))}
                aria-label="Select all bookings"
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="hidden md:table-cell">Passenger</TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  setSort((s) => ({
                    by: "status",
                    dir: s.by === "status" && s.dir === "asc" ? "desc" : "asc",
                  }))
                }
                aria-label="Sort by status"
              >
                Status <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  setSort((s) => ({
                    by: "createdAt",
                    dir: s.by === "createdAt" && s.dir === "asc" ? "desc" : "asc",
                  }))
                }
                aria-label="Sort by created date"
              >
                Created <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-52" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-8 w-40" />
                </TableCell>
              </TableRow>
            ))
          ) : bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                No bookings found
              </TableCell>
            </TableRow>
          ) : (
            sortedBookings.map((b) => {
              const isRequested = ["REQUESTED", "requested"].includes(String(b.status));
              return (
                <TableRow key={b.id} data-state={selected[b.id] ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={!!selected[b.id]}
                      onCheckedChange={(v) => setSelected((s) => ({ ...s, [b.id]: Boolean(v) }))}
                      aria-label={`Select booking ${b.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{b.id}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm font-medium">{b.passenger?.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{b.passenger?.email || "—"}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={String(b.status)} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <ConfirmDialog
                        title="Approve booking?"
                        description="This will move the booking to ACCEPTED."
                        confirmText="Approve"
                        confirmVariant="default"
                        isLoading={actionLoadingId === b.id}
                        onConfirm={() => approve(b.id, String(b.status))}
                        trigger={
                          <Button size="sm" disabled={!isRequested}>
                            Approve
                          </Button>
                        }
                      />
                      <ConfirmDialog
                        title="Reject booking?"
                        description="This will move the booking to CANCELLED."
                        confirmText="Reject"
                        confirmVariant="destructive"
                        isLoading={actionLoadingId === b.id}
                        onConfirm={() => reject(b.id, String(b.status))}
                        trigger={
                          <Button size="sm" variant="destructive" disabled={!isRequested}>
                            Reject
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
