"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MapPin, Check, Unlink, FileText } from "lucide-react";
import type { DriverOnlyResult, ILicense } from "@/types/driver";
import { useFindRide } from "@/context/FindRideContext";
import RequestConfirmModal from "@/components/find-ride/modals/RequestConfirmModal";
import WaitingScreen from "@/components/find-ride/modals/WaitingScreen";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "");
}

function formatAddress(addr: DriverResult["permanentAddress"]): string | null {
  if (!addr) return null;
  const parts = [
    addr.addressLine1,
    addr.village,
    addr.tehsil,
    addr.district,
    addr.state,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function licenseStatusColor(lic: ILicense) {
  if (!lic.isActive) return "bg-red-50 text-red-700 border-red-200";
  if (lic.expiryDate && new Date(lic.expiryDate) < new Date())
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
}

function StatusDot({ status }: { status?: string }) {
  const s = String(status || "").toUpperCase();
  const color =
    s === "AVAILABLE"
      ? "bg-emerald-500"
      : s === "ON_TRIP" || s === "SCHEDULED"
      ? "bg-amber-500"
      : "bg-muted-foreground/40";
  return <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${color}`} />;
}

// ─── License Image ─────────────────────────────────────────────────────────────

function LicenseImage({ lic }: { lic: ILicense }) {
  const [err, setErr] = useState(false);

  return (
    <div className="flex items-start gap-3">
      {/* Image or fallback */}
      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        {lic.licenseImage && !err ? (
          <Image
            src={lic.licenseImage}
            alt="License"
            fill
            className="object-cover"
            onError={() => setErr(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <FileText className="h-5 w-5" />
            <span className="text-[10px]">No image</span>
          </div>
        )}
      </div>

      {/* License details */}
      <div className="min-w-0 text-xs space-y-0.5">
        <div>
          <span className="text-muted-foreground">Type: </span>
          <span className="font-medium">{lic.licenseType}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Number: </span>
          <span className="font-medium font-mono text-[11px]">{lic.licenseNumber}</span>
        </div>
        {lic.expiryDate && (
          <div>
            <span className="text-muted-foreground">Valid till: </span>
            <span className="font-medium">
              {new Date(lic.expiryDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        <div>
          <span className="text-muted-foreground">Rate: </span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            ₹{lic.hourlyRate}/hr
          </span>
        </div>
        {/* Active / expired badge */}
        <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full border mt-1 ${licenseStatusColor(lic)}`}>
          {lic.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DriverCard({
  driver,
  selected,
}: {
  driver: DriverResult;
  selected: boolean;
}) {
  const {
    state,
    setSelectedDriver,
    requestsEnabled,
    infoSaved,
    isMounted,
    paymentMethod,
    setCurrentBookingId,
    setCurrentRequestId,
    setBookingStatus,
    linkDriverRoute,
    unlinkDriverRoute,
  } = useFindRide();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [waitingOpen, setWaitingOpen] = useState(false);

  if (!isMounted) return null;

  // DriverCard only renders driver-role users
  // isCombo = false means pure driver (no self-driven vehicle)
  if (driver.isCombo) return null;
  if (!driver.roles.includes("driver")) return null;

  // Pick the matched license — the one whose vehicleCategory matches searched vehicleType
  const matchedLicense: ILicense | undefined = useMemo(() => {
    const licenses = driver.driverInfo?.licenses ?? [];
    return (
      licenses.find(
        (l) => l.isActive && l.vehicleCategory === state.vehicleType
      ) ?? licenses.find((l) => l.isActive) ?? licenses[0]
    );
  }, [driver.driverInfo?.licenses, state.vehicleType]);

  const isLinked = state.topBar.linkedDriverId === driver.userId;
  const addressLine = formatAddress(driver.permanentAddress);

  const handleCardClick = () => {
    if (selected) setSelectedDriver(null);
    else setSelectedDriver(driver);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
        className={
          "rounded-lg border cursor-pointer transition-all duration-200 overflow-hidden " +
          (selected
            ? "border-primary shadow-sm shadow-primary/10"
            : "border-border hover:border-primary/40 hover:shadow-sm")
        }
      >
        {/* Gradient accent strip — only when selected */}
        {selected && (
          <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-primary to-violet-500" />
        )}

        <div className={"p-3 transition-colors " + (selected ? "bg-primary/5" : "hover:bg-muted/40")}>

          {/* ── Collapsed header ── */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">

              {/* Avatar */}
              <div className={
                "rounded-full p-0.5 shrink-0 " +
                (selected
                  ? "bg-gradient-to-br from-blue-500 to-violet-500"
                  : "bg-muted")
              }>
                <Avatar className="h-9 w-9 ring-1 ring-background">
                  <AvatarImage src={driver.profileImage} alt={driver.name} />
                  <AvatarFallback className="text-xs font-semibold">
                    {initials(driver.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-medium truncate">{driver.name}</span>
                  <StatusDot status={driver.driverInfo?.status} />
                </div>

                {/* License type + distance */}
                <div className="text-xs text-muted-foreground mt-0.5">
                  {matchedLicense ? matchedLicense.licenseType : "No license"}{" "}
                  · {driver.distanceAway} km away
                </div>

                {/* Rating */}
                <div className="text-xs text-muted-foreground">
                  <span className="text-amber-400">★</span>{" "}
                  {(driver.driverInfo?.rating ?? 0).toFixed(1)} ·{" "}
                  {driver.driverInfo?.totalTrips ?? 0} trips
                </div>

                {/* Badges */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                    Driver
                  </span>
                  {matchedLicense && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800">
                      {matchedLicense.licenseType}
                    </span>
                  )}
                  {matchedLicense && (
                    <Badge variant="outline" className="text-xs py-0 border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300">
                      ₹{matchedLicense.hourlyRate}/hr
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Fare + ETA + chevron */}
            <div className="text-right shrink-0">
              <div className={"text-sm font-bold " + (selected ? "text-primary" : "")}>
                ₹{driver.estimatedFare ?? "—"}
              </div>
              <div className="text-xs text-muted-foreground">~{driver.arrivalMinutes} min</div>
              {selected
                ? <ChevronUp className="h-4 w-4 text-primary mt-1 ml-auto" />
                : <ChevronDown className="h-4 w-4 text-muted-foreground mt-1 ml-auto" />
              }
            </div>
          </div>

          {/* ── Expanded section ── */}
          {selected && (
            <div
              className="mt-3 space-y-3 pt-3 border-t border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Home address — prebooking only, always permanent */}
              {addressLine && (
                <div className="flex items-start gap-1.5 rounded-md bg-muted/50 px-2.5 py-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-500" />
                  <div>
                    <span className="font-medium text-foreground">Home address: </span>
                    {addressLine}
                  </div>
                </div>
              )}

              {/* License section */}
              {matchedLicense && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Matched License
                  </p>
                  <LicenseImage lic={matchedLicense} />
                </div>
              )}

              {/* All licenses — show if driver has more than 1 */}
              {(driver.driverInfo?.licenses?.length ?? 0) > 1 && (
                <details className="group">
                  <summary className="cursor-pointer text-xs text-primary select-none list-none flex items-center gap-1">
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                    All licenses ({driver.driverInfo!.licenses.length})
                  </summary>
                  <div className="mt-2 space-y-3 pl-1">
                    {driver.driverInfo!.licenses
                      .filter((l) => l.licenseType !== matchedLicense?.licenseType)
                      .map((l) => (
                        <LicenseImage key={l.licenseType} lic={l} />
                      ))}
                  </div>
                </details>
              )}

              {/* ── LINK ROUTE BUTTON ── */}
              {requestsEnabled && infoSaved && (
                isLinked ? (
                  <div className="flex gap-2">
                    <div className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      Route Linked ✓
                    </div>
                    <button
                      onClick={() => unlinkDriverRoute()}
                      className="flex items-center gap-1 rounded-md border border-border px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                    >
                      <Unlink className="h-3.5 w-3.5" />
                      Unlink
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => linkDriverRoute(driver)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-md border border-dashed border-primary/60 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5 hover:border-primary"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Link Route
                  </button>
                )
              )}

              {/* ── SEND REQUEST BUTTON ── */}
              {requestsEnabled ? (
                infoSaved ? (
                  <Button
                    type="button"
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-600 to-primary hover:from-blue-600/90 hover:to-primary/90 text-white font-semibold shadow-sm"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Send Request
                  </Button>
                ) : null
              ) : infoSaved ? (
                <Button type="button" size="sm" className="w-full" disabled>
                  Save trip info first
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <RequestConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          const res = await fetch("/api/bookings/prebooking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              driverId: driver.userId,
              pickup: { address: state.pickup, coordinates: state.pickupCoords },
              destination: { address: state.destination, coordinates: state.destCoords },
              passengers: state.passengers,
              vehicleType: state.vehicleType,
              purpose: state.purpose,
              notes: state.notes,
              scheduledDate: state.date,
              scheduledTime: state.time,
              distanceKm: state.topBar.km,
              estimatedFare: driver.estimatedFare,
              paymentMethod,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.message || "Failed to create booking");
          setCurrentBookingId(data.booking._id);
          setCurrentRequestId(data.bookingRequest._id);
          setBookingStatus("waiting");
          setConfirmOpen(false);
          setWaitingOpen(true);
        }}
        mode="prebooking"
        driver={driver}
        tripInfo={{
          pickup: state.pickup,
          destination: state.destination,
          distanceKm: state.topBar.km ?? 0,
          durationMin: state.topBar.minutes ?? 0,
          passengers: state.passengers,
          vehicleType: state.vehicleType,
          purpose: state.purpose,
          date: state.date || undefined,
          time: state.time || undefined,
        }}
      />

      <WaitingScreen
        open={waitingOpen}
        driverName={driver.name}
        onCancel={() => {
          setWaitingOpen(false);
          setBookingStatus("idle");
          setCurrentBookingId(null);
          setCurrentRequestId(null);
        }}
        onTimeout={() => {
          setWaitingOpen(false);
          setBookingStatus("failed");
          setCurrentBookingId(null);
          setCurrentRequestId(null);
        }}
      />
    </>
  );
}