"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { IUser } from "@/types/driver";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';

import PersonalInformationForm from '@/components/profile/PersonalInformationForm';
import DrivingInformationForm from '@/components/profile/DrivingInformationForm';
import VehicleInformationForm from '@/components/profile/VehicleInformationForm';
import PersonalInformationDisplay from '@/components/profile/PersonalInformationDisplay';
import DrivingInformationDisplay from '@/components/profile/DrivingInformationDisplay';
import VehicleInformationDisplay from '@/components/profile/VehicleInformationDisplay';
import UserProfileHero from '@/components/profile/UserProfileHero';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    // Token helper
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
            const data: IUser = await response.json();
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

    const handleUpdateSection = async (section: string, data: any) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ section, data }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.details || `Failed to update ${section}`);
            }
            
            setProfile(result.user);
            setIsEditing(null);
            return { success: true };

        } catch (err: any) {
            console.error(`Error updating ${section}:`, err.message);
            return { success: false, error: err.message };
        }
    };
    
    const handleDeleteVehicle = async (vehicleId: string) => {
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
            
            setProfile(result.user);
            return { success: true };

        } catch (err: any) {
            console.error("Error deleting vehicle:", err.message);
            return { success: false, error: err.message };
        }
    };

    const hasRole = (role: 'driver' | 'owner') => profile?.roles?.includes(role) ?? false;

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            Loading profile...
        </div>
    );
    
    if (!profile) return (
        <div className="flex justify-center items-center min-h-screen">
            No profile data found.
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
            <UserProfileHero profile={profile} />
            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    {hasRole('driver') 
                        ? <TabsTrigger value="driver">Driving</TabsTrigger> 
                        : <TabsTrigger value="become-driver">Become a Driver</TabsTrigger>
                    }
                    {hasRole('owner') 
                        ? <TabsTrigger value="owner">Vehicle</TabsTrigger> 
                        : <TabsTrigger value="become-owner">Become an Owner</TabsTrigger>
                    }
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Manage your personal details.</CardDescription>
                            </div>
                            <Button 
                                onClick={() => setIsEditing(isEditing === 'personal' ? null : 'personal')} 
                                variant="outline"
                            >
                                {isEditing === 'personal' ? 'Cancel' : 'Edit'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isEditing === 'personal' ? (
                                <PersonalInformationForm 
                                    profile={profile} 
                                    onSave={(data) => handleUpdateSection('personal', data)} 
                                    onCancel={() => setIsEditing(null)} 
                                />
                            ) : (
                                <PersonalInformationDisplay profile={profile} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* Driving Information Tab */}
                <TabsContent value={hasRole('driver') ? 'driver' : 'become-driver'}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>
                                    {hasRole('driver') ? 'Driving Information' : 'Become a Driver'}
                                </CardTitle>
                                <CardDescription>
                                    {hasRole('driver') ? 'Manage your driving details.' : 'Submit your details to become a driver.'}
                                </CardDescription>
                            </div>
                            {hasRole('driver') && (
                                <Button 
                                    onClick={() => setIsEditing(isEditing === 'driverInfo' ? null : 'driverInfo')} 
                                    variant="outline"
                                >
                                    {isEditing === 'driverInfo' ? 'Cancel' : 'Edit'}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {(isEditing === 'driverInfo' || !hasRole('driver')) ? (
                                <DrivingInformationForm 
    data={profile.driverInfo}
    onSave={(data) => handleUpdateSection('driverInfo', data)} 
    onCancel={() => setIsEditing(null)} 
    isLoading={loading}
/>
                            ) : (
                                <DrivingInformationDisplay driverInfo={profile.driverInfo} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Owner Information Tab */}
                <TabsContent value={hasRole('owner') ? 'owner' : 'become-owner'}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>
                                    {hasRole('owner') ? 'Vehicle Information' : 'Become an Owner'}
                                </CardTitle>
                                <CardDescription>
                                    {hasRole('owner') ? 'Manage your vehicle details.' : 'Submit your vehicle details to become an owner.'}
                                </CardDescription>
                            </div>
                            {hasRole('owner') && (
                                <Button 
                                    onClick={() => setIsEditing(isEditing === 'ownerInfo' ? null : 'ownerInfo')} 
                                    variant="outline"
                                >
                                    {isEditing === 'ownerInfo' ? 'Cancel' : 'Edit'}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {hasRole('owner') ? (
                                isEditing === 'ownerInfo' ? (
                                    <VehicleInformationForm 
                                        ownerId={profile._id.toString()}
                                        onSave={(data) => handleUpdateSection('vehicleRegistration', data)}
                                        onDelete={handleDeleteVehicle}
                                        onCancel={() => setIsEditing(null)}
                                        isLoading={loading}
                                    />
                                ) : (
                                    <VehicleInformationDisplay ownerId={profile._id.toString()} />
                                )
                            ) : (
                                <VehicleInformationForm 
                                    ownerId={profile._id.toString()}
                                    onSave={(data) => handleUpdateSection('vehicleRegistration', data)}
                                    onDelete={handleDeleteVehicle}
                                    onCancel={() => setIsEditing(null)}
                                    isLoading={loading}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProfilePage;