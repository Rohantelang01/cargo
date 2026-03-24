import React from 'react';
import { useDashboardTrips } from '@/hooks/useDashboardTrips';
import { EmptyState } from '../common/EmptyState';
import { LoadingCard } from '../common/LoadingCard';
import { Car, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface ActiveTripsCardProps {
  role: string;
}

export function ActiveTripsCard({ role }: ActiveTripsCardProps) {
  const { trips, loading, error } = useDashboardTrips('ACCEPTED,ENROUTE,STARTED');

  if (loading) return <LoadingCard />;
  
  if (trips.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 h-full">
        <h3 className="text-lg font-semibold mb-6">Active Trips</h3>
        <EmptyState 
          icon={<Car className="w-10 h-10" />}
          title="No active trips"
          description="You don't have any ongoing or upcoming trips right now."
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Active Trips</h3>
        <Link href="/dashboard/trips">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip._id} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex justify-between items-start mb-4">
              <Badge variant={
                trip.status === 'STARTED' ? 'default' : 
                trip.status === 'ENROUTE' ? 'secondary' : 'outline'
              }>
                {trip.status}
              </Badge>
              <span className="text-sm font-medium">₹{trip.fare.estimatedFare}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-green-500/10 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <p className="text-sm line-clamp-1">{trip.pickup.address}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-primary/10 rounded-full">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm line-clamp-1">{trip.dropoff.address}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
                  <img 
                    src={role === 'passenger' ? (trip.driver?.profileImage || '/placeholder-user.jpg') : (trip.passenger?.profileImage || '/placeholder-user.jpg')} 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-medium">{role === 'passenger' ? trip.driver?.name : trip.passenger?.name}</p>
                  <p className="text-muted-foreground">{role === 'passenger' ? 'Driver' : 'Passenger'}</p>
                </div>
              </div>
              <Link href={`/dashboard/trips/${trip._id}`}>
                <Button size="sm" variant="ghost" className="gap-1 px-2">
                  Details <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
