import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, User, Car, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface RequestCardProps {
  request: any;
  role: string;
  onRespond?: (requestId: string, response: 'ACCEPTED' | 'REJECTED') => void;
}

export function RequestCard({ request, role, onRespond }: RequestCardProps) {
  const isPassenger = role === 'passenger';
  const isDriver = role === 'driver';
  const isOwner = role === 'owner';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'BOTH_ACCEPTED': return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Wait for Confirm</Badge>;
      case 'CONFIRMED': return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Confirmed</Badge>;
      case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const showActions = (isDriver && request.driverResponse === 'PENDING') || 
                      (isOwner && request.ownerResponse === 'PENDING');

  return (
    <Card className="p-5 border-border/50 bg-card/50 hover:bg-card transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">₹{request.estimatedFare}</span>
            {getStatusBadge(request.status)}
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium px-2 py-1 bg-secondary rounded text-secondary-foreground">
            {request.distanceKm} km
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 w-2 h-2 rounded-full bg-green-500" />
          <p className="text-sm line-clamp-1">{request.booking?.pickup?.address}</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
          <p className="text-sm line-clamp-1">{request.booking?.dropoff?.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <div className="text-xs">
            <p className="text-muted-foreground">Passenger</p>
            <p className="font-medium">{request.passenger?.name || 'User'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-muted-foreground" />
          <div className="text-xs">
            <p className="text-muted-foreground">Vehicle</p>
            <p className="font-medium truncate">{request.pair?.vehicle?.make} {request.pair?.vehicle?.model}</p>
          </div>
        </div>
      </div>

      {showActions && onRespond && (
        <div className="grid grid-cols-2 gap-2 mt-5">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-destructive hover:bg-destructive/10"
            onClick={() => onRespond(request._id, 'REJECTED')}
          >
            <X className="w-4 h-4" /> Reject
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => onRespond(request._id, 'ACCEPTED')}
          >
            <Check className="w-4 h-4" /> Accept
          </Button>
        </div>
      )}
    </Card>
  );
}
