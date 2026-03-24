"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Star, FileText } from "lucide-react";
import Image from "next/image";
import { OwnerOnlyResult } from "@/types/driver";
import { useFindRide } from "@/context/FindRideContext";
import RequestConfirmModal from "@/components/find-ride/modals/RequestConfirmModal";
import WaitingScreen from "@/components/find-ride/modals/WaitingScreen";
import { StatusDot } from "../shared/StatusDot";
import { LicenseImage } from "../shared/LicenseImage";
import { formatAddress, initials } from "../shared/CardHelpers";

interface OwnerCardProps {
  owner: OwnerOnlyResult;
  selected: boolean;
  tripInfo?: {
    distanceKm: number;
    durationMinutes: number;
    pickupCoords: { lat: number; lng: number };
    destinationCoords: { lat: number; lng: number };
  };
}

export function OwnerCard({ owner, selected, tripInfo }: OwnerCardProps) {
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

  const isLinked = state.topBar.linkedDriverId === owner.userId;

  const handleCardClick = () => {
    setSelectedDriver(owner);
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
      linkDriverRoute(owner);
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
          ownerId: owner.userId,
          vehicleId: owner.vehicle._id,
          pickup: state.pickup,
          destination: state.destination,
          passengers: state.passengers,
          vehicleType: state.vehicleType,
          purpose: state.purpose,
          notes: state.notes,
          scheduledDate: state.date,
          scheduledTime: state.time,
          distanceKm: state.topBar.km,
          estimatedFare: owner.estimatedFare,
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
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 opacity-10 pointer-events-none" />
        )}

        {/* Collapsed Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className={`relative h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-semibold ${
              selected ? 'ring-2 ring-offset-2' : ''
            }`}>
              {initials(owner.name)}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{owner.name}</h3>
                <StatusDot status={owner.ownerInfo.status} />
              </div>
              
              <div className="text-sm text-muted-foreground">
                {owner.vehicle.make} {owner.vehicle.model} · {owner.distanceAway} km away
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current" />
                <span>{owner.ownerInfo.rating}</span>
                <span>·</span>
                <span>{owner.ownerInfo.totalTrips} trips</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                  Owner
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-sky-100 text-sky-800 rounded">
                  {owner.vehicle.vehicleType}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                  ₹{owner.vehicle.perKmRate}/km
                </span>
              </div>
            </div>

            {/* Right Side */}
            <div className="text-right">
              <div className="font-semibold text-lg">₹{owner.estimatedFare}</div>
              <div className="text-sm text-muted-foreground">{owner.arrivalMinutes} min</div>
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
              <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-500">Home address</div>
                <div className="text-sm text-muted-foreground">
                  {formatAddress(owner.permanentAddress) || 'No address provided'}
                </div>
              </div>
            </div>

            {/* Vehicle Section */}
            <div>
              <div className="text-sm font-medium mb-2">Vehicle</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Make:</span>
                  <div className="font-medium">{owner.vehicle.make}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <div className="font-medium">{owner.vehicle.model}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Year:</span>
                  <div className="font-medium">{owner.vehicle.year}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Plate:</span>
                  <div className="font-mono text-xs">{owner.vehicle.plateNumber}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Seats:</span>
                  <div className="font-medium">{owner.vehicle.seatingCapacity}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rate:</span>
                  <div className="font-medium text-emerald-600">₹{owner.vehicle.perKmRate}/km</div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <div className="text-sm font-medium mb-2">Documents</div>
              <div className="space-y-2">
                {/* RC Document */}
                <div className="flex gap-3">
                  <div className="relative h-16 w-28 rounded-md border border-border bg-muted overflow-hidden">
                    {owner.vehicle.rcDocument ? (
                      <Image
                        src={owner.vehicle.rcDocument}
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
                    {owner.vehicle.insurance ? (
                      <Image
                        src={owner.vehicle.insurance}
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
        driver={owner}
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
