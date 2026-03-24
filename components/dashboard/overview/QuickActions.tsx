import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
  role: string;
}

export function QuickActions({ role }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {role === 'passenger' && (
        <>
          <Link href="/find-ride">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Book a Ride
            </Button>
          </Link>
          <Link href="/history">
            <Button size="sm" variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Find Trips
            </Button>
          </Link>
        </>
      )}
      
      {role === 'driver' && (
        <>
          <Button size="sm" className="gap-2">
            <MapPin className="w-4 h-4" />
            Go Online
          </Button>
          <Link href="/dashboard/earnings">
            <Button size="sm" variant="outline" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              View Earnings
            </Button>
          </Link>
        </>
      )}

      {role === 'owner' && (
        <>
          <Link href="/dashboard/vehicles">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </Link>
          <Link href="/dashboard/vehicles">
            <Button size="sm" variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Manage Fleet
            </Button>
          </Link>
        </>
      )}
      
      {(role === 'self-driver' || role === 'self-driver-owner') && (
        <>
          <Button size="sm" className="gap-2">
            <MapPin className="w-4 h-4" />
            Go Online
          </Button>
          <Link href="/dashboard/vehicles">
            <Button size="sm" variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Vehicle Settings
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

import { TrendingUp } from 'lucide-react';
