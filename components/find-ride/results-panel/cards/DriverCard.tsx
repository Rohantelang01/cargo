"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Star } from "lucide-react";
import { DriverOnlyResult } from "@/types/driver";
import { useFindRide } from "@/context/FindRideContext";
import RequestConfirmModal from "@/components/find-ride/modals/RequestConfirmModal";
import WaitingScreen from "@/components/find-ride/modals/WaitingScreen";
import { StatusDot } from "../shared/StatusDot";
import { LicenseImage } from "../shared/LicenseImage";
import { formatAddress, initials } from "../shared/CardHelpers";

interface DriverCardProps {
  driver: DriverOnlyResult;
  selected: boolean;
  tripInfo?: {
    distanceKm: number;
    durationMinutes: number;
    pickupCoords: { lat: number; lng: number };
    destinationCoords: { lat: number; lng: number };
  };
}

export function DriverCard({ driver, selected, tripInfo }: DriverCardProps) {
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

      const response = await fetch('/api/bookings/prebooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          driverId: driver.userId,
          pickup: state.pickup,
          destination: state.destination,
          passengers: state.passengers,
          vehicleType: state.vehicleType,
          purpose: state.purpose,
          notes: state.notes,
          scheduledDate: state.date,
          scheduledTime: state.time,
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
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 opacity-10 pointer-events-none" />
        )}

        {/* Collapsed Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className={`relative h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold ${
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
                {matchedLicense?.licenseType} · {driver.distanceAway} km away
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current" />
                <span>{driver.driverInfo.rating}</span>
                <span>·</span>
                <span>{driver.driverInfo.totalTrips} trips</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  Driver
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-800 rounded">
                  {matchedLicense?.licenseType}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                  ₹{matchedLicense?.hourlyRate}/hr
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
            {/* Home Address */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-500">Home address</div>
                <div className="text-sm text-muted-foreground">
                  {formatAddress(driver.permanentAddress) || 'No address provided'}
                </div>
              </div>
            </div>

            {/* Matched License */}
            <div>
              <div className="text-sm font-medium mb-2">Matched License</div>
              <LicenseImage lic={matchedLicense} />
            </div>

            {/* All Licenses (if multiple) */}
            {driver.driverInfo.licenses.length > 1 && (
              <details className="group">
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

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {/* Link Route Button */}
              <button
                onClick={handleLinkRoute}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isLinked
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'border-2 border-dashed border-primary/60 text-primary hover:bg-primary/10'
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
                    : 'bg-gradient-to-r from-blue-600 to-primary text-white hover:from-blue-700 hover:to-primary/90'
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
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        mode="prebooking"
        driver={driver}
        tripInfo={{
          pickup: state.pickup,
          destination: state.destination,
          distanceKm: tripInfo?.distanceKm ?? 0,
          durationMin: tripInfo?.durationMinutes ?? 0,
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
