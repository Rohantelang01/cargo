"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { 
  Car, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Settings,
  MapPin
} from "lucide-react";

export default function OwnerDashboardPage() {
  const { user } = useAuth();

  // Dummy data
  const stats = {
    vehicleEarnings: 8500,
    totalTrips: 89,
    activeDays: 24,
    pairedRides: 67
  };

  const myVehicle = {
    name: "Toyota Innova",
    plateNumber: "MH-12-AB-1234",
    type: "SUV",
    status: "active",
    driverName: "Ramesh Kumar",
    driverPhone: "+91 98765 43210",
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-05-15"
  };

  const pairRequests = [
    {
      id: "PAIR001",
      driverName: "Suresh Patel",
      driverPhone: "+91 98765 1111",
      driverRating: 4.7,
      tripDetails: {
        route: "Warora → Chandrapur",
        date: "2024-03-15",
        time: "10:00 AM",
        estimatedFare: 180
      },
      status: "pending"
    },
    {
      id: "PAIR002",
      driverName: "Amit Singh",
      driverPhone: "+91 98765 2222", 
      driverRating: 4.9,
      tripDetails: {
        route: "Chandrapur → Nagpur",
        date: "2024-03-15",
        time: "02:00 PM",
        estimatedFare: 320
      },
      status: "pending"
    }
  ];

  const upcomingTrips = [
    {
      id: "TRIP001",
      driverName: "Ramesh Kumar",
      route: "Warora → Chandrapur",
      date: "2024-03-15 10:00 AM",
      fare: 180,
      status: "confirmed"
    },
    {
      id: "TRIP002",
      driverName: "Suresh Patel",
      route: "Chandrapur → Nagpur", 
      date: "2024-03-15 02:00 PM",
      fare: 320,
      status: "confirmed"
    },
    {
      id: "TRIP003",
      driverName: "Amit Singh",
      route: "Nagpur → Warora",
      date: "2024-03-16 09:00 AM", 
      fare: 280,
      status: "scheduled"
    }
  ];

  const earningsSummary = {
    today: 850,
    week: 4250,
    month: 18500,
    totalTrips: 15
  };

  const handleAcceptPair = (pairId: string) => {
    console.log('Accepted pair request:', pairId);
    // Handle accept logic
  };

  const handleRejectPair = (pairId: string) => {
    console.log('Rejected pair request:', pairId);
    // Handle reject logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isComboUser = user?.roles?.includes('owner') && user?.roles?.includes('driver');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Owner Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your vehicle and partnerships
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Vehicle earnings this month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{stats.vehicleEarnings}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalTrips}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeDays}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Paired rides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pairedRides}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Vehicle Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-blue-600" />
            <span>My vehicle</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {myVehicle.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {myVehicle.type} • {myVehicle.plateNumber}
                  </div>
                </div>
                <Badge className={getStatusColor(myVehicle.status)}>
                  {myVehicle.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>Driver: {myVehicle.driverName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Last maintenance: {myVehicle.lastMaintenance}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Next maintenance: {myVehicle.nextMaintenance}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Vehicle Settings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Maintenance Schedule
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Track Vehicle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pair Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span>Pair requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pairRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {request.driverName}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>⭐ {request.driverRating}</span>
                    <span>📞 {request.driverPhone}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Trip:</strong> {request.tripDetails.route}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Time:</strong> {request.tripDetails.date} at {request.tripDetails.time}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Fare:</strong> ₹{request.tripDetails.estimatedFare}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleAcceptPair(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRejectPair(request.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {pairRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No pending pair requests
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Upcoming trips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {trip.driverName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {trip.route}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {trip.date} • ₹{trip.fare}
                      </div>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Earnings summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{earningsSummary.today}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Today
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ₹{earningsSummary.week}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  This week
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ₹{earningsSummary.month}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  This month
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {earningsSummary.totalTrips}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total trips
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
