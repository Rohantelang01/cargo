"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Star } from "lucide-react";
import { PairResult } from "@/types/driver";
import { useFindRide } from "@/context/FindRideContext";
import RequestConfirmModal from "@/components/find-ride/modals/RequestConfirmModal";
import WaitingScreen from "@/components/find-ride/modals/WaitingScreen";
import { StatusDot } from "../shared/StatusDot";
import { formatAddress, initials } from "../shared/CardHelpers";

interface PairCardProps {
  pair: PairResult;
  selected: boolean;
  tripInfo?: {
    distanceKm: number;
    durationMinutes: number;
    pickupCoords: { lat: number; lng: number };
    destinationCoords: { lat: number; lng: number };
  };
}

export function PairCard({ pair, selected, tripInfo }: PairCardProps) {
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

  const isLinked = state.topBar.linkedDriverId === pair.pairId;

  const handleCardClick = () => {
    setSelectedDriver(pair);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleLinkRoute = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("🔗 Link Route clicked for pair:", pair);
    console.log("📦 Pair structure:", JSON.stringify(pair, null, 2));
    console.log("👥 Pair type:", pair.type);
    console.log("🚗 Driver coords:", pair.driver?.permanentAddress?.coordinates);
    console.log("🏠 Owner coords:", pair.owner?.permanentAddress?.coordinates);
    
    if (isLinked) {
      unlinkDriverRoute();
    } else {
      linkDriverRoute(pair);
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
          driverId: pair.driver.userId,
          ownerId: pair.owner.userId,
          vehicleId: pair.owner.vehicle._id,
          pairId: pair.pairId,
          pickup: state.pickup,
          destination: state.destination,
          passengers: state.passengers,
          vehicleType: state.vehicleType,
          purpose: state.purpose,
          notes: state.notes,
          scheduledDate: state.date,
          scheduledTime: state.time,
          distanceKm: state.topBar.km,
          estimatedFare: pair.estimatedFare,
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
        {/* Selection gradient strip */}
        {selected && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-violet-500 to-red-500 opacity-10 pointer-events-none" />
        )}

        {/* Collapsed Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Overlapping Avatars */}
            <div className="relative">
              {/* Driver Avatar (back) */}
              <div className="absolute -left-1 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-background">
                {initials(pair.driver.name)}
              </div>
              {/* Owner Avatar (front) */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-background ml-6">
                {initials(pair.owner.name)}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">
                {pair.driver.name} + {pair.owner.name}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {pair.owner.vehicle.make} {pair.owner.vehicle.model} · Prebooking pair
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  Driver·{pair.matchedLicense.licenseType}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                  Owner·{pair.owner.vehicle.vehicleType}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                  ₹{pair.estimatedFare} total
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                  {pair.legs.tripKm}km trip
                </span>
              </div>
            </div>

            {/* Right Side */}
            <div className="text-right">
              <div className="font-semibold text-lg">₹{pair.estimatedFare}</div>
              <div className="text-sm text-muted-foreground">{pair.arrivalMinutes} min</div>
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
            {/* DRIVER SECTION */}
            <div className="border-l-2 border-blue-500 pl-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="text-sm font-medium">Driver</div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {initials(pair.driver.name)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{pair.driver.name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{pair.driver.driverInfo.rating}</span>
                    <span>·</span>
                    <span>{pair.driver.driverInfo.totalTrips} trips</span>
                    <span>·</span>
                    <span>{pair.driver.distanceAway} km away</span>
                  </div>
                </div>
              </div>

              {/* License Details */}
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <div className="font-medium">{pair.matchedLicense.licenseType}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Number:</span>
                  <div className="font-mono text-xs">{pair.matchedLicense.licenseNumber}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rate:</span>
                  <div className="font-medium text-emerald-600">₹{pair.matchedLicense.hourlyRate}/hr</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Valid till:</span>
                  <div className="font-medium">
                    {pair.matchedLicense.expiryDate ? new Date(pair.matchedLicense.expiryDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Driver Home Address */}
              <div className="flex items-start gap-2 mt-2">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-500">Home address</div>
                  <div className="text-sm text-muted-foreground">
                    {formatAddress(pair.driver.permanentAddress) || 'No address provided'}
                  </div>
                </div>
              </div>
            </div>

            {/* OWNER SECTION */}
            <div className="border-l-2 border-red-500 pl-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="text-sm font-medium">Owner</div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-semibold text-sm">
                  {initials(pair.owner.name)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{pair.owner.name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{pair.owner.ownerInfo.rating}</span>
                    <span>·</span>
                    <span>{pair.owner.ownerInfo.totalTrips} trips</span>
                    <span>·</span>
                    <span>{pair.owner.distanceAway} km away</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>
                  <span className="text-muted-foreground">Make:</span>
                  <div className="font-medium">{pair.owner.vehicle.make}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <div className="font-medium">{pair.owner.vehicle.model}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Plate:</span>
                  <div className="font-mono text-xs">{pair.owner.vehicle.plateNumber}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Seats:</span>
                  <div className="font-medium">{pair.owner.vehicle.seatingCapacity}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rate:</span>
                  <div className="font-medium text-emerald-600">₹{pair.owner.vehicle.perKmRate}/km</div>
                </div>
              </div>

              {/* Owner Home Address */}
              <div className="flex items-start gap-2 mt-2">
                <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-red-500">Home address</div>
                  <div className="text-sm text-muted-foreground">
                    {formatAddress(pair.owner.permanentAddress) || 'No address provided'}
                  </div>
                </div>
              </div>
            </div>

            {/* FARE BREAKDOWN SECTION */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="text-sm font-medium">Fare breakdown</div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver rate:</span>
                  <span>₹{pair.fareBreakdown.driverRate} ({(pair.fareBreakdown.driverRate / pair.matchedLicense.hourlyRate).toFixed(1)}hr × ₹{pair.matchedLicense.hourlyRate})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle rate:</span>
                  <span>₹{pair.fareBreakdown.ownerRate} ({pair.legs.tripKm}km × ₹{pair.owner.vehicle.perKmRate})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee:</span>
                  <span>₹{pair.fareBreakdown.platformFee} ({pair.legs.tripKm}km × ₹1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup/return:</span>
                  <span>₹{pair.fareBreakdown.pickupReturnCharge} ({((pair.driver.distanceAway + pair.owner.distanceAway)).toFixed(1)}km × ₹1 × 2)</span>
                </div>
                <div className="border-t pt-1">
                  <div className="flex justify-between font-semibold text-blue-600">
                    <span>Total:</span>
                    <span>₹{pair.fareBreakdown.totalFare}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-1 border-t">
                Trip: {pair.legs.tripKm}km · ~{(pair.legs.total / 40).toFixed(1)}hr · 5-leg route
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
                    : 'border-2 border-dashed border-blue-500/60 text-blue-600 hover:bg-blue-50'
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
        driver={pair}
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
