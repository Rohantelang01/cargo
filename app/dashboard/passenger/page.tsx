"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { 
  Calendar, 
  Wallet, 
  MapPin, 
  Car,
  Clock,
  TrendingUp,
  DollarSign,
  Home,
  History
} from "lucide-react";

export default function PassengerDashboardPage() {
  const { user } = useAuth();

  // Dummy data
  const stats = {
    totalRides: 24,
    thisMonth: 8,
    walletBalance: 1250,
    totalSpent: 3420
  };

  const activeBooking = {
    id: "BK001",
    pickup: "Warora Main Road",
    destination: "Chandrapur Railway Station",
    driverName: "Ramesh Kumar",
    driverPhone: "+91 98765 43210",
    fare: 150,
    estimatedTime: "25 mins",
    status: "confirmed"
  };

  const bookingHistory = [
    {
      id: "BK001",
      route: "Warora → Chandrapur",
      type: "Instant",
      date: "2024-03-15",
      fare: 150,
      status: "completed"
    },
    {
      id: "BK002", 
      route: "Chandrapur → Nagpur",
      type: "Scheduled",
      date: "2024-03-14",
      fare: 280,
      status: "completed"
    },
    {
      id: "BK003",
      route: "Nagpur → Warora", 
      type: "Instant",
      date: "2024-03-13",
      fare: 180,
      status: "cancelled"
    }
  ];

  const recentTransactions = [
    {
      id: "TXN001",
      description: "Ride payment",
      amount: -150,
      date: "2024-03-15 14:30",
      type: "debit"
    },
    {
      id: "TXN002",
      description: "Wallet recharge",
      amount: 500,
      date: "2024-03-14 10:15",
      type: "credit"
    },
    {
      id: "TXN003",
      description: "Ride payment",
      amount: -80,
      date: "2024-03-13 18:45",
      type: "debit"
    }
  ];

  const savedPlaces = [
    {
      name: "Home",
      address: "Warora Main Road, Near Bus Stand",
      icon: <Home className="w-4 h-4" />
    },
    {
      name: "Work", 
      address: "Chandrapur Civil Lines",
      icon: <MapPin className="w-4 h-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your ride summary
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              This month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.thisMonth}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Wallet balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{stats.walletBalance}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{stats.totalSpent}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Booking */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Active booking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Pickup:</strong> {activeBooking.pickup}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Destination:</strong> {activeBooking.destination}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Driver:</strong> {activeBooking.driverName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Fare:</strong> ₹{activeBooking.fare}
                </div>
              </div>
              <div className="space-y-2">
                <Badge className={getStatusColor(activeBooking.status)}>
                  {activeBooking.status}
                </Badge>
                <Button variant="outline" size="sm" className="w-full">
                  Cancel Booking
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Estimated time: {activeBooking.estimatedTime}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Car className="w-4 h-4 mr-2" />
              Find a ride
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              My bookings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <History className="w-4 h-4 mr-2" />
              Ride history
            </Button>
          </CardContent>
        </Card>

        {/* Wallet Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <span>Wallet snapshot</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ₹{stats.walletBalance}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Available balance
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent transactions
              </div>
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-sm">
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-gray-500 dark:text-gray-400">{transaction.date}</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : ''}₹{Math.abs(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5 text-gray-600" />
            <span>Booking history</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookingHistory.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.route}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {booking.type} • {booking.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{booking.fare}
                  </div>
                  <Badge className={`mt-1 ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Places */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span>Saved places</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPlaces.map((place) => (
              <div key={place.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-3 mb-2">
                  {place.icon}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {place.name}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {place.address}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}