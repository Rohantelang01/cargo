"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Star, FileText } from "lucide-react";
import Image from "next/image";
import { SelfDriverResult } from "@/types/driver";
import { useFindRide } from "@/context/FindRideContext";
import RequestConfirmModal from "@/components/find-ride/modals/RequestConfirmModal";
import WaitingScreen from "@/components/find-ride/modals/WaitingScreen";
import { StatusDot } from "../shared/StatusDot";
import { LicenseImage } from "../shared/LicenseImage";
import { formatAddress, initials } from "../shared/CardHelpers";

interface SelfDriverCardProps {
  driver: SelfDriverResult;
  selected: boolean;
  tripInfo?: {
    distanceKm: number;
    durationMinutes: number;
    pickupCoords: { lat: number; lng: number };
    destinationCoords: { lat: number; lng: number };
  };
}

export function SelfDriverCard({ driver, selected, tripInfo }: SelfDriverCardProps) {
  const { 
    state, 
    linkDriverRoute, 
    unlinkDriverRoute, 
    setSelectedDriver,
    requestsEnabled,
    infoSaved,
    paymentMethod,
    setCurrentBookingId,
    setCurrentRequestId,
    setBookingStatus,
    isMounted
  } = useFindRide();

  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Find matched license
  const matchedLicense = driver.driverInfo.licenses.find(l =>
    l.isActive && l.vehicleCategory === state.vehicleType
  ) ?? driver.driverInfo.licenses.find(l => l.isActive) ?? driver.driverInfo.licenses[0];

  const isLinked = state.topBar.linkedDriverId === driver.userId;

  // Address logic based on mode
  const addressDisplay = state.mode === "instant" 
    ? driver.currentLocation?.address ?? formatAddress(driver.permanentAddress)
    : formatAddress(driver.permanentAddress);
  const addressLabel = state.mode === "instant" ? "Current location" : "Home address";
  const addressColor = state.mode === "instant" ? "text-violet-500" : "text-blue-500";

  const handleCardClick = () => {
    setSelectedDriver(driver);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleLinkRoute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLinked) {
      unlinkDriverRoute();
    } else {
      linkDriverRoute(driver);
    }
  };

  const handleSendRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!infoSaved) return;
    setConfirmOpen(true);
  };

  const onConfirm = async () => {
    try {
      setBookingStatus('sending');
      setConfirmOpen(false);

      const endpoint = state.mode === "instant" ? '/api/bookings/instant' : '/api/bookings/prebooking';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          driverId: driver.userId,
          vehicleId: driver.vehicle._id,
          pickup: state.pickup,
          destination: state.destination,
          passengers: state.passengers,
          vehicleType: state.vehicleType,
          purpose: state.purpose,
          notes: state.notes,
          ...(state.mode === "prebooking" && {
            scheduledDate: state.date,
            scheduledTime: state.time
          }),
          distanceKm: state.topBar.km,
          estimatedFare: driver.estimatedFare,
          paymentMethod
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send request');
      }

      setCurrentBookingId(data.bookingId);
      setCurrentRequestId(data.requestId);
      setBookingStatus('waiting');
    } catch (error) {
      console.error('Error sending request:', error);
      setBookingStatus('failed');
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <div
        className={`relative bg-card border rounded-lg transition-all cursor-pointer ${
          selected ? 'ring-2 ring-primary' : 'hover:border-primary/50'
        }`}
        onClick={handleCardClick}
      >
        {/* Selection gradient ring */}
        {selected && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-violet-500 to-red-500 opacity-10 pointer-events-none" />
        )}

        {/* Collapsed Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className={`relative h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-red-500 flex items-center justify-center text-white font-semibold ${
              selected ? 'ring-2 ring-offset-2' : ''
            }`}>
              {initials(driver.name)}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{driver.name}</h3>
                <StatusDot status={driver.driverInfo.status} />
              </div>
              
              <div className="text-sm text-muted-foreground">
                {driver.vehicle.make} {driver.vehicle.model} · {driver.distanceAway} km away
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current" />
                <span>{driver.driverInfo.rating}</span>
                <span>·</span>
                <span>{driver.driverInfo.totalTrips} trips</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-800 rounded">
                  Self Driver
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {matchedLicense?.licenseType}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-sky-100 text-sky-800 rounded">
                  {driver.vehicle.vehicleType}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                  ₹{matchedLicense?.hourlyRate}/hr
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                  ₹{driver.vehicle.perKmRate}/km
                </span>
              </div>
            </div>

            {/* Right Side */}
            <div className="text-right">
              <div className="font-semibold text-lg">₹{driver.estimatedFare}</div>
              <div className="text-sm text-muted-foreground">{driver.arrivalMinutes} min</div>
              <button
                onClick={handleExpandClick}
                className="mt-1 p-1 hover:bg-muted rounded"
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {(expanded || selected) && (
          <div className="border-t bg-muted/30 p-4 space-y-4" onClick={handleExpandClick}>
            {/* Address Row */}
            <div className="flex items-start gap-2">
              <MapPin className={`h-4 w-4 mt-0.5 ${addressColor.replace('text', 'text')}`} />
              <div>
                <div className={`text-sm font-medium ${addressColor}`}>{addressLabel}</div>
                <div className="text-sm text-muted-foreground">
                  {addressDisplay || 'No address provided'}
                </div>
              </div>
            </div>

            {/* DRIVER Section */}
            <div className="border-l-2 border-blue-500 pl-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="text-sm font-medium">Driver</div>
              </div>
              <LicenseImage lic={matchedLicense} />
              
              {/* All Licenses (if multiple) */}
              {driver.driverInfo.licenses.length > 1 && (
                <details className="group mt-2">
                  <summary className="cursor-pointer text-sm font-medium hover:text-primary">
                    All licenses ({driver.driverInfo.licenses.length})
                  </summary>
                  <div className="mt-2 space-y-2">
                    {driver.driverInfo.licenses.map((license, index) => (
                      <LicenseImage key={index} lic={license} />
                    ))}
                  </div>
                </details>
              )}
            </div>

            {/* VEHICLE Section */}
            <div className="border-l-2 border-red-500 pl-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="text-sm font-medium">Owner · Vehicle</div>
              </div>
              
              {/* Vehicle Grid */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Make:</span>
                  <div className="font-medium">{driver.vehicle.make}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <div className="font-medium">{driver.vehicle.model}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Year:</span>
                  <div className="font-medium">{driver.vehicle.year}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Plate:</span>
                  <div className="font-mono text-xs">{driver.vehicle.plateNumber}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Seats:</span>
                  <div className="font-medium">{driver.vehicle.seatingCapacity}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rate:</span>
                  <div className="font-medium text-emerald-600">₹{driver.vehicle.perKmRate}/km</div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-2">
                {/* RC Document */}
                <div className="flex gap-3">
                  <div className="relative h-16 w-28 rounded-md border border-border bg-muted overflow-hidden">
                    {driver.vehicle.rcDocument ? (
                      <Image
                        src={driver.vehicle.rcDocument}
                        alt="RC Document"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted hidden">
                      <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">No RC document</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">RC Document</div>
                    <div className="text-xs text-muted-foreground">Vehicle registration certificate</div>
                  </div>
                </div>

                {/* Insurance */}
                <div className="flex gap-3">
                  <div className="relative h-16 w-28 rounded-md border border-border bg-muted overflow-hidden">
                    {driver.vehicle.insurance ? (
                      <Image
                        src={driver.vehicle.insurance}
                        alt="Insurance"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted hidden">
                      <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">No insurance</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Insurance</div>
                    <div className="text-xs text-muted-foreground">Vehicle insurance document</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {/* Link Route Button */}
              <button
                onClick={handleLinkRoute}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isLinked
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'border-2 border-dashed border-violet-500/60 text-violet-600 hover:bg-violet-50'
                }`}
              >
                {isLinked ? (
                  <span className="flex items-center justify-center gap-2">
                    Route Linked ✓
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Link Route
                  </span>
                )}
              </button>

              {/* Unlink Button (only show when linked) */}
              {isLinked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    unlinkDriverRoute();
                  }}
                  className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-xs font-medium"
                >
                  Unlink
                </button>
              )}

              {/* Send Request Button */}
              <button
                onClick={handleSendRequest}
                disabled={!requestsEnabled || !infoSaved}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !infoSaved
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-violet-500 to-red-500 text-white hover:from-blue-700 hover:via-violet-600 hover:to-red-600'
                }`}
              >
                {!infoSaved ? 'Save trip info first' : 'Send Request'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <RequestConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={onConfirm}
        mode={state.mode as "instant" | "prebooking"}
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
      
      {state.bookingStatus === 'waiting' && (
        <WaitingScreen />
      )}
    </>
  );
}
