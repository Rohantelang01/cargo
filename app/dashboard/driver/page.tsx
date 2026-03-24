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
  AlertCircle
} from "lucide-react";

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [countdown, setCountdown] = useState(60);

  // Dummy data
  const stats = {
    todayEarnings: 1250,
    totalRides: 156,
    rating: 4.8,
    activeHours: 6.5
  };

  const instantRequests = [
    {
      id: "REQ001",
      passengerName: "Priya Sharma",
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
      pickup: "Warora Main Road",
      destination: "Mumbai Airport",
      scheduledTime: "2024-03-20 08:00 AM",
      estimatedFare: 850,
      status: "pending"
    },
    {
      id: "PRE002",
      passengerName: "Vikas Patil",
      pickup: "Chandrapur Station",
      destination: "Pune City Center", 
      scheduledTime: "2024-03-21 02:00 PM",
      estimatedFare: 450,
      status: "pending"
    }
  ];

  const upcomingTrips = [
    {
      id: "TRIP001",
      passengerName: "Priya Sharma",
      route: "Warora → Chandrapur",
      time: "2024-03-15 02:30 PM",
      fare: 150,
      status: "scheduled"
    },
    {
      id: "TRIP002",
      passengerName: "Rahul Verma", 
      route: "Chandrapur → Nagpur",
      time: "2024-03-15 06:00 PM",
      fare: 320,
      status: "scheduled"
    }
  ];

  const earningsSummary = {
    today: 1250,
    week: 6750,
    month: 18500,
    completedTrips: 12
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
    // Handle accept logic
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejected request:', requestId);
    // Handle reject logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const isComboUser = user?.roles?.includes('owner') && user?.roles?.includes('driver');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Driver Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your rides and earnings
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              Total rides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalRides}
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
              Active hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeHours}h
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span>Availability</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status: {isAvailable ? 'Available' : 'Busy'}
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
              onCheckedChange={setIsAvailable}
            />
          </div>
        </CardContent>
      </Card>

      {/* Incoming Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Incoming requests</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instant Requests with Countdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Instant requests
            </h3>
            {instantRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.passengerName}
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
              Prebook requests
            </h3>
            {prebookRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.passengerName}
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
                        {trip.passengerName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {trip.route}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {trip.time} • ₹{trip.fare}
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
                  {earningsSummary.completedTrips}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Completed trips
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
