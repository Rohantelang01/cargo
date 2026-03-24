"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { BookingStatus, AnyResult, FindRideState, PrebookingPair, TopBarState } from "@/types/driver";

type FindRideContextValue = {
  state: FindRideState;
  requestsEnabled: boolean;
  setRequestsEnabled: (v: boolean) => void;
  infoSaved: boolean;
  setInfoSaved: (v: boolean) => void;
  selectedPairs: PrebookingPair[];
  availablePairs: PrebookingPair[];
  bookingStatus: BookingStatus;
  paymentMethod: 'WALLET' | 'CASH';
  currentBookingId: string | null;
  currentRequestId: string | null;
  addPair: (pair: PrebookingPair) => void;
  removePair: (pairId: string) => void;
  clearPairs: () => void;
  setBookingStatus: (status: BookingStatus) => void;
  setPaymentMethod: (method: 'WALLET' | 'CASH') => void;
  setCurrentBookingId: (id: string | null) => void;
  setCurrentRequestId: (id: string | null) => void;
  setMode: (mode: FindRideState["mode"]) => void;
  setPickup: (pickup: string) => void;
  setDestination: (destination: string) => void;
  setPickupCoords: (coords: FindRideState["pickupCoords"]) => void;
  setDestCoords: (coords: FindRideState["destCoords"]) => void;
  setPassengers: (passengers: number) => void;
  setVehicleType: (vehicleType: string) => void;
  setPurpose: (purpose: string) => void;
  setNotes: (notes: string) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setSelectedDriver: (driver: AnyResult | null) => void;
  setLinkedDriverId: (id: string | null) => void;
  linkDriverRoute: (driver: AnyResult) => void;
  unlinkDriverRoute: () => void;
  setFilter: (key: keyof FindRideState["filters"], value: string) => void;
  fetchDrivers: (opts?: { resetTopBar?: boolean }) => Promise<void>;
  recalcTopBar: (opts?: { forceCost?: boolean }) => void;
  resetTopBar: () => void;
  saveDraftToLocalStorage: () => void;
  isMounted: boolean;
};

const FindRideContext = createContext<FindRideContextValue | undefined>(undefined);

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function round1(n: number) { return Math.round(n * 10) / 10; }
function computeMinutesFromKm(km: number) { return Math.round((km / 40) * 60); }

const EMPTY_TOPBAR: TopBarState = {
  km: null,
  minutes: null,
  cost: null,
  driverRate: undefined,
  ownerRate: undefined,
  platformFee: undefined,
  pickupReturnCharge: undefined,
  driverPickupDistance: undefined,
  tripHours: undefined,
  hourlyRate: undefined,
  perKmRate: undefined,
  linkedDriverId: null,
};

export function FindRideProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [requestsEnabled, setRequestsEnabled] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);
  const [selectedPairs, setSelectedPairs] = useState<PrebookingPair[]>([]);
  const [availablePairs, setAvailablePairs] = useState<PrebookingPair[]>([]);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CASH'>('WALLET');
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  const [state, setState] = useState<FindRideState>({
    mode: "instant",
    pickup: "",
    destination: "",
    pickupCoords: null,
    destCoords: null,
    passengers: 1,
    vehicleType: "",
    purpose: "",
    notes: "",
    date: "",
    time: "",
    selectedDriver: null,
    linkedDriverId: null,
    filters: { type: "all", sort: "nearby", status: "online", vehicle: "all" },
    topBar: EMPTY_TOPBAR,
    drivers: [],
    loading: false,
  });

  useEffect(() => { setIsMounted(true); }, []);

  const resetTopBar = useCallback(() => {
    setState((s) => ({ ...s, topBar: EMPTY_TOPBAR }));
  }, []);

  const recalcTopBar = useCallback((opts?: { forceCost?: boolean }) => {
    setState((s) => {
      if (!s.pickupCoords || !s.destCoords) {
        return { ...s, topBar: EMPTY_TOPBAR };
      }
      const km = haversine(
        s.pickupCoords.lat, s.pickupCoords.lng,
        s.destCoords.lat, s.destCoords.lng
      );
      const minutes = computeMinutesFromKm(km);
      let cost: number | null = null;
      if (s.selectedDriver && (opts?.forceCost || true)) {
        const rate = s.selectedDriver.vehicle?.perKmRate;
        if (typeof rate === "number" && Number.isFinite(rate)) cost = Math.round(km * rate);
      }
      return {
        ...s,
        topBar: {
          ...s.topBar,
          km: round1(km),
          minutes,
          cost,
          // Clear breakdown when recalculating without a linked driver
          ...(s.topBar.linkedDriverId ? {} : {
            driverRate: undefined,
            ownerRate: undefined,
            platformFee: undefined,
            pickupReturnCharge: undefined,
            driverPickupDistance: undefined,
            tripHours: undefined,
            hourlyRate: undefined,
            perKmRate: undefined,
            linkedDriverId: null,
          }),
        },
      };
    });
  }, []);

  // ─── linkDriverRoute ────────────────────────────────────────────
  // Called when passenger clicks "Link Route" on a driver card.
  // Calculates full fare breakdown including pickup/return charge.
  //
  // Fare formula:
  //   driverRate        = hourlyRate × tripHours
  //   ownerRate         = perKmRate × tripKm
  //   platformFee       = ₹1 × tripKm
  //   pickupReturnCharge = driverPickupDistance × ₹1 × 2
  //   total             = driverRate + ownerRate + platformFee + pickupReturnCharge
  const linkDriverRoute = useCallback((driver: AnyResult) => {
    console.log("🚀 linkDriverRoute called with:", driver);
    console.log("📝 Driver type:", driver.type);
    
    setState((s) => {
      if (!s.pickupCoords) return s;

      const tripKm = s.topBar.km ?? 0;
      const tripMinutes = s.topBar.minutes ?? 0;
      const tripHours = tripMinutes / 60;

      // hourlyRate from first active license
      let activeLicense = null;
      let hourlyRate = 0;
      
      if (driver.type === 'driver' || driver.type === 'selfdriver') {
        activeLicense = driver.driverInfo?.licenses?.find((l) => l.isActive !== false)
          ?? driver.driverInfo?.licenses?.[0];
        hourlyRate = Number(activeLicense?.hourlyRate ?? 0);
      } else if (driver.type === 'pair') {
        // 🔥 FIX: Handle pair type - get driver license from pair.driver
        activeLicense = driver.driver?.driverInfo?.licenses?.find((l) => l.isActive !== false)
          ?? driver.driver?.driverInfo?.licenses?.[0];
        hourlyRate = Number(activeLicense?.hourlyRate ?? 0);
        console.log("👥 Pair hourly rate:", hourlyRate, "from license:", activeLicense);
      }

      // perKmRate from vehicle
      let perKmRate = 0;
      if (driver.type === 'owner' || driver.type === 'selfdriver') {
        perKmRate = Number(driver.vehicle?.perKmRate ?? 0);
      } else if (driver.type === 'pair') {
        // 🔥 FIX: Handle pair type - get vehicle from pair.owner
        perKmRate = Number(driver.owner?.vehicle?.perKmRate ?? 0);
        console.log("🚙 Pair perKmRate:", perKmRate, "from vehicle:", driver.owner?.vehicle);
      }

      // Pickup/Return charge:
      // Use driver permanentAddress if available, else currentLocation
      let driverCoords = null;
      if (driver.type === 'driver') {
        driverCoords = driver.permanentAddress?.coordinates;
      } else if (driver.type === 'selfdriver') {
        driverCoords = driver.permanentAddress?.coordinates ?? driver.currentLocation;
      } else if (driver.type === 'owner') {
        driverCoords = driver.permanentAddress?.coordinates;
      } else if (driver.type === 'pair') {
        // 🔥 FIX: Handle pair type - get driver and owner coordinates
        driverCoords = driver.driver?.permanentAddress?.coordinates;
        console.log("🚗 Pair driver coords:", driverCoords);
        console.log("🏠 Pair owner coords:", driver.owner?.permanentAddress?.coordinates);
      }
      
      let pickupReturnCharge = 0;
      let driverPickupDistance = 0;

      if (driver.type === 'pair') {
        // 🔥 FIX: For PAIR, use the same calculation as card for consistency
        // Card uses: driver.distanceAway + owner.distanceAway
        const driverDistanceAway = driver.driver?.distanceAway || 0;
        const ownerDistanceAway = driver.owner?.distanceAway || 0;
        
        // Use the same values that card uses for perfect consistency
        driverPickupDistance = round1(driverDistanceAway + ownerDistanceAway);
        pickupReturnCharge = Math.round(driverPickupDistance * 1 * 2);
        
        console.log("📍 Pair pickup distance (using card values):");
        console.log("  Card driver.distanceAway:", driverDistanceAway, "km");
        console.log("  Card owner.distanceAway:", ownerDistanceAway, "km");
        console.log("  Total Pickup Distance:", driverPickupDistance, "km");
        console.log("  Pickup Return Charge:", pickupReturnCharge, "₹");
        
        // 🔍 DEBUG: Also show our manual calculation for verification
        const driverCoords = driver.driver?.permanentAddress?.coordinates;
        const ownerCoords = driver.owner?.permanentAddress?.coordinates;
        
        if (driverCoords && ownerCoords && s.pickupCoords) {
          const leg1 = round1(
            haversine(
              driverCoords.lat, driverCoords.lng,
              ownerCoords.lat, ownerCoords.lng
            )
          );
          
          const leg2 = round1(
            haversine(
              ownerCoords.lat, ownerCoords.lng,
              s.pickupCoords.lat, s.pickupCoords.lng
            )
          );
          
          const manualCalculation = leg1 + leg2;
          console.log("� Manual calculation verification:");
          console.log("  Leg 1 (Driver → Owner):", leg1, "km");
          console.log("  Leg 2 (Owner → Pickup):", leg2, "km");
          console.log("  Manual total:", manualCalculation, "km");
          console.log("  Difference from card:", Math.abs(manualCalculation - driverPickupDistance), "km");
        }
      } else if (driverCoords && s.pickupCoords) {
        // For non-pair types, use direct driver → pickup
        driverPickupDistance = round1(
          haversine(
            driverCoords.lat,
            driverCoords.lng,
            s.pickupCoords.lat,
            s.pickupCoords.lng
          )
        );
        pickupReturnCharge = Math.round(driverPickupDistance * 1 * 2);
        console.log("📍 Direct pickup distance:", driverPickupDistance, "km");
        console.log("📍 Pickup Return Charge:", pickupReturnCharge, "₹");
      }

      const driverRate = Math.round(hourlyRate * tripHours);
      const ownerRate = Math.round(perKmRate * tripKm);
      const platformFee = Math.round(1 * tripKm);
      const total = driverRate + ownerRate + platformFee + pickupReturnCharge;

      console.log("💰 Pair fare breakdown:", {
        driverRate, ownerRate, platformFee, pickupReturnCharge, total
      });

      // 🔥 FIX: Use pairId for linkedDriverId when type is pair
      const linkedId = driver.type === 'pair' ? driver.pairId : driver.userId;

      return {
        ...s,
        linkedDriverId: linkedId,
        topBar: {
          ...s.topBar,
          cost: total,
          driverRate,
          ownerRate,
          platformFee,
          pickupReturnCharge,
          driverPickupDistance,
          tripHours: round1(tripHours),
          hourlyRate,
          perKmRate,
          linkedDriverId: linkedId,
        },
      };
    });
  }, []);

  // ─── unlinkDriverRoute ──────────────────────────────────────────
  // Clears the linked driver route and resets fare breakdown
  const unlinkDriverRoute = useCallback(() => {
    setState((s) => ({
      ...s,
      linkedDriverId: null,
      topBar: {
        ...s.topBar,
        cost: null,
        driverRate: undefined,
        ownerRate: undefined,
        platformFee: undefined,
        pickupReturnCharge: undefined,
        driverPickupDistance: undefined,
        tripHours: undefined,
        hourlyRate: undefined,
        perKmRate: undefined,
        linkedDriverId: null,
      },
    }));
  }, []);

  const setMode = useCallback((mode: FindRideState["mode"]) => {
    setState((s) => ({
      ...s,
      mode,
      selectedDriver: null,
      linkedDriverId: null,
      topBar: EMPTY_TOPBAR,
      filters: { ...s.filters, status: mode === "instant" ? "online" : "all" },
    }));
    setRequestsEnabled(false);
    setInfoSaved(false);
    setSelectedPairs([]);
    setAvailablePairs([]);
    setBookingStatus('idle');
    setCurrentBookingId(null);
    setCurrentRequestId(null);
  }, []);

  const addPair = useCallback((pair: PrebookingPair) => {
    setSelectedPairs((prev) => {
      if (prev.some((p) => p.pairId === pair.pairId)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, pair];
    });
  }, []);

  const removePair = useCallback((pairId: string) => {
    setSelectedPairs((prev) => prev.filter((p) => p.pairId !== pairId));
  }, []);

  const clearPairs = useCallback(() => {
    setSelectedPairs([]);
  }, []);

  const setPickup    = useCallback((pickup: string) => setState((s) => ({ ...s, pickup })), []);
  const setDestination = useCallback((destination: string) => setState((s) => ({ ...s, destination })), []);
  const setPickupCoords = useCallback((pickupCoords: FindRideState["pickupCoords"]) => setState((s) => ({ ...s, pickupCoords })), []);
  const setDestCoords   = useCallback((destCoords: FindRideState["destCoords"]) => setState((s) => ({ ...s, destCoords })), []);
  const setPassengers   = useCallback((passengers: number) => setState((s) => ({ ...s, passengers })), []);
  const setVehicleType  = useCallback((vehicleType: string) => setState((s) => ({ ...s, vehicleType })), []);
  const setPurpose      = useCallback((purpose: string) => setState((s) => ({ ...s, purpose })), []);
  const setNotes        = useCallback((notes: string) => setState((s) => ({ ...s, notes })), []);
  const setDate         = useCallback((date: string) => setState((s) => ({ ...s, date })), []);
  const setTime         = useCallback((time: string) => setState((s) => ({ ...s, time })), []);

  const setSelectedDriver = useCallback((selectedDriver: AnyResult | null) => {
    setState((s) => ({
      ...s,
      selectedDriver,
      // Clear linked route if a different driver is selected
      linkedDriverId: selectedDriver === null ? null : s.linkedDriverId,
      topBar: {
        ...s.topBar,
        cost: null,
        // Only clear breakdown if no longer linked
        ...(selectedDriver === null ? {
          driverRate: undefined, ownerRate: undefined,
          platformFee: undefined, pickupReturnCharge: undefined,
          driverPickupDistance: undefined, tripHours: undefined,
          hourlyRate: undefined, perKmRate: undefined,
          linkedDriverId: null,
        } : {}),
      },
    }));
  }, []);

  const setLinkedDriverId = useCallback((linkedDriverId: string | null) => {
    setState((s) => ({ ...s, linkedDriverId }));
  }, []);

  const setFilter = useCallback((key: keyof FindRideState["filters"], value: string) => {
    setState((s) => ({ ...s, filters: { ...s.filters, [key]: value } }));
  }, []);

  // ✅ FIXED fetchDrivers with proper validation
  const fetchDrivers = useCallback(async (opts?: { resetTopBar?: boolean }) => {
    setState((s) => ({ ...s, loading: true }));
    
    try {
      // ✅ Validation: Both pickup and destination coordinates must exist
      if (!state.pickupCoords || !state.destCoords) {
        console.warn("⚠️ Cannot fetch drivers: Both pickup and destination are required");
        setState((s) => ({ ...s, loading: false }));
        return;
      }

      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      
      const requestBody = {
        pickup: {
          lat: state.pickupCoords.lat,
          lng: state.pickupCoords.lng
        },
        destination: {
          lat: state.destCoords.lat,
          lng: state.destCoords.lng
        },
        vehicleType: state.filters.vehicle === "all" ? state.vehicleType : state.filters.vehicle,
        mode: state.mode,
        passengers: state.passengers,
        ...(state.mode === "prebooking" && {
          date: state.date,
          time: state.time,
        }),
      };

      // 🔍 Debug logs
      console.log("🚀 Fetching drivers with:", requestBody);

      const res = await fetch(`/api/find-ride`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify(requestBody),
        cache: "no-store",
      });

      const data = await res.json();
      
      // 🔍 Debug logs
      console.log("📦 API Response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch drivers");
      }

      const drivers: AnyResult[] = Array.isArray(data?.results) ? data.results : [];
      
      // 🔍 Debug logs
      console.log("✅ Drivers received:", drivers.length);
      console.log("🏷️ Driver types:", drivers.map(d => ({ type: d.type, name: d.name })));

      const pairs: PrebookingPair[] = []; // Pairs are now included in results array
      
      setState((s) => ({
        ...s,
        drivers,
        loading: false,
        ...(opts?.resetTopBar ? {
          selectedDriver: null,
          linkedDriverId: null,
          topBar: EMPTY_TOPBAR,
        } : {}),
      }));
      
      setAvailablePairs(pairs);
    } catch (error) {
      console.error("❌ Find ride fetch error:", error);
      setState((s) => ({ ...s, drivers: [], loading: false }));
      setAvailablePairs([]);
    }
  }, [
    state.pickupCoords, 
    state.destCoords, 
    state.filters.vehicle, 
    state.vehicleType, 
    state.mode, 
    state.passengers, 
    state.date, 
    state.time
  ]);

  const saveDraftToLocalStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("cargo_ride_draft", JSON.stringify({
      mode: state.mode, pickup: state.pickup, destination: state.destination,
      pickupCoords: state.pickupCoords, destCoords: state.destCoords,
      passengers: state.passengers, vehicleType: state.vehicleType,
      purpose: state.purpose, notes: state.notes, date: state.date,
      time: state.time, filters: state.filters,
      selectedDriverUserId: state.selectedDriver?.userId ?? null,
    }));
  }, [state]);

  useEffect(() => {
    if (!isMounted) return;
    if (state.pickupCoords && state.destCoords) recalcTopBar();
    else resetTopBar();
  }, [isMounted, recalcTopBar, resetTopBar, state.destCoords, state.pickupCoords]);

  useEffect(() => {
    if (!isMounted) return;
    if (state.selectedDriver && state.pickupCoords && state.destCoords) {
      recalcTopBar({ forceCost: true });
    } else {
      setState((s) => ({ ...s, topBar: { ...s.topBar, cost: null } }));
    }
  }, [isMounted, recalcTopBar, state.destCoords, state.pickupCoords, state.selectedDriver]);

  const value = useMemo<FindRideContextValue>(() => ({
    state, requestsEnabled, setRequestsEnabled,
    infoSaved, setInfoSaved,
    selectedPairs, availablePairs, bookingStatus, paymentMethod, currentBookingId, currentRequestId,
    addPair, removePair, clearPairs,
    setBookingStatus, setPaymentMethod, setCurrentBookingId, setCurrentRequestId,
    setMode, setPickup, setDestination, setPickupCoords, setDestCoords,
    setPassengers, setVehicleType, setPurpose, setNotes, setDate, setTime,
    setSelectedDriver, setLinkedDriverId, linkDriverRoute, unlinkDriverRoute,
    setFilter, fetchDrivers, recalcTopBar, resetTopBar,
    saveDraftToLocalStorage, isMounted,
  }), [
    addPair, availablePairs, bookingStatus, clearPairs,
    currentBookingId, currentRequestId, fetchDrivers,
    infoSaved, isMounted, linkDriverRoute, unlinkDriverRoute,
    paymentMethod, recalcTopBar, removePair, requestsEnabled,
    resetTopBar, saveDraftToLocalStorage, selectedPairs,
    setDate, setDestCoords, setDestination, setFilter, setLinkedDriverId,
    setMode, setNotes, setPassengers, setPickup, setPickupCoords,
    setPurpose, setSelectedDriver, setTime, setVehicleType, state,
  ]);

  return <FindRideContext.Provider value={value}>{children}</FindRideContext.Provider>;
}

export function useFindRide() {
  const ctx = useContext(FindRideContext);
  if (!ctx) throw new Error("useFindRide must be used within a FindRideProvider");
  return ctx;
}