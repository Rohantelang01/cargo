"use client";

import React, { useState } from 'react';
import { useDashboardTrips } from "@/hooks/useDashboardTrips";
import { TripCard } from "@/components/dashboard/trips/TripCard";
import { LoadingCard } from "@/components/dashboard/common/LoadingCard";
import { ErrorState } from "@/components/dashboard/common/ErrorState";
import { EmptyState } from "@/components/dashboard/common/EmptyState";
import { useDashboard } from "@/context/DashboardContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

export default function TripsPage() {
  const { currentRole } = useDashboard();
  const [activeTab, setActiveTab] = useState('ACCEPTED,ENROUTE,STARTED');
  const { trips, loading, error, refetch, startJourney, startTrip, endTrip } = useDashboardTrips(activeTab);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartJourney = async (id: string) => {
    const res = await startJourney(id);
    if (!res.success) alert(res.error);
  };

  const handleStartTrip = async (id: string) => {
    const res = await startTrip(id);
    if (!res.success) alert(res.error);
  };

  const handleEndTrip = async (id: string) => {
    const res = await endTrip(id);
    if (!res.success) alert(res.error);
  };

  const filteredTrips = trips.filter(trip => 
    trip.pickup?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.dropoff?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.passenger?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.driver?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Active Trips</h1>
          <p className="text-muted-foreground">Monitor and manage your current trips</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search trips..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 w-full md:w-[300px]">
            <TabsTrigger value="ACCEPTED,ENROUTE,STARTED">Active</TabsTrigger>
            <TabsTrigger value="COMPLETED,CANCELLED">History</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <LoadingCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filteredTrips.length === 0 ? (
        <EmptyState 
          icon={<Car className="w-12 h-12" />}
          title="No trips found"
          description={searchQuery ? "Try adjusting your search filters" : "You don't have any trips in this category."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrips.map((trip) => (
            <TripCard 
              key={trip._id} 
              trip={trip} 
              role={currentRole}
              onStartJourney={handleStartJourney}
              onStartTrip={handleStartTrip}
              onEndTrip={handleEndTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
}
