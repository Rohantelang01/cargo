"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { 
  Car, 
  DollarSign, 
  Star, 
  Clock,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Settings,
  Activity
} from "lucide-react";

export default function SelfDriverDashboardPage() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [countdown, setCountdown] = useState(60);

  // Stats data
  const stats = {
    totalTrips: 142,
    todayEarnings: 1850,
    totalEarnings: 28500,
    activeBookings: 2,
    rating: 4.9,
    vehicleStatus: "AVAILABLE"
  };

  const instantRequests = [
    {
      id: "REQ001",
      passengerName: "Priya Sharma",
      passengerPhone: "+91 98765 43210",
      passengerRating: 4.8,
      pickup: "Warora Bus Stand",
      destination: "Chandrapur Railway Station",
      estimatedFare: 150,
      distance: "12 km",
      time: "25 mins",
      status: "pending"
    },
    {
      id: "REQ002", 
      passengerName: "Rahul Verma",
      passengerPhone: "+91 98765 1111",
      passengerRating: 4.7,
      pickup: "Chandrapur Civil Lines",
      destination: "Nagpur Airport",
      estimatedFare: 320,
      distance: "28 km",
      time: "45 mins",
      status: "pending"
    }
  ];

  const prebookRequests = [
    {
      id: "PRE001",
      passengerName: "Anita Deshmukh",
      passengerPhone: "+91 98765 2222",
      passengerRating: 4.9,
      pickup: "Warora Main Road",
      destination: "Mumbai Airport",
      scheduledTime: "2024-03-20 08:00 AM",
      estimatedFare: 850,
      status: "pending"
    }
  ];

  const activeTrip = {
    id: "TRIP001",
    passengerName: "Suresh Patel",
    passengerPhone: "+91 98765 3333",
    route: "Warora → Chandrapur",
    fare: 180,
    status: "STARTED",
    startTime: "2024-03-15 02:30 PM"
  };

  const myVehicle = {
    name: "Toyota Innova",
    plateNumber: "MH-12-AB-1234",
    type: "SUV",
    status: "AVAILABLE",
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-05-15",
    todayTrips: 8
  };

  const earningsSummary = {
    today: 1850,
    week: 9250,
    month: 24500,
    driverEarnings: 14700,
    ownerEarnings: 9800
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 60;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accepted request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejected request:', requestId);
  };

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'ON_TRIP': return 'bg-blue-100 text-blue-800';
      case 'OFFLINE': return 'bg-gray-100 text-gray-800';
      case 'STARTED': return 'bg-blue-100 text-blue-800';
      case 'ENROUTE': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Self Driver Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your vehicle, rides, and combined earnings
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalTrips}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Today's earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{stats.todayEarnings}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{stats.totalEarnings}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeBookings}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.rating}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Vehicle status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {stats.vehicleStatus}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-blue-600" />
            <span>My Vehicle</span>
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
                  <Calendar className="w-4 h-4" />
                  <span>Today's trips: {myVehicle.todayTrips}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Settings className="w-4 h-4" />
                  <span>Next maintenance: {myVehicle.nextMaintenance}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Driver Status
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isAvailable 
                      ? 'You will receive ride requests' 
                      : 'You will not receive new requests'
                    }
                  </div>
                </div>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={handleToggleAvailability}
                />
              </div>
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Track Vehicle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Trip */}
      {activeTrip && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Active Trip</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeTrip.passengerName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    📞 {activeTrip.passengerPhone}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Route:</strong> {activeTrip.route}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Started:</strong> {activeTrip.startTime}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Fare:</strong> ₹{activeTrip.fare}
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge className={getStatusColor(activeTrip.status)}>
                    {activeTrip.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="w-4 h-4 mr-1" />
                      Track
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      End Trip
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Incoming Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Incoming Requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instant Requests */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Instant Requests
            </h3>
            {instantRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.passengerName} ⭐ {request.passengerRating}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      📞 {request.passengerPhone}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {request.pickup} → {request.destination}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {request.distance} • {request.time} • ₹{request.estimatedFare}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">
                      {countdown}s
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prebook Requests */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Prebook Requests
            </h3>
            {prebookRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.passengerName} ⭐ {request.passengerRating}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      📞 {request.passengerPhone}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {request.pickup} → {request.destination}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {request.scheduledTime} • ₹{request.estimatedFare}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRejectRequest(request.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Earnings Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Earnings Summary</span>
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
                  {stats.totalTrips}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total trips
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Earnings Breakdown
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Driver Earnings (60%)</span>
                  <span className="font-medium">₹{earningsSummary.driverEarnings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Owner Earnings (40%)</span>
                  <span className="font-medium">₹{earningsSummary.ownerEarnings}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-green-600">
                  <span>Total Combined</span>
                  <span>₹{earningsSummary.month}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Earnings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Trip History
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Vehicle Settings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              Maintenance Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
