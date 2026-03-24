
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, DollarSign, MapPin, Shield, Star, User, Car, Briefcase, Wallet } from "lucide-react";
import dynamic from 'next/dynamic';
import { useState } from "react";
import ModeToggle from "@/components/wallet/ModeToggle";

// Dynamically import the Map component with SSR turned off
const Map = dynamic(() => import('@/components/common/Map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full flex items-center justify-center bg-gray-200"><p>Loading map...</p></div>,
});


// 1. Hero Section (Placeholder Removed)
const HeroSection = () => {
  const [mode, setMode] = useState<'testing' | 'production'>('testing');
  
  return (
    <section className="relative bg-blue-600 text-white py-20 md:py-32 animate-slide-up">
      <div className="container mx-auto text-center px-4">
        {/* Demo Toggle */}
        <div className="flex justify-end mb-4">
          <ModeToggle onModeChange={setMode} />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Revolutionize Your Rides with Carbo: Ride-Share, Rent, or Own Road
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto">
          Our hybrid system benefits everyone. Passengers get flexible booking, drivers earn more, and owners maximize their vehicle's potential.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Book a Ride
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
            Become a Driver/Owner
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
    </section>
  );
};

// 2. Interactive Map Section
const InteractiveMapSection = () => (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Find Your Ride Now</h2>
            <div className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl">
                 <Map />
            </div>
        </div>
    </section>
);


// 3. Features Section
const FeaturesSection = () => (
  <section className="py-20 bg-white dark:bg-gray-800">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Carbo is Different</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: <Clock size={40} className="text-blue-500" />, title: "Easy Booking Types", description: "Choose from Advance (2-6h), Instant (2-3min), or Planned Trips to fit your schedule." },
          { icon: <DollarSign size={40} className="text-green-500" />, title: "Flexible Earnings", description: "Drivers and owners earn competitive fares with our transparent hourly, per-km, and commission-based system." },
          { icon: <Wallet size={40} className="text-yellow-500" />, title: "Secure Wallets", description: "Manage your earnings and payments with our secure Added and Generated Cash wallets." },
          { icon: <MapPin size={40} className="text-red-500" />, title: "Live Tracking", description: "Track your ride in real-time for safety and convenience. Know exactly when your ride will arrive." },
          { icon: <Star size={40} className="text-purple-500" />, title: "Ratings System", description: "Our two-way rating system ensures a high-quality experience for both passengers and drivers." },
           { icon: <Shield size={40} className="text-indigo-500" />, title: "Verified & Secure", description: "All users undergo KYC verification for a trusted and secure ride-sharing environment." },
        ].map((feature, index) => (
          <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// 4. User Roles Section
const UserRolesSection = () => (
  <section className="py-20 bg-white dark:bg-gray-800">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Who is Carbo For?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6">
          <CardHeader className="flex items-center gap-4">
            <User className="text-blue-500" size={32} />
            <CardTitle>Passenger</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Book rides instantly or schedule in advance.</li>
              <li>Track your driver in real-time.</li>
              <li>Make secure payments through the app.</li>
              <li>Rate your driver and trip experience.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex items-center gap-4">
            <Briefcase className="text-green-500" size={32} />
            <CardTitle>Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Accept ride requests that fit your schedule.</li>
              <li>Earn from fares and get paid securely.</li>
              <li>Use your own or a rented vehicle.</li>
              <li>Rate passengers after each trip.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex items-center gap-4">
            <Car className="text-purple-500" size={32} />
            <CardTitle>Vehicle Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Rent your vehicle to drivers.</li>
              <li>Create and manage planned trips.</li>
              <li>Earn passive income from your asset.</li>
              <li>Rate drivers using your vehicle.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

// 5. How It Works Section
const HowItWorksSection = () => (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Simple Steps to Get Started</h2>
        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

          {/* Timeline Items */}
          <div className="space-y-16">
            {[
              { step: 1, title: "Sign Up & Verify", description: "Create your account and complete a quick KYC verification to ensure safety for all users." },
              { step: 2, title: "Book or List a Ride", description: "Passengers book a ride, while drivers and owners list their availability or vehicles." },
              { step: 3, title: "Accept & Start the Trip", description: "Drivers accept a ride, pick up the passenger, and start the journey with live tracking." },
              { step: 4, title: "Complete & Pay", description: "The trip ends, payment is processed securely, and both parties can rate each other." },
            ].map((item, index) => (
              <div key={item.step} className={`flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="md:w-1/2 p-4">
                  <div className={`md:max-w-md ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                    <div className="text-blue-500 font-bold">Step {item.step}</div>
                    <h3 className="text-2xl font-semibold mt-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-4">{item.description}</p>
                  </div>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-blue-500 text-white rounded-full items-center justify-center font-bold text-xl absolute left-1/2 -translate-x-1/2">
                  {item.step}
                </div>
                {/* Spacer for mobile */}
                <div className="md:w-1/2 p-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );


// 6. Pricing Section
const PricingSection = () => (
  <section className="py-20 bg-white dark:bg-gray-800">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Transparent Pricing</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
        Our fares are calculated based on a combination of time and distance, plus a small service commission. Here are a few examples of how earnings are distributed.
      </p>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Scenario</TableHead>
              <TableHead>Passenger Pays</TableHead>
              <TableHead>Driver Earns</TableHead>
              <TableHead>Owner Earns</TableHead>
              <TableHead className="text-right">Carbo Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Driver owns their vehicle</TableCell>
              <TableCell>₹500</TableCell>
              <TableCell>₹450</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell className="text-right">₹50 (10%)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Driver rents from an owner</TableCell>
              <TableCell>₹500</TableCell>
              <TableCell>₹300</TableCell>
              <TableCell>₹150</TableCell>
              <TableCell className="text-right">₹50 (10%)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Owner drives their own vehicle</TableCell>
              <TableCell>₹500</TableCell>
              <TableCell>₹450</TableCell>
               <TableCell>N/A (as driver)</TableCell>
              <TableCell className="text-right">₹50 (10%)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      <p className="text-center text-sm text-gray-500 mt-4">
        *Cancellation fee of ₹15 may apply as per platform policy.
      </p>
    </div>
  </section>
);


export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <InteractiveMapSection />
      <FeaturesSection />
      <UserRolesSection />
      <HowItWorksSection />
      <PricingSection />
    </main>
  );
}
