"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { IUser } from "@/types/driver";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useDashboard } from "@/context/DashboardContext";
import VehicleInformationForm from '@/components/profile/VehicleInformationForm';
import VehicleInformationDisplay from '@/components/profile/VehicleInformationDisplay';
import { AlertCircle, Plus, LayoutDashboard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VehiclesPage() {
  const { user } = useAuth();
  const { currentRole, refreshDashboard } = useDashboard();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data);
    } catch (err: any) {
      console.error("Error fetching profile:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleSaveVehicle = async (data: any) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ section: 'vehicleRegistration', data }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.details || 'Failed to update vehicle');
      }
      
      setProfile(result.user);
      setIsEditing(false);
      refreshDashboard(); // Update counts in sidebar/stats
      return { success: true };
    } catch (err: any) {
      console.error("Error saving vehicle:", err.message);
      return { success: false, error: err.message };
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return { success: false };
    
    try {
      const response = await fetch(`/api/profile/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete vehicle');
      }
      
      await fetchProfile(); // Refresh list
      refreshDashboard();
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting vehicle:", err.message);
      return { success: false, error: err.message };
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load profile data. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isOwner = profile.roles?.includes('owner');
  const isSelfDriver = profile.roles?.includes('driver') && profile.ownerInfo?.vehicles?.some((v: any) => v.selfDriven);

  if (!isOwner && !isSelfDriver && currentRole !== 'owner' && currentRole !== 'self-driver') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <LayoutDashboard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Become an Owner</CardTitle>
            <CardDescription>
              You don't have any vehicles registered yet. Register a vehicle to start earning as an owner or self-driver.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Register Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Vehicle Management</h1>
          <p className="text-muted-foreground">Manage your fleet, rates, and availability</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
          {isEditing ? 'View Fleet' : 'Add Vehicle'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Vehicle Registration' : 'Your Fleet'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Fill in the details to add or update a vehicle. Remember that self-driven vehicles are reserved for your use only.' 
              : 'View and manage all your registered vehicles. You can toggle availability and update rates here.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <VehicleInformationForm 
              ownerId={profile._id.toString()}
              onSave={handleSaveVehicle}
              onDelete={handleDeleteVehicle}
              onCancel={() => setIsEditing(false)}
              isLoading={loading}
            />
          ) : (
            <VehicleInformationDisplay ownerId={profile._id.toString()} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
