"use client";

import { forwardRef, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type UserFiltersValue = {
  q: string;
  role: string;
  status: string;
};

const UserFilters = forwardRef<HTMLInputElement, {
  value: UserFiltersValue;
  onChange: (next: UserFiltersValue) => void;
  onDebouncedChange?: (next: UserFiltersValue) => void;
  debounceMs?: number;
}>(({ value, onChange, onDebouncedChange, debounceMs = 300 }, ref) => {
  const [localQ, setLocalQ] = useState(value.q);

  useEffect(() => {
    setLocalQ(value.q);
  }, [value.q]);

  useEffect(() => {
    if (!onDebouncedChange) return;
    const t = window.setTimeout(() => {
      onDebouncedChange({ ...value, q: localQ });
    }, debounceMs);
    return () => window.clearTimeout(t);
  }, [debounceMs, localQ, onDebouncedChange, value]);

  const isDirty = useMemo(() => {
    return value.q !== "" || value.role !== "" || value.status !== "";
  }, [value.q, value.role, value.status]);

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input
        ref={ref}
        placeholder="Search name / email / phone"
        value={localQ}
        onChange={(e) => {
          setLocalQ(e.target.value);
          onChange({ ...value, q: e.target.value });
        }}
        aria-label="Search users"
      />

      {/* Role Filter */}
      <Select 
        // Map "" back to "all" for the UI, otherwise use the actual value
        value={value.role || "all"} 
        onValueChange={(v) => onChange({ ...value, role: v === "all" ? "" : v })}
      >
        <SelectTrigger aria-label="Filter by role">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="passenger">Passenger</SelectItem>
          <SelectItem value="driver">Driver</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select 
        value={value.status || "all"} 
        onValueChange={(v) => onChange({ ...value, status: v === "all" ? "" : v })}
      >
        <SelectTrigger aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        className="w-full md:w-auto"
        disabled={!isDirty}
        onClick={() => onChange({ q: "", role: "", status: "" })}
        aria-label="Clear all user filters"
      >
        Clear
      </Button>
    </div>
  );
});

UserFilters.displayName = "UserFilters";

export default UserFilters;