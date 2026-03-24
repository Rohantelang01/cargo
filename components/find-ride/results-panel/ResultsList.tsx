"use client";

import { useMemo } from "react";
import { useFindRide } from "@/context/FindRideContext";
import { AnyResult } from "@/types/driver";
import { DriverCard } from "./cards/DriverCard";
import { OwnerCard } from "./cards/OwnerCard";
import { SelfDriverCard } from "./cards/SelfDriverCard";
import { PairCard } from "./cards/PairCard";

export function ResultsList() {
  const { state } = useFindRide();
  const { drivers, loading, mode, selectedDriver, filters } = state;

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-2/3" />
                <div className="flex gap-1">
                  <div className="h-5 bg-muted rounded w-16" />
                  <div className="h-5 bg-muted rounded w-20" />
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-5 bg-muted rounded w-12 ml-auto" />
                <div className="h-3 bg-muted rounded w-8 ml-auto" />
                <div className="h-4 bg-muted rounded w-6 ml-auto mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ Filter + Sort logic wrapped in useMemo
  const processedDrivers = useMemo(() => {
    // STEP 1: Mode-based base filter
    let filteredDrivers = mode === "instant" 
      ? drivers.filter(d => d.type === "selfdriver")  // Instant: ONLY selfdriver
      : drivers;  // Prebooking: ALL types initially

    // STEP 2: Type filter (UI dropdown) - ONLY for prebooking
    if (mode === "prebooking" && filters?.type !== "all") {
      filteredDrivers = filteredDrivers.filter(d => d.type === filters.type);
    }
    // Note: Instant mode ignores type filter (always selfdriver)

    // STEP 3: Status filter (UI dropdown) - BOTH modes
    if (filters?.status !== "all") {
      filteredDrivers = filteredDrivers.filter(d => {
        if (filters.status === "online") {
          return (d as any).status === "ONLINE";
        }
        if (filters.status === "available") {
          return (d as any).driverInfo?.status === "AVAILABLE";
        }
        if (filters.status === "scheduled") {
          return (d as any).driverInfo?.status === "SCHEDULED";
        }
        return true;
      });
    }

    // STEP 4: Sort (UI dropdown) - BOTH modes
    const sorted = [...filteredDrivers];
    if (filters?.sort === "nearby") {
      sorted.sort((a, b) => {
        const aDistance = a.type === "pair" ? a.driver?.distanceAway : a.distanceAway;
        const bDistance = b.type === "pair" ? b.driver?.distanceAway : b.distanceAway;
        return (aDistance ?? Infinity) - (bDistance ?? Infinity);
      });
    }
    if (filters?.sort === "cheapest") {
      sorted.sort((a, b) => (a.estimatedFare ?? Infinity) - (b.estimatedFare ?? Infinity));
    }
    if (filters?.sort === "rated") {
      sorted.sort((a, b) => {
        const aRating = a.type === "pair" ? a.driver?.driverInfo?.rating : 
                        a.type === "owner" ? a.ownerInfo?.rating : 
                        a.driverInfo?.rating;
        const bRating = b.type === "pair" ? b.driver?.driverInfo?.rating : 
                        b.type === "owner" ? b.ownerInfo?.rating : 
                        b.driverInfo?.rating;
        return (bRating ?? 0) - (aRating ?? 0);  // Descending
      });
    }

    return sorted;
  }, [drivers, mode, filters?.type, filters?.status, filters?.sort]);

  // Empty state (after filtering)
  if (processedDrivers.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-lg font-medium text-muted-foreground mb-2">
          No drivers found nearby
        </div>
        <div className="text-sm text-muted-foreground">
          {mode === "instant"
            ? "Try expanding your search area or check back later"
            : "Try adjusting your filters or search parameters"
          }
        </div>
      </div>
    );
  }
  // Render cards
  return (
    <div className="flex flex-col gap-2 p-2">
      {processedDrivers.map((item: any) => {
        // Determine if this item is selected
        const selected = (() => {
          if (!selectedDriver) return false;
          
          if (item.type === "pair") {
            return selectedDriver.type === "pair" && selectedDriver.pairId === item.pairId;
          }
          // For non-pair types, both item and selectedDriver have userId
          return selectedDriver.type === item.type && (selectedDriver as any).userId === (item as any).userId;
        })();

        // Render appropriate card based on type
        switch (item.type) {
          case "selfdriver":
            return (
              <SelfDriverCard
                key={`selfdriver-${item.userId}`}
                driver={item}
                selected={selected}
                tripInfo={item.tripInfo}
              />
            );
          case "pair":
            return (
              <PairCard
                key={`pair-${item.pairId}`}
                pair={item}
                selected={selected}
                tripInfo={item.tripInfo}
              />
            );
          case "driver":
            return (
              <DriverCard
                key={`driver-${item.userId}`}
                driver={item}
                selected={selected}
                tripInfo={item.tripInfo}
              />
            );
          case "owner":
            return (
              <OwnerCard
                key={`owner-${item.userId}-${item.vehicle?._id ?? 'no-veh'}`}
                owner={item}
                selected={selected}
                tripInfo={item.tripInfo}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
