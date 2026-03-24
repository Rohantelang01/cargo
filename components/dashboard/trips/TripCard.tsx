import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, User, Car, ArrowRight, Navigation, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface TripCardProps {
  trip: any;
  role: string;
  onStartJourney?: (id: string) => void;
  onStartTrip?: (id: string) => void;
  onEndTrip?: (id: string) => void;
}

export function TripCard({ trip, role, onStartJourney, onStartTrip, onEndTrip }: TripCardProps) {
  const isDriver = role === 'driver';
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Confirmed</Badge>;
      case 'ENROUTE': return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200">Enroute</Badge>;
      case 'STARTED': return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Started</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-200">Completed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="p-5 border-border/50 bg-card/50 hover:bg-card transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">₹{trip.fare?.estimatedFare}</span>
            {getStatusBadge(trip.status)}
          </div>
          <p className="text-xs text-muted-foreground">
            {trip.bookingType} • {format(new Date(trip.createdAt), 'MMM d, h:mm a')}
          </p>
        </div>
        {trip.vehicle?.plateNumber && (
          <Badge variant="secondary" className="font-mono text-[10px]">
            {trip.vehicle.plateNumber}
          </Badge>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Pickup</p>
            <p className="text-sm line-clamp-1 font-medium">{trip.pickup?.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Dropoff</p>
            <p className="text-sm line-clamp-1 font-medium">{trip.dropoff?.address}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0">
            <img 
              src={role === 'passenger' ? (trip.driver?.profileImage || '/placeholder-user.jpg') : (trip.passenger?.profileImage || '/placeholder-user.jpg')} 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-xs">
            <p className="font-medium truncate max-w-[100px]">
              {role === 'passenger' ? trip.driver?.name : trip.passenger?.name}
            </p>
            <p className="text-muted-foreground">{role === 'passenger' ? 'Driver' : 'Passenger'}</p>
          </div>
        </div>

        {isDriver && (
          <div className="flex gap-2">
            {trip.status === 'ACCEPTED' && onStartJourney && (
              <Button size="sm" className="gap-2 px-3" onClick={() => onStartJourney(trip._id)}>
                <Navigation className="w-3.5 h-3.5" /> Start Journey
              </Button>
            )}
            {trip.status === 'ENROUTE' && onStartTrip && (
              <Button size="sm" className="gap-2 px-3" onClick={() => onStartTrip(trip._id)}>
                <ArrowRight className="w-3.5 h-3.5" /> Start Trip
              </Button>
            )}
            {trip.status === 'STARTED' && onEndTrip && (
              <Button size="sm" variant="default" className="gap-2 px-3 bg-green-600 hover:bg-green-700" onClick={() => onEndTrip(trip._id)}>
                <CheckCircle2 className="w-3.5 h-3.5" /> End Trip
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
