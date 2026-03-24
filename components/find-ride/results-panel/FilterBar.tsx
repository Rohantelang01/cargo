"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useFindRide } from "@/context/FindRideContext";

const FILTERS = {
  sort: [
    { k: "nearby", label: "Nearby" },
    { k: "cheapest", label: "Cheapest" },
    { k: "rated", label: "Highest Rated" },
  ],
};

type FilterKey = "type" | "sort" | "status";

function DropdownColumn({
  label,
  options,
  value,
  onSelect,
  open,
  onToggle,
}: {
  label: string;
  options: { k: string; label: string }[];
  value: string;
  onSelect: (k: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const selected = options.find((o) => o.k === value);
  const isDefault = value === options[0]?.k;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="flex-1 min-w-0 relative">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-1 px-2.5 py-1.5 text-xs border rounded-md transition-colors ${
          !isDefault
            ? "border-primary bg-primary/5 text-primary font-medium"
            : "border-border bg-background hover:bg-muted text-foreground"
        }`}
      >
        <span className="truncate text-left">
          <span className={!isDefault ? "text-primary/70" : "text-muted-foreground"}>
            {label}:{" "}
          </span>
          <span>{selected?.label ?? options[0]?.label}</span>
        </span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""} ${
            !isDefault ? "text-primary" : "text-muted-foreground"
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-md overflow-hidden shadow-md">
          {options.map((o) => (
            <button
              key={o.k}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(o.k);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                value === o.k
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <span>{o.label}</span>
              {value === o.k && <Check className="h-3 w-3 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterBar() {
  const { state, setFilter, fetchDrivers, isMounted } = useFindRide();
  const [openCol, setOpenCol] = useState<FilterKey | null>(null);

  // ✅ isInstant before useEffect — no conditional hooks
  const isInstant = state.mode === "instant";

  // ✅ useEffect BEFORE early return
  useEffect(() => {
    if (!isMounted) return;
    if (!isInstant) return;
    if (state.filters.type !== "selfdriver") setFilter("type", "selfdriver");
    if (state.filters.status !== "online") setFilter("status", "online");
  }, [isInstant, isMounted, setFilter, state.filters.status, state.filters.type]);

  if (!isMounted) return null;

  const typeOptions = isInstant
    ? [{ k: "selfdriver", label: "Driver+Owner (Self-driven only)" }]
    : [
        { k: "all", label: "All" },
        { k: "selfdriver", label: "Self Driver" },
        { k: "driver", label: "Driver Only" },
        { k: "owner", label: "Owner Only" },
        { k: "pair", label: "Pair" },
      ];

  const statusOptions = isInstant
    ? [{ k: "online", label: "Online" }]
    : [
        { k: "all", label: "All" },
        { k: "online", label: "Online" },
        { k: "available", label: "Available" },
        { k: "scheduled", label: "Scheduled" },
      ];

  const toggle = (col: FilterKey) =>
    setOpenCol((prev) => (prev === col ? null : col));

  const handleSelect = async (filterKey: FilterKey, value: string) => {
    setFilter(filterKey, value);
    setOpenCol(null);
    await fetchDrivers();
  };

  const activeFilters = [
    { key: "sort", label: "Sort", value: state.filters.sort, options: FILTERS.sort },
    ...(!isInstant
      ? [
          { key: "type", label: "Type", value: state.filters.type, options: typeOptions },
          { key: "status", label: "Status", value: state.filters.status, options: statusOptions },
        ]
      : []),
  ].filter((f) => f.value !== f.options[0]?.k);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {isInstant ? (
          <div className="flex-1 min-w-0">
            <div className="w-full flex items-center gap-1 px-2.5 py-1.5 text-xs border rounded-md border-border bg-background text-foreground">
              <span className="text-muted-foreground">Type: </span>
              <span>{typeOptions[0].label}</span>
            </div>
          </div>
        ) : (
          <DropdownColumn
            label="Type"
            options={typeOptions}
            value={state.filters.type}
            open={openCol === "type"}
            onToggle={() => toggle("type")}
            onSelect={(k) => handleSelect("type", k)}
          />
        )}

        <DropdownColumn
          label="Sort"
          options={FILTERS.sort}
          value={state.filters.sort}
          open={openCol === "sort"}
          onToggle={() => toggle("sort")}
          onSelect={(k) => handleSelect("sort", k)}
        />

        {isInstant ? (
          <div className="flex-1 min-w-0">
            <div className="w-full flex items-center gap-1 px-2.5 py-1.5 text-xs border rounded-md border-border bg-background text-foreground">
              <span className="text-muted-foreground">Status: </span>
              <span>{statusOptions[0].label}</span>
            </div>
          </div>
        ) : (
          <DropdownColumn
            label="Status"
            options={statusOptions}
            value={state.filters.status}
            open={openCol === "status"}
            onToggle={() => toggle("status")}
            onSelect={(k) => handleSelect("status", k)}
          />
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {activeFilters.map((f) => {
            const selectedLabel = f.options.find((o) => o.k === f.value)?.label;
            return (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
              >
                <span className="text-primary/60">{f.label}:</span>
                <span className="font-medium">{selectedLabel}</span>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(f.key as FilterKey, f.options[0].k);
                  }}
                  className="ml-0.5 hover:opacity-60 transition-opacity leading-none"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}