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
import type { AdminUserListItem } from "@/types/admin";

export default function UsersTable({
  users,
  onChanged,
  isLoading,
}: {
  users: AdminUserListItem[];
  isLoading: boolean;
  onChanged: () => void;
}) {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [optimisticIsActive, setOptimisticIsActive] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState<{ by: "name" | "email" | "createdAt"; dir: "asc" | "desc" }>(
    { by: "createdAt", dir: "desc" }
  );

  const selectedIds = useMemo(() => Object.keys(selected).filter((id) => selected[id]), [selected]);
  const allSelected = users.length > 0 && selectedIds.length === users.length;

  const sortedUsers = useMemo(() => {
    const list = users.map((u) => ({
      ...u,
      isActive: optimisticIsActive[u.id] ?? u.isActive,
    }));
    const dir = sort.dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const av = (a as any)[sort.by] ?? "";
      const bv = (b as any)[sort.by] ?? "";
      return String(av).localeCompare(String(bv)) * dir;
    });
    return list;
  }, [optimisticIsActive, sort.by, sort.dir, users]);

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    for (const u of users) next[u.id] = checked;
    setSelected(next);
  };

  const exportCsv = () => {
    const header = ["id", "name", "email", "phone", "roles", "isActive", "createdAt"];
    const rows = sortedUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.phone,
      u.roles.join("|"),
      String(u.isActive),
      u.createdAt ?? "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleBlock = async (user: AdminUserListItem) => {
    try {
      setActionLoadingId(user.id);

      const optimisticNext = !user.isActive;
      setOptimisticIsActive((m) => ({ ...m, [user.id]: optimisticNext }));

      const res = await fetch(`/api/admin/users/${user.id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOptimisticIsActive((m) => {
          const next = { ...m };
          delete next[user.id];
          return next;
        });
        throw new Error(data?.message || "Failed to update user");
      }
      toast.success(user.isActive ? "User blocked" : "User unblocked");
      setOptimisticIsActive((m) => {
        const next = { ...m };
        delete next[user.id];
        return next;
      });
      onChanged();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const bulkSetActive = async (isActive: boolean) => {
    const ids = selectedIds;
    if (ids.length === 0) return;
    try {
      setActionLoadingId("__bulk__");
      await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`/api/admin/users/${id}/block`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.message || "Bulk update failed");
        })
      );
      toast.success("Bulk action completed");
      setSelected({});
      onChanged();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Bulk action failed");
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
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            aria-label="Export users to CSV"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <ConfirmDialog
            title="Block selected users?"
            description="Selected users will be prevented from using protected routes."
            confirmText="Block"
            confirmVariant="destructive"
            isLoading={actionLoadingId === "__bulk__"}
            onConfirm={() => bulkSetActive(false)}
            trigger={
              <Button size="sm" variant="destructive" disabled={selectedIds.length === 0}>
                Block selected
              </Button>
            }
          />
          <ConfirmDialog
            title="Unblock selected users?"
            description="Selected users will regain access to the app."
            confirmText="Unblock"
            confirmVariant="default"
            isLoading={actionLoadingId === "__bulk__"}
            onConfirm={() => bulkSetActive(true)}
            trigger={
              <Button size="sm" variant="secondary" disabled={selectedIds.length === 0}>
                Unblock selected
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
                aria-label="Select all users"
              />
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  setSort((s) => ({
                    by: "name",
                    dir: s.by === "name" && s.dir === "asc" ? "desc" : "asc",
                  }))
                }
                aria-label="Sort by name"
              >
                Name <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  setSort((s) => ({
                    by: "email",
                    dir: s.by === "email" && s.dir === "asc" ? "desc" : "asc",
                  }))
                }
                aria-label="Sort by email"
              >
                Email <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
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
                  <Skeleton className="h-4 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-8 w-20" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            sortedUsers.map((u) => (
              <TableRow key={u.id} data-state={selected[u.id] ? "selected" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={!!selected[u.id]}
                    onCheckedChange={(v) => setSelected((s) => ({ ...s, [u.id]: Boolean(v) }))}
                    aria-label={`Select ${u.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell className="hidden md:table-cell">{u.phone}</TableCell>
                <TableCell className="capitalize">{u.roles.join(", ")}</TableCell>
                <TableCell>
                  <StatusBadge status={u.isActive ? "ACTIVE" : "BLOCKED"} />
                </TableCell>
                <TableCell className="text-right">
                  <ConfirmDialog
                    title={u.isActive ? "Block user?" : "Unblock user?"}
                    description={
                      u.isActive
                        ? "This user will be prevented from using protected routes."
                        : "This user will regain access to the app."
                    }
                    confirmText={u.isActive ? "Block" : "Unblock"}
                    confirmVariant={u.isActive ? "destructive" : "default"}
                    isLoading={actionLoadingId === u.id}
                    onConfirm={() => toggleBlock(u)}
                    trigger={
                      <Button variant={u.isActive ? "destructive" : "secondary"} size="sm">
                        {u.isActive ? "Block" : "Unblock"}
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
