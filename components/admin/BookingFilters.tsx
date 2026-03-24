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

export type BookingFiltersValue = {
  q: string;
  status: string;
  from: string;
  to: string;
};

const BookingFilters = forwardRef<HTMLInputElement, {
  value: BookingFiltersValue;
  onChange: (next: BookingFiltersValue) => void;
  onDebouncedChange?: (next: BookingFiltersValue) => void;
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
    return value.q !== "" || value.status !== "" || value.from !== "" || value.to !== "";
  }, [value.from, value.q, value.status, value.to]);

  return (
    <div className="grid gap-3 md:grid-cols-5">
      <Input
        ref={ref}
        placeholder="Search booking id or passenger"
        value={localQ}
        onChange={(e) => {
          setLocalQ(e.target.value);
          onChange({ ...value, q: e.target.value });
        }}
        aria-label="Search bookings"
      />

      {/* Booking Status Filter - Fixed "empty string" crash */}
      <Select 
        value={value.status || "all"} 
        onValueChange={(v) => onChange({ ...value, status: v === "all" ? "" : v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="REQUESTED">Requested</SelectItem>
          <SelectItem value="ACCEPTED">Accepted</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={value.from}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
        aria-label="From date"
      />

      <Input
        type="date"
        value={value.to}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
        aria-label="To date"
      />

      <Button
        type="button"
        variant="outline"
        className="w-full md:w-auto"
        disabled={!isDirty}
        onClick={() => onChange({ q: "", status: "", from: "", to: "" })}
        aria-label="Clear all booking filters"
      >
        Clear
      </Button>
    </div>
  );
});

BookingFilters.displayName = "BookingFilters";

export default BookingFilters;