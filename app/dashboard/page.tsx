"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Helper function to determine user type
function getUserDashboardType(user: any, vehicles: any[]) {
  const hasDriver = user.roles.includes('driver');
  const hasOwner = user.roles.includes('owner');
  const hasSelfDrivenVehicle = vehicles.some(v => v.selfDriven === true);
  
  if (hasDriver && hasOwner && hasSelfDrivenVehicle) return 'self-driver';
  if (hasOwner && !hasSelfDrivenVehicle) return 'owner';
  if (hasDriver && !hasOwner) return 'driver';
  return 'passenger';
}

export default function DashboardRedirectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    async function redirectToDashboard() {
      try {
        // Fetch user's vehicles to check selfDriven status
        const response = await fetch('/api/profile');
        const data = await response.json();
        const vehicles = data.user?.ownerInfo?.vehicles || [];
        
        const dashboardType = getUserDashboardType(user, vehicles);
        
        // Redirect to appropriate dashboard
        router.push(`/dashboard/${dashboardType}`);
      } catch (error) {
        console.error('Dashboard redirect error:', error);
        // Default to passenger on error
        router.push('/dashboard/passenger');
      } finally {
        setLoading(false);
      }
    }

    redirectToDashboard();
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
